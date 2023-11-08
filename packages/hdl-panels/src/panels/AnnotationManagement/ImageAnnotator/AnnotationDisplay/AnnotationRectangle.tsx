import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
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

type AnnotationRectangleHandleProps = {
  annotationId: string;
  centerPoint: Point;
  width: number;
  height: number;
  imageSpaceWidthRatio: number;
  imageSpaceHeightRatio: number;
  spaceWidth: number;
  spaceHeight: number;
  verticalPosition: "top" | "bottom";
  horizontalPosition: "left" | "right";
};

const AnnotationRectangleHandle = ({
  annotationId,
  centerPoint,
  width,
  height,
  imageSpaceWidthRatio,
  imageSpaceHeightRatio,
  spaceWidth,
  spaceHeight,
  verticalPosition,
  horizontalPosition,
}: AnnotationRectangleHandleProps) => {
  const HANDLE_SIZE = 8;

  const updateEditingAnnotation = useAnnotationsState((state) => state.updateEditingAnnotation);

  const [clickStartPoints, setClickStartPoints] = useState<{
    pointOpposite: Point;
    pointHandle: Point;
  } | null>(null);
  const { isDragging, handleDown, handleMove, handleUp, difference } = usePointerDrag();

  const handlePointDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handleDown(e);

    // Set the handle point and its opposite point
    const pointOpposite = new Point(
      horizontalPosition === "left" ? centerPoint.x + width / 2 : centerPoint.x - width / 2,
      verticalPosition === "top" ? centerPoint.y + height / 2 : centerPoint.y - height / 2,
    );
    const pointHandle = new Point(
      horizontalPosition === "left" ? centerPoint.x - width / 2 : centerPoint.x + width / 2,
      verticalPosition === "top" ? centerPoint.y - height / 2 : centerPoint.y + height / 2,
    );
    setClickStartPoints({
      pointOpposite,
      pointHandle,
    });
  };

  useEffect(() => {
    if (!isDragging || !difference || !clickStartPoints) return;

    // Calculate the limitation geometry of the handle point and its opposite point
    const minX = 0;
    const maxX = spaceWidth / imageSpaceWidthRatio;
    const minY = 0;
    const maxY = spaceHeight / imageSpaceHeightRatio;
    const limit = { minX, minY, maxX, maxY };

    // Calculate the new handle point and update the annotation
    const newPointHandle = new Point(
      clickStartPoints.pointHandle.x + difference.x / imageSpaceWidthRatio,
      clickStartPoints.pointHandle.y + difference.y / imageSpaceHeightRatio,
      { limit },
    );
    updateEditingAnnotation({
      centerPoint: clickStartPoints.pointOpposite.middlePointTo(newPointHandle),
      width: clickStartPoints.pointOpposite.horizontalDifferenceTo(newPointHandle),
      height: clickStartPoints.pointOpposite.verticalDifferenceTo(newPointHandle),
    });
  }, [
    isDragging,
    difference,
    clickStartPoints,
    imageSpaceWidthRatio,
    imageSpaceHeightRatio,
    spaceWidth,
    spaceHeight,
    annotationId,
    updateEditingAnnotation,
    width,
    height,
    horizontalPosition,
    verticalPosition,
  ]);

  const styles = (() => {
    if (verticalPosition === "top") {
      if (horizontalPosition === "left") {
        return {
          top: -HANDLE_SIZE / 2,
          left: -HANDLE_SIZE / 2,
          cursor: "nwse-resize",
        };
      }
      return {
        top: -HANDLE_SIZE / 2,
        right: -HANDLE_SIZE / 2,
        cursor: "nesw-resize",
      };
    } else {
      if (horizontalPosition === "left") {
        return {
          bottom: -HANDLE_SIZE / 2,
          left: -HANDLE_SIZE / 2,
          cursor: "nesw-resize",
        };
      }
      return {
        bottom: -HANDLE_SIZE / 2,
        right: -HANDLE_SIZE / 2,
        cursor: "nwse-resize",
      };
    }
  })();

  return (
    <div
      onPointerDown={handlePointDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      style={{
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        backgroundColor: "white",
        border: `1px solid ${grey[900]}`,
        position: "absolute",
        ...styles,
      }}
    />
  );
};

export type AnnotationRectangleProps = {
  centerPoint: Point;
  width: number;
  height: number;
  borderWidth?: number;
} & CommonAnnotationProps;

export const AnnotationRectangle = ({
  annotationId,
  centerPoint,
  width,
  height,
  imageSpaceHeightRatio,
  imageSpaceWidthRatio,
  spaceWidth,
  spaceHeight,
  isEditing = false,
  isHighlighting = false,
  color,
  borderWidth = 1,
  styleOverrides = {},
}: AnnotationRectangleProps) => {
  const annotation = useAnnotationsState((state) => state.getAnnotation(annotationId));
  const isOnTimestamp = useIsOnTimestamp({ annotation });
  const { colorFixed } = useAnnotationStyle({
    color,
    borderWidth,
    annotation,
  });

  const left = (centerPoint.x - width / 2) * imageSpaceWidthRatio;
  const top = (centerPoint.y - height / 2) * imageSpaceHeightRatio;

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
    setClickStartPoint(new Point(centerPoint.x, centerPoint.y));
  };

  useEffect(() => {
    if (!isDragging || !difference || !clickStartPoint) return;

    // Calculate the new center point limited to image geometry and update the annotation
    const limit = {
      minX: width / 2,
      minY: height / 2,
      maxX: spaceWidth / imageSpaceWidthRatio - width / 2,
      maxY: spaceHeight / imageSpaceHeightRatio - height / 2,
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
    width,
    height,
  ]);

  // Handle click to start editing
  const startEditing = useAnnotationsState((state) => state.startEditing);
  const getAnnotation = useAnnotationsState((state) => state.getAnnotation);
  const editingHasUpdate = useAnnotationsState((state) => state.editingHasUpdate);
  const seekPlaybackToAnnotation = useSeekPlaybackToAnnotation();
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
          borderColor: colorFixed,
          backgroundColor: isHighlighting ? alpha(colorFixed, 0.25) : undefined,
          borderWidth: 1,
          borderStyle: isOnTimestamp ? "solid" : "dashed",
          position: "absolute",
          left,
          top,
          width: `${width * imageSpaceWidthRatio}px`,
          height: `${height * imageSpaceHeightRatio}px`,
          cursor: isEditing ? (isDragging ? "grabbing" : "grab") : "pointer",
          pointerEvents: isEditing || (editingAnnotationId === null && !isAdding) ? "auto" : "none",
          ...styleOverrides,
        }}
      >
        {isEditing && (
          <>
            {/* Handles for resizing */}
            <AnnotationRectangleHandle
              annotationId={annotationId}
              centerPoint={centerPoint}
              width={width}
              height={height}
              imageSpaceWidthRatio={imageSpaceWidthRatio}
              imageSpaceHeightRatio={imageSpaceHeightRatio}
              spaceWidth={spaceWidth}
              spaceHeight={spaceHeight}
              horizontalPosition="left"
              verticalPosition="top"
            />
            <AnnotationRectangleHandle
              annotationId={annotationId}
              centerPoint={centerPoint}
              width={width}
              height={height}
              imageSpaceWidthRatio={imageSpaceWidthRatio}
              imageSpaceHeightRatio={imageSpaceHeightRatio}
              spaceWidth={spaceWidth}
              spaceHeight={spaceHeight}
              horizontalPosition="left"
              verticalPosition="bottom"
            />
            <AnnotationRectangleHandle
              annotationId={annotationId}
              centerPoint={centerPoint}
              width={width}
              height={height}
              imageSpaceWidthRatio={imageSpaceWidthRatio}
              imageSpaceHeightRatio={imageSpaceHeightRatio}
              spaceWidth={spaceWidth}
              spaceHeight={spaceHeight}
              horizontalPosition="right"
              verticalPosition="top"
            />
            <AnnotationRectangleHandle
              annotationId={annotationId}
              centerPoint={centerPoint}
              width={width}
              height={height}
              imageSpaceWidthRatio={imageSpaceWidthRatio}
              imageSpaceHeightRatio={imageSpaceHeightRatio}
              spaceWidth={spaceWidth}
              spaceHeight={spaceHeight}
              horizontalPosition="right"
              verticalPosition="bottom"
            />
          </>
        )}
      </Box>
      {isEditing && (
        <CommentCard
          annotationId={annotationId}
          commentAreaCenterX={centerPoint.x * imageSpaceWidthRatio}
          commentAreaCenterY={centerPoint.y * imageSpaceHeightRatio}
          commentAreaHeight={height * imageSpaceHeightRatio}
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
