import { Box } from "@mui/system";
import { useAddAnnotation, useServerAnnotations } from "../apiClients";
import { AnnotationInputForm } from "../components/AnnotationInputForm";
import { AnnotationInputPanelConfig } from "./panel";

export const AnnotationInput = ({ config }: { config: AnnotationInputPanelConfig }) => {
  const { tagOptionsForEachTagType } = config;

  const { refetchServerAnnotations } = useServerAnnotations();
  const { request: addAnnotation } = useAddAnnotation();

  return (
    <Box>
      <AnnotationInputForm
        onSave={async (annotation) => {
          await addAnnotation(annotation);
          await refetchServerAnnotations();
        }}
        tagOptionsForEachTagType={tagOptionsForEachTagType}
      />
    </Box>
  );
};
