import { useConfirm } from "@foxglove/studio-base/hooks/useConfirm";
import { useDeleteAnnotation, useServerAnnotations } from "../apiClients";
import { useAnnotationsState } from "../stores/annotation";
import { Annotation } from "../types";

export const useDeleteAnnotationAction = () => {
  const [confirm, confirmModal] = useConfirm();
  const { request: deleteAnnotationInServer } = useDeleteAnnotation();
  const removeAnnotation = useAnnotationsState((state) => state.removeAnnotation);
  const { fetchServerAnnotations } = useServerAnnotations();

  const deleteAnnotationAction = async (annotation: Annotation) => {
    // Confirm deletion
    const response = await confirm({
      title: `Delete annotation “${annotation.comment}”?`,
      prompt: "This action cannot be undone.",
      ok: "Delete",
      variant: "danger",
    });
    if (response === "ok") {
      const [, error] = await deleteAnnotationInServer(annotation.id);
      if (error) {
        console.error(error);
        await confirm({ title: "Failed to delete annotation" });
        return;
      }
      removeAnnotation(annotation.id);
      await fetchServerAnnotations();
    }
  };

  return { deleteAnnotationAction, confirmModal };
};
