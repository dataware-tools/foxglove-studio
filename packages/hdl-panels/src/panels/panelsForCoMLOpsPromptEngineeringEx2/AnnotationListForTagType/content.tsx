import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSeekPlayback } from "../../../hooks/useSeekPlayback";
import { foxgloveTimeToUnixTime, unixTimeToFoxgloveTime } from "../../../logics/time";
import { useDeleteAnnotation, useServerAnnotations, useUpdateAnnotation } from "../apiClients";
import { AnnotationTable } from "../components/AnnotationTable";
import { TagOptionsForEachTagType } from "../types";
import { TagTypeSelect } from "./TagTypeSelect";
import { TagValueSelect } from "./TagValueSelect";

export type AnnotationListPanelForTagTypeConfig = {
  tagOptionsForEachTagType: TagOptionsForEachTagType;
};

export const AnnotationListForTagType = ({
  config,
}: {
  config: AnnotationListPanelForTagTypeConfig;
}) => {
  const { tagOptionsForEachTagType } = config;

  const { annotations, refetchServerAnnotations } = useServerAnnotations();
  const { request: deleteAnnotation } = useDeleteAnnotation();
  const { request: updateAnnotation } = useUpdateAnnotation();
  const seekPlayback = useSeekPlayback();

  const selectStartTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.startTime;
  const selectEndTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.endTime;
  const startTime = useMessagePipeline(selectStartTime) || { sec: 0, nsec: 0 };
  const endTime = useMessagePipeline(selectEndTime) || { sec: 0, nsec: 0 };

  const [tagType, setTagType] = useState<string>(tagOptionsForEachTagType[0]?.tag_type.value ?? "");
  const [tagValue, setTagValue] = useState<string>("all");

  useEffect(() => {
    setTagValue("all");
  }, [tagType, tagOptionsForEachTagType]);

  const filteredAnnotations = annotations
    ?.filter((annotation) => {
      const matchTagType = annotation.annotation?.tag_type === tagType;
      if (!matchTagType) {
        return false;
      }
      const matchTagValue = tagValue === "all" || annotation.annotation?.tags.includes(tagValue);
      if (!matchTagValue) {
        return false;
      }
      if (!annotation.timestamp_from || !annotation.timestamp_to) {
        return true;
      }
      const matchTimestamp =
        foxgloveTimeToUnixTime(startTime) <= annotation.timestamp_from &&
        annotation.timestamp_to <= foxgloveTimeToUnixTime(endTime);
      if (!matchTimestamp) {
        return false;
      }

      return true;
    })
    .sort((a, b) =>
      a.timestamp_from && b.timestamp_from ? a.timestamp_from - b.timestamp_from : 0,
    );

  const seekToTimestamp = (unixTimestamp: number) =>
    seekPlayback(unixTimeToFoxgloveTime(unixTimestamp));

  return (
    <Stack overflow="hidden" height="100%">
      <Stack flexGrow={0} flexShrink={0} direction="row">
        <TagTypeSelect
          tagType={tagType}
          tagTypeOptions={tagOptionsForEachTagType.map((tagTypeOptions) => tagTypeOptions.tag_type)}
          onChange={(event) => {
            setTagType(event.target.value as string);
          }}
        />
        <TagValueSelect
          tagValue={tagValue}
          tagOptions={[{ label: "全て", value: "all" }].concat(
            tagOptionsForEachTagType.find(
              (tagTypeOptions) => tagTypeOptions.tag_type.value === tagType,
            )?.tag_options ?? [],
          )}
          onChange={(event) => {
            setTagValue(event.target.value as string);
          }}
        />
      </Stack>
      <Box flexGrow={1} flexShrink={1} height="100%" overflow="auto">
        <AnnotationTable
          highlightCurrentAnnotation
          hideTagType
          annotations={filteredAnnotations ?? []}
          tagOptionsForEachTagType={tagOptionsForEachTagType}
          onDelete={async (annotation) => {
            await deleteAnnotation(annotation.annotation_id);
            await refetchServerAnnotations();
          }}
          onUpdate={async (annotation) => {
            await updateAnnotation(annotation);
            await refetchServerAnnotations();
          }}
          onSeekToTimestamp={seekToTimestamp}
        />
      </Box>
    </Stack>
  );
};
