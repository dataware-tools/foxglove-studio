import { Box } from "@mui/system";
import { AnnotationInputForm } from "../components/AnnotationInputForm";
import { tagOptionsForEachTagType } from "../_hardCordingValue";
import { useAddAnnotation, useServerAnnotations } from "../apiClients";

export const AnnotationInput = () => {
  const { refetchServerAnnotations } = useServerAnnotations();

  const { request: addAnnotation } = useAddAnnotation();

  return (
    <Box>
      <AnnotationInputForm
        onSave={async (annotation) => {
          await addAnnotation(annotation);
          refetchServerAnnotations();
        }}
        tagOptionsForEachTagType={tagOptionsForEachTagType}
      />
    </Box>
  );
};
