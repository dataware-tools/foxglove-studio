import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useDeleteAnnotation, useServerAnnotations, useUpdateAnnotation } from "../apiClients";
import { AnnotationTable } from "../components/AnnotationTable";
import { TagTypeSelect } from "./TagTypeSelect";
import { AnnotationListPanelForTagTypeConfig } from "./panel";

export const AnnotationListForTagType = ({
  config,
}: {
  config: AnnotationListPanelForTagTypeConfig;
}) => {
  const { tagOptionsForEachTagType } = config;

  const { annotations, refetchServerAnnotations } = useServerAnnotations();
  const { request: deleteAnnotation } = useDeleteAnnotation();
  const { request: updateAnnotation } = useUpdateAnnotation();

  const [tagType, setTagType] = useState<string>(tagOptionsForEachTagType[0]?.tag_type.value ?? "");
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
            await refetchServerAnnotations();
          }}
          onUpdate={async (annotation) => {
            await updateAnnotation(annotation);
            await refetchServerAnnotations();
          }}
        />
      </Box>
    </Stack>
  );
};
