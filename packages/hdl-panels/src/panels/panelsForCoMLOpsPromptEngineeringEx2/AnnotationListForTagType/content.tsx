import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useSeekPlayback } from "../../../hooks/useSeekPlayback";
import { unixTimeToFoxgloveTime } from "../../../logics/time";
import { useDeleteAnnotation, useServerAnnotations, useUpdateAnnotation } from "../apiClients";
import { AnnotationTable } from "../components/AnnotationTable";
import { TagOptionsForEachTagType } from "../types";
import { TagTypeSelect } from "./TagTypeSelect";

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

  const [tagType, setTagType] = useState<string>(tagOptionsForEachTagType[0]?.tag_type.value ?? "");
  const filteredAnnotations = annotations
    ?.filter((annotation) => annotation.annotation?.tag_type === tagType)
    .sort((a, b) =>
      a.timestamp_from && b.timestamp_from ? a.timestamp_from - b.timestamp_from : 0,
    );

  const seekToTimestamp = (unixTimestamp: number) =>
    seekPlayback(unixTimeToFoxgloveTime(unixTimestamp));

  return (
    <Stack overflow="hidden" height="100%">
      <Box flexGrow={0} flexShrink={0}>
        <TagTypeSelect
          tagType={tagType}
          tagTypeOptions={tagOptionsForEachTagType.map((tagTypeOptions) => tagTypeOptions.tag_type)}
          onChange={(event) => {
            setTagType(event.target.value as string);
          }}
        />
      </Box>
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
