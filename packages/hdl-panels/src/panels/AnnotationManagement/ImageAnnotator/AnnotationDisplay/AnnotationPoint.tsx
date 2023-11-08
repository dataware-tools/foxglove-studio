import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { MouseEvent, useEffect, useState } from "react";
import { usePointerDrag } from "../../hooks/usePointerDrag";
import { useSeekPlaybackToAnnotation } from "../../hooks/useSeekPlaybackToAnnotation";
import { useAnnotationsState } from "../../stores/annotation";
import { useIsAdding } from "../../stores/isAdding";
import { Point } from "../../types";
import { CommentCard } from "../CommentCard";
import { AnnotationContextMenu } from "./AnnotationContextMenu";
import { CommonAnnotationProps, useAnnotationStyle, useIsOnTimestamp } from "./utils";

const POINT_DEFAULT_SIZE = 16;

export type AnnotationPointProps = {
  point: Point;
  size?: number;
  borderWidth?: number;
} & CommonAnnotationProps;

export const AnnotationPoint = ({
  annotationId,
  point,
  imageSpaceHeightRatio,
  imageSpaceWidthRatio,
  spaceWidth,
  spaceHeight,
  isEditing = false,
  isHighlighting = false,
  color,
  size = POINT_DEFAULT_SIZE,
  borderWidth = 1,
  styleOverrides = {},
}: AnnotationPointProps) => {
  const annotation = useAnnotationsState((state) => state.getAnnotation(annotationId));
  const { colorFixed } = useAnnotationStyle({
    color,
    borderWidth,
    annotation,
  });

  const isAdding = useIsAdding((state) => state.isAdding);
  const editingAnnotationId = useAnnotationsState((state) => state.editingAnnotationId);
  const updateEditingAnnotation = useAnnotationsState((state) => state.updateEditingAnnotation);
  const setHighlightingAnnotationId = useAnnotationsState(
    (state) => state.setHighlightingAnnotationId,
  );

  const [clickStartPoint, setClickStartPoint] = useState<Point | null>(null);
  const { isDragging, handleDown, handleMove, handleUp, difference } = usePointerDrag();

  const handlePointDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handleDown(e);
    setClickStartPoint(new Point(point.x, point.y));
  };

  useEffect(() => {
    if (!isDragging || !difference || !clickStartPoint) return;

    const limit = {
      maxX: spaceWidth / imageSpaceWidthRatio,
      maxY: spaceHeight / imageSpaceHeightRatio,
    };
    const newPoint = new Point(
      clickStartPoint.x + difference.x / imageSpaceWidthRatio,
      clickStartPoint.y + difference.y / imageSpaceHeightRatio,
      { limit },
    );
    updateEditingAnnotation({ centerPoint: newPoint });
  }, [
    isDragging,
    difference,
    clickStartPoint,
    imageSpaceWidthRatio,
    imageSpaceHeightRatio,
    spaceWidth,
    spaceHeight,
    annotationId,
    updateEditingAnnotation,
  ]);

  // Handle click to start editing
  const startEditing = useAnnotationsState((state) => state.startEditing);
  const getAnnotation = useAnnotationsState((state) => state.getAnnotation);
  const editingHasUpdate = useAnnotationsState((state) => state.editingHasUpdate);
  const seekPlaybackToAnnotation = useSeekPlaybackToAnnotation();
  const isOnTimestamp = useIsOnTimestamp({ annotation });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isOnTimestamp) {
      // Start editing annotation if the click is on timestamp
      startEditing(annotationId);
    }
    const annotation = getAnnotation(annotationId);
    if (annotation && seekPlaybackToAnnotation && !editingHasUpdate) {
      seekPlaybackToAnnotation(annotation);
    }
  };
  const [contextMenuEvent, setContextMenuEvent] = useState<
    MouseEvent<HTMLDivElement>["nativeEvent"] | undefined
  >(undefined);

  return (
    <>
      <Box
        onPointerDown={isEditing ? handlePointDown : undefined}
        onPointerMove={isEditing ? handleMove : undefined}
        onPointerUp={isEditing ? handleUp : undefined}
        onMouseEnter={() => setHighlightingAnnotationId(annotationId)}
        onMouseLeave={() => setHighlightingAnnotationId(null)}
        onClick={isAdding ? undefined : handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // NOTE(t-watanabe): this is just first aid for bug that context menu is not working when comment card is open
          if (!isEditing) {
            setContextMenuEvent(e.nativeEvent);
          }
        }}
        sx={{
          borderStyle: isOnTimestamp ? "solid" : "dashed",
          borderWidth: 1,
          borderColor: colorFixed,
          borderRadius: "50%",
          backgroundColor: isHighlighting ? colorFixed : alpha(colorFixed, 0.25),
          position: "absolute",
          top: point.y * imageSpaceHeightRatio - size / 2,
          left: point.x * imageSpaceWidthRatio - size / 2,
          width: size,

          height: size,
          cursor: isEditing ? (isDragging ? "grabbing" : "grab") : "pointer",
          pointerEvents: isEditing || (editingAnnotationId === null && !isAdding) ? "auto" : "none",
          ...styleOverrides,
        }}
      />
      {isEditing && (
        <CommentCard
          annotationId={annotationId}
          commentAreaCenterX={point.x * imageSpaceWidthRatio}
          commentAreaCenterY={point.y * imageSpaceHeightRatio}
          commentAreaHeight={POINT_DEFAULT_SIZE}
          spaceWidth={spaceWidth}
          spaceHeight={spaceHeight}
        />
      )}
      <AnnotationContextMenu
        annotationId={annotationId}
        contextMenuEvent={contextMenuEvent}
        handleClose={() => setContextMenuEvent(undefined)}
      />
    </>
  );
};
