import sendNotification from "@foxglove/studio-base/util/sendNotification";
import { useState } from "react";
import { useAddAnnotation } from "../apiClients";
import { useAnnotationsState } from "../stores/annotation";
import { useImageAnnotationGeometryState } from "../stores/imageAnnotationGeometry";

export const useCopyAnnotationAction = () => {
  const { request: addAnnotationRequest } = useAddAnnotation();

  const getAnnotation = useAnnotationsState((state) => state.getAnnotation);

  const { width: imageWidth, height: imageHeight } = useImageAnnotationGeometryState(
    (state) => state.imageGeometry,
  );

  const [isCopying, setIsCopying] = useState(false);

  const copyAnnotationAction = async (annotationId: string) => {
    setIsCopying(true);

    // Get annotation
    const annotation = getAnnotation(annotationId);
    if (!annotation) {
      setIsCopying(false);
      throw new Error("Annotation not found");
    }

    if (annotation.type !== "rect" && annotation.type !== "point") {
      setIsCopying(false);
      throw new Error("unsupported annotation type");
    }

    // Get center point of new annotation
    const difference = 0;
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
      ...annotation,
      centerPoint: newCenterPoint,
      generation: 1,
    };
    const jsonString = JSON.stringify(newAnnotationWithoutId) ?? "{}";
    navigator.clipboard.writeText(jsonString).catch((err) => {
      console.error(err);
      sendNotification(`Faild to copy the comment`, err, "app", "error");
    });

    setIsCopying(false);
  };
  return { copyAnnotationAction, isCopying };
};
