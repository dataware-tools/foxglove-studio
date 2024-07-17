import { Box } from "@mui/system";
import { tagOptionsForEachTagType } from "../_hardCordingValue";
import { useAddAnnotation, useServerAnnotations } from "../apiClients";
import { AnnotationInputForm } from "../components/AnnotationInputForm";

export const AnnotationInput = () => {
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
