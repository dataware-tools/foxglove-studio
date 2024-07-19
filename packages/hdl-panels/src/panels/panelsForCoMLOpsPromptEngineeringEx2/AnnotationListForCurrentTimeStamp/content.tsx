import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useCurrentTime } from "../../../hooks/useCurrentTime";
import { useDeleteAnnotation, useServerAnnotations, useUpdateAnnotation } from "../apiClients";
import { AnnotationTable } from "../components/AnnotationTable";
import { AnnotationListPanelForCurrentTimestampConfig } from "./panel";

export const AnnotationListForCurrentTimestamp = ({
  config,
}: {
  config: AnnotationListPanelForCurrentTimestampConfig;
}) => {
  const { tagOptionsForEachTagType } = config;

  const { annotations, refetchServerAnnotations } = useServerAnnotations();
  const { request: deleteAnnotation } = useDeleteAnnotation();
  const { request: updateAnnotation } = useUpdateAnnotation();
  const { currentTimeInUnixTime } = useCurrentTime();

  const filteredAnnotations = annotations
    ?.filter(
      (annotation) =>
        annotation.timestamp_from &&
        annotation.timestamp_to &&
        currentTimeInUnixTime &&
        annotation.timestamp_from <= currentTimeInUnixTime &&
        currentTimeInUnixTime <= annotation.timestamp_to,
    )
    .sort((a, b) =>
      a.timestamp_from && b.timestamp_from ? a.timestamp_from - b.timestamp_from : 0,
    );

  return (
    <Stack overflow="hidden" height="100%">
      <Box flexGrow={1} flexShrink={1} height="100%" overflow="auto">
        <AnnotationTable
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
