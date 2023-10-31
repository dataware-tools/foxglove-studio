import { NormalizedImageMessage } from "../ImageView/types";
import { useResizeDetector } from "react-resize-detector";
import { useImageCanvas, useImageCanvasArgs } from "../hooks/useImageCanvas";
import { useImageAnnotationGeometryState } from "../stores/imageAnnotationGeometry";
import { AnnotationSpace, useGetAnnotationSpaceGeometry } from "./AnnotationSpace";

export type ImageAnnotationCanvasProps = {
  image?: NormalizedImageMessage;
  onStartRenderImage?: useImageCanvasArgs["onStartRenderImage"];
  hideAnnotations?: boolean;
};

export const ImageAnnotationCanvas = ({
  image,
  onStartRenderImage,
  hideAnnotations,
}: ImageAnnotationCanvasProps) => {
  const {
    width,
    height,
    ref: rootRef,
  } = useResizeDetector({
    refreshRate: 0,
    refreshMode: "debounce",
  });

  const { width: imageWidth, height: imageHeight } = useImageAnnotationGeometryState(
    (state) => state.imageGeometry,
  );

  const { canvasRef } = useImageCanvas({
    image,
    width,
    height,
    onStartRenderImage,
  });

  const parentWidth = width || 0;
  const parentHeight = height || 0;
  const annotationSpaceGeometry = useGetAnnotationSpaceGeometry({
    imageWidth,
    imageHeight,
    parentWidth,
    parentHeight,
  });

  return (
    <div
      ref={rootRef}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <AnnotationSpace
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        spaceWidth={annotationSpaceGeometry.width}
        spaceHeight={annotationSpaceGeometry.height}
        sx={{
          zIndex: 10,
          position: "relative",
          width: annotationSpaceGeometry.width,
          height: annotationSpaceGeometry.height,
          top: annotationSpaceGeometry.top,
          left: annotationSpaceGeometry.left,
        }}
        hideAnnotations={hideAnnotations}
      />
      <canvas
        ref={canvasRef}
        style={{
          zIndex: 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
