import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { AnnotationTable } from "../AnnotationTable";
import { tagOptionsForEachTagType } from "../_hardCordingValue";
import { useDeleteAnnotation, useServerAnnotations, useUpdateAnnotation } from "../apiClients";

const selectCurrentTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.currentTime;

export const AnnotationListForCurrentTimestamp = () => {
  const { annotations, refetchServerAnnotations } = useServerAnnotations();
  const currentTime = useMessagePipeline(selectCurrentTime);
  const currentTimeInNumber = currentTime ? currentTime.sec + currentTime.nsec / 1e9 : 0;

  const { request: deleteAnnotation } = useDeleteAnnotation();
  const { request: updateAnnotation } = useUpdateAnnotation();

  const filteredAnnotations = annotations
    ?.filter(
      (annotation) =>
        annotation.timestamp_from &&
        annotation.timestamp_to &&
        annotation.timestamp_from <= currentTimeInNumber &&
        currentTimeInNumber <= annotation.timestamp_to,
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
