import { useCallback, useEffect, useRef } from "react";
import { renderImage } from "../ImageView/lib/renderImage";
import { NormalizedImageMessage } from "../ImageView/types";
import { useImageAnnotationGeometryState } from "../stores/imageAnnotationGeometry";

export type useImageCanvasArgs = {
  width?: number;
  height?: number;
  image?: NormalizedImageMessage;
  onStartRenderImage?: () => () => void;
};

export const useImageCanvas = ({
  image,
  width,
  height,
  onStartRenderImage,
}: useImageCanvasArgs) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setImageGeometry = useImageAnnotationGeometryState((state) => state.setImageGeometry);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (width === undefined || height === undefined) {
      return;
    }

    const targetWidth = Math.floor(width * devicePixelRatio);
    const targetHeight = Math.floor(height * devicePixelRatio);

    // Resize canvas
    if (targetWidth !== canvas.width) {
      canvas.width = targetWidth;
    }
    if (targetHeight !== canvas.height) {
      canvas.height = targetHeight;
    }

    const finishRender = onStartRenderImage ? onStartRenderImage() : undefined;

    try {
      const dimension = await renderImage({
        canvas,
        geometry: {
          flipHorizontal: false,
          flipVertical: false,
          panZoom: { x: 0, y: 0, scale: 1 },
          rotation: 0,
          viewport: { width: targetWidth, height: targetHeight },
          zoomMode: "fit",
        },
        imageMessage: image,
        rawMarkerData: { markers: [], transformMarkers: false },
        options: {},
        hitmapCanvas: undefined,
      });

      if (dimension) {
        setImageGeometry({
          width: dimension.width,
          height: dimension.height,
        });
      }
    } finally {
      finishRender && finishRender();
    }
  }, [image, width, height, onStartRenderImage, setImageGeometry]);
  useEffect(() => {
    render();
  }, [render]);

  return {
    canvasRef,
  };
};
