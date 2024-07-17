import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { AnnotationTable } from "../AnnotationTable";
import { TagTypeSelect } from "../TagTypeSelect";
import { tagOptionsForEachTagType } from "../_hardCordingValue";
import { useDeleteAnnotation, useServerAnnotations, useUpdateAnnotation } from "../apiClients";

export const AnnotationListForTagType = () => {
  const { annotations, refetchServerAnnotations } = useServerAnnotations();

  const [tagType, setTagType] = useState<string>(tagOptionsForEachTagType[0]?.tag_type.value ?? "");

  const { request: deleteAnnotation } = useDeleteAnnotation();
  const { request: updateAnnotation } = useUpdateAnnotation();

  const filteredAnnotations = annotations
    ?.filter((annotation) => annotation.annotation?.tag_type === tagType)
    .sort((a, b) =>
      a.timestamp_from && b.timestamp_from ? a.timestamp_from - b.timestamp_from : 0,
    );

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
            refetchServerAnnotations();
          }}
          onUpdate={async (annotation) => {
            await updateAnnotation(annotation);
            refetchServerAnnotations();
          }}
        />
      </Box>
    </Stack>
  );
};
