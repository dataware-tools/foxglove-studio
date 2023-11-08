import { useState } from "react";
import { useAddAnnotation, useServerAnnotations } from "../apiClients";
import { useAnnotationsState } from "../stores/annotation";
import { useImageAnnotationGeometryState } from "../stores/imageAnnotationGeometry";

export const useDuplicateAnnotationAction = () => {
  const { request: addAnnotationRequest } = useAddAnnotation();

  const getAnnotation = useAnnotationsState((state) => state.getAnnotation);
  const startEditing = useAnnotationsState((state) => state.startEditing);

  const { width: imageWidth, height: imageHeight } = useImageAnnotationGeometryState(
    (state) => state.imageGeometry,
  );

  const { fetchServerAnnotations } = useServerAnnotations();
  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicateAnnotationAction = async (annotationId: string) => {
    setIsDuplicating(true);

    // Get annotation
    const annotation = getAnnotation(annotationId);
    if (!annotation) {
      setIsDuplicating(false);
      throw new Error("Annotation not found");
    }

    if (annotation.type !== "rect" && annotation.type !== "point") {
      setIsDuplicating(false);
      throw new Error("unsupported annotation type");
    }

    // Get center point of new annotation
    const difference = 10;
    const diffX =
      annotation.centerPoint.x + (annotation.width ?? 0) / 2 >= imageWidth
        ? -difference
        : difference;
    const diffY =
      annotation.centerPoint.y + (annotation.height ?? 0) / 2 >= imageHeight
        ? -difference
        : difference;
    const newCenterPoint = annotation.centerPoint.getPointDifferedBy(diffX, diffY);

    const newAnnotationWithoutId: Parameters<typeof addAnnotationRequest>[0] = {
      index: 0,
      type: annotation.type,
      centerPoint: newCenterPoint,
      comment: annotation.comment,
      targetTopic: annotation.targetTopic,
      timestamp_from: annotation.timestamp_from,
      timestamp_to: annotation.timestamp_to,
      generation: 1,
      width: annotation.width ?? undefined,
      height: annotation.height ?? undefined,
      // TODO(yusukefs): Replace valid frame_id
      frame_id: "",
    };
    const [data, error] = await addAnnotationRequest(newAnnotationWithoutId);
    if (error) {
      // TODO(yusukefs): Show error message e.g. snackbar
      console.error(error);
    } else if (data) {
      await fetchServerAnnotations();
      startEditing(data.annotation_id);
    }

    setIsDuplicating(false);
  };
  return { duplicateAnnotationAction, isDuplicating };
};
