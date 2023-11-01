import KeyListener from "@foxglove/studio-base/components/KeyListener";
import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import { Sync as SyncIcon } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SearchBar } from "../../../components/SearchBar";
import { useServerAnnotations } from "../apiClients";
import { useSeekPlaybackToAnnotation } from "../hooks/useSeekPlaybackToAnnotation";
import { useAnnotationsState } from "../stores/annotation";
import { useIsAdding } from "../stores/isAdding";
import { useSearchState } from "../stores/search";
import { foxgloveTimeToUnixtime } from "../utils";
import { AnnotationRow } from "./AnnotationRow";
import { TopicFilter } from "./TopicFilter";

export const AnnotationList = () => {
  const annotations = useAnnotationsState((state) => state.annotations);
  const sortedAnnotations = useMemo(
    () =>
      annotations
        ? [...annotations].sort((a, b) => a.timestamp_from - b.timestamp_from)
        : undefined,
    [annotations],
  );
  const [latestSearchedText, setLatestSearchedText] = useState("");
  const [searchAnnotationSwitch, setSearchAnnotationSwitch] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[] | undefined>(undefined);

  const { fetchedAnnotations } = useServerAnnotations();
  const {
    highlightedTexts,
    searchResult,
    setHighlightedTexts,
    setSearchResult,
    searchText,
    setSearchText,
    index,
  } = useSearchState();

  const selectStartTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.startTime;
  const selectEndTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.endTime;
  const startTime = useMessagePipeline(selectStartTime) || { sec: 0, nsec: 0 };
  const endTime = useMessagePipeline(selectEndTime) || { sec: 0, nsec: 0 };
  const { fetchServerAnnotations } = useServerAnnotations();

  React.useEffect(() => {
    const updateSearchText = async () => {
      if (searchText !== latestSearchedText || searchAnnotationSwitch) {
        setSearchAnnotationSwitch(false);
        annotations?.forEach(async ({ comment, id }) => await index.addAsync(id, comment));
        const newSearchResult = searchText ? new Set(await index.searchAsync(searchText)) : null;
        setSearchResult(newSearchResult);
        setHighlightedTexts(searchText.split(" "));
        setLatestSearchedText(searchText);
      }
    };
    // If user input it too fast, pending search. Because search process can be bottleneck of use input
    const timeoutId = setTimeout(updateSearchText, 100);
    // Sometime, a search process can get ahead of previous processes. So we should periodically check it.
    const intervalId = setInterval(updateSearchText, 1000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [
    searchText,
    latestSearchedText,
    searchAnnotationSwitch,
    annotations,
    index,
    setSearchResult,
    setHighlightedTexts,
  ]);

  useEffect(() => {
    setSearchAnnotationSwitch(true);
  }, [
    // NOTE: if deps have annotations, endless loop will occur
    fetchedAnnotations,
    setSearchAnnotationSwitch,
  ]);

  const editingAnnotationId = useAnnotationsState((state) => state.editingAnnotationId);

  const editingHasUpdate = useAnnotationsState((state) => state.editingHasUpdate);
  const isAdding = useIsAdding((state) => state.isAdding);
  const startEditing = useAnnotationsState((state) => state.startEditing);

  const setTriggerShakingAnimation = useAnnotationsState(
    (state) => state.setTriggerShakingAnimation,
  );
  const seekPlaybackToAnnotation = useSeekPlaybackToAnnotation();

  const handleSelectNextAnnotation = useCallback(() => {
    if (!sortedAnnotations) return;
    if (editingHasUpdate || isAdding) {
      setTriggerShakingAnimation(true);
      return;
    }
    let nextAnnotationIndex = 0;
    if (editingAnnotationId) {
      const editingAnnotationIndex = sortedAnnotations.findIndex(
        (annotation) => annotation.id === editingAnnotationId,
      );
      nextAnnotationIndex = editingAnnotationIndex + 1;
    }
    if (nextAnnotationIndex >= sortedAnnotations.length) return;
    const nextAnnotation = sortedAnnotations[nextAnnotationIndex];
    if (!nextAnnotation) return;
    seekPlaybackToAnnotation(nextAnnotation);
    startEditing(nextAnnotation.id);
  }, [
    editingAnnotationId,
    sortedAnnotations,
    editingHasUpdate,
    isAdding,
    startEditing,
    setTriggerShakingAnimation,
    seekPlaybackToAnnotation,
  ]);

  const handleSelectPrevAnnotation = useCallback(() => {
    if (!sortedAnnotations) return;
    if (editingHasUpdate || isAdding) {
      setTriggerShakingAnimation(true);
      return;
    }
    let prevAnnotationIndex = sortedAnnotations.length - 1;
    if (editingAnnotationId) {
      const editingAnnotationIndex = sortedAnnotations.findIndex(
        (annotation) => annotation.id === editingAnnotationId,
      );
      prevAnnotationIndex = editingAnnotationIndex - 1;
    }
    if (prevAnnotationIndex <= -1) return;
    const prevAnnotation = sortedAnnotations[prevAnnotationIndex];
    if (!prevAnnotation) return;
    seekPlaybackToAnnotation(prevAnnotation);
    startEditing(prevAnnotation.id);
  }, [
    editingAnnotationId,
    sortedAnnotations,
    editingHasUpdate,
    isAdding,
    startEditing,
    setTriggerShakingAnimation,
    seekPlaybackToAnnotation,
  ]);

  const { keyUpHandlers, keyDownHandlers } = useMemo(
    () => ({
      keyUpHandlers: {},
      keyDownHandlers: {
        p: (e: KeyboardEvent) => {
          if (e.ctrlKey) {
            handleSelectPrevAnnotation();
          }
        },
        ArrowUp: (e: KeyboardEvent) => {
          if (e.ctrlKey || e.metaKey) {
            handleSelectPrevAnnotation();
          }
        },
        n: (e: KeyboardEvent) => {
          if (e.ctrlKey) {
            handleSelectNextAnnotation();
          }
        },
        ArrowDown: (e: KeyboardEvent) => {
          if (e.ctrlKey || e.metaKey) {
            handleSelectNextAnnotation();
          }
        },
      },
    }),
    [handleSelectNextAnnotation, handleSelectPrevAnnotation],
  );

  const filteredAnnotations = useMemo(() => {
    if (!sortedAnnotations) return undefined;
    return sortedAnnotations.filter((annotation) => {
      const matchTimestamp =
        foxgloveTimeToUnixtime(startTime) <= annotation.timestamp_from &&
        annotation.timestamp_from <= foxgloveTimeToUnixtime(endTime);
      // early return
      if (!matchTimestamp) return false;

      const matchSearchResult = searchResult ? searchResult.has(annotation.id) : true;
      if (!matchSearchResult) return false;

      const matchTopicFilter =
        !selectedTopics || selectedTopics.includes(annotation.targetTopic || "");
      if (!matchTopicFilter) return false;

      return true;
    });
  }, [searchResult, sortedAnnotations, selectedTopics, startTime, endTime]);

  useEffect(() => {
    useAnnotationsState.setState({ filteredAnnotations });
  }, [filteredAnnotations]);

  const setRef = (ref: React.RefObject<HTMLTableRowElement> | null, annotationId: string) => {
    if (editingAnnotationId === annotationId) {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <KeyListener global keyUpHandlers={keyUpHandlers} keyDownHandlers={keyDownHandlers} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          direction="row"
          spacing={0}
          divider={<Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />}
          alignItems="center"
          pr={0.5}
        >
          <SearchBar
            onChangeText={(searchText: string) => {
              const fixedSearchText = searchText.replaceAll("\\", "").replaceAll("　", " ");
              setSearchText(fixedSearchText);
            }}
          />
          <Stack direction="row">
            <TopicFilter annotations={sortedAnnotations} setSelectedTopics={setSelectedTopics} />
            <IconButton size="small" onClick={() => fetchServerAnnotations()}>
              <SyncIcon />
            </IconButton>
          </Stack>
        </Stack>
        <TableContainer sx={{ overflowY: "auto", flexGrow: 1 }}>
          <Table stickyHeader size="small" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow
                sx={{
                  border: "0px",
                  borderBottom: "1px",
                  borderColor: (theme) => theme.palette.divider,
                  borderStyle: "solid",
                }}
              >
                <TableCell sx={{ width: "30px" }} />
                <TableCell sx={{ width: "2rem" }} />
                <TableCell sx={{ width: "10rem" }}>Frame</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell sx={{ width: "40px" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {!filteredAnnotations && (
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
              {filteredAnnotations && (
                <>
                  {filteredAnnotations.length === 0 && (
                    <TableRow>
                      <TableCell
                        width="100%"
                        height="100%"
                        sx={{ textAlign: "center" }}
                        colSpan={4}
                      >
                        No comments found.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredAnnotations.map((annotation) => (
                    <AnnotationRow
                      key={annotation.id}
                      annotation={annotation}
                      highlightedTexts={highlightedTexts}
                      setRef={setRef}
                    />
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
