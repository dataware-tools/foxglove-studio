import KeyListener from "@foxglove/studio-base/components/KeyListener";
import { useMemo } from "react";
import { useCopyAnnotationAction } from "../hooks/useCopyAnnotationAction";
import { useDeleteAnnotationAction } from "../hooks/useDeleteAnnotationAction";
import { useAnnotationsState } from "../stores/annotation";
import { Annotation } from "../types";
import { AnnotationPoint, AnnotationRectangle } from "./AnnotationDisplay";

export type EditingAnnotationProps = {
  annotation: Annotation;
  imageSpaceWidthRatio: number;
  imageSpaceHeightRatio: number;
  spaceWidth: number;
  spaceHeight: number;
};

export const EditingAnnotation = ({
  annotation,
  imageSpaceWidthRatio,
  imageSpaceHeightRatio,
  spaceWidth,
  spaceHeight,
}: EditingAnnotationProps) => {
  const { copyAnnotationAction } = useCopyAnnotationAction();
  const { deleteAnnotationAction } = useDeleteAnnotationAction();
  const { keyUpHandlers, keyDownHandlers } = useMemo(
    () => ({
      keyUpHandlers: {},
      keyDownHandlers: {
        c: (e: KeyboardEvent) => {
          if (e.ctrlKey || e.metaKey) {
            copyAnnotationAction(annotation.id);
          }
        },
        Delete: () => {
          deleteAnnotationAction(annotation);
        },
        Backspace: () => {
          deleteAnnotationAction(annotation);
        },
      },
    }),
    [copyAnnotationAction, annotation, deleteAnnotationAction]
  );

  const highlightingAnnotationId = useAnnotationsState(
    (state) => state.highlightingAnnotationId
  );
  return (
    <>
      <KeyListener
        global
        keyUpHandlers={keyUpHandlers}
        keyDownHandlers={keyDownHandlers}
      />
      {annotation.type === "point" && (
        <AnnotationPoint
          key={annotation.id}
          annotationId={annotation.id}
          point={annotation.centerPoint}
          isHighlighting={annotation.id === highlightingAnnotationId}
          imageSpaceWidthRatio={imageSpaceWidthRatio}
          imageSpaceHeightRatio={imageSpaceHeightRatio}
          spaceWidth={spaceWidth}
          spaceHeight={spaceHeight}
          isEditing
        />
      )}
      {annotation.type === "rect" &&
        !(annotation.width == null || annotation.height == null) && (
          <AnnotationRectangle
            key={annotation.id}
            annotationId={annotation.id}
            centerPoint={annotation.centerPoint}
            width={annotation.width}
            height={annotation.height}
            isHighlighting={annotation.id === highlightingAnnotationId}
            imageSpaceWidthRatio={imageSpaceWidthRatio}
            imageSpaceHeightRatio={imageSpaceHeightRatio}
            spaceWidth={spaceWidth}
            spaceHeight={spaceHeight}
            isEditing
          />
        )}
    </>
  );
};
