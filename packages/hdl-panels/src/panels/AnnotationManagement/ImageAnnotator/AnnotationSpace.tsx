import KeyListener from "@foxglove/studio-base/components/KeyListener";
import PanelContext from "@foxglove/studio-base/components/PanelContext";
import { Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAnnotationsFilter } from "../hooks/useAnnotationsFilter";
import { useInterpolatedAnnotations } from "../hooks/useInterpolatedAnnotation";
import { usePasteAnnotationAction } from "../hooks/usePasteAnnotationAction";
import { usePointerDrag } from "../hooks/usePointerDrag";
import { useAnnotationsState } from "../stores/annotation";
import { useIsAdding } from "../stores/isAdding";
import { usePlayerState } from "../stores/player";
import { useCameraTopicState } from "../stores/topic";
import { Point } from "../types";
import {
  AnnotationPoint,
  AnnotationRectangle,
  InterpolatedAnnotation,
} from "./AnnotationDisplay";
import { AnnotationSpaceCommentPin } from "./AnnotationDisplay/AnnotationSpaceCommentPin";
import { EditingAnnotation } from "./EditingAnnotation";
import { NewlyAddingAnnotation } from "./NewlyAddingAnnotation";

export type AnnotationSpaceProps = {
  sx?: SxProps;
  imageWidth: number;
  imageHeight: number;
  spaceWidth: number;
  spaceHeight: number;
  hideAnnotations?: boolean;
};

export const AnnotationSpace = ({
  sx,
  imageWidth,
  imageHeight,
  spaceWidth,
  spaceHeight,
  hideAnnotations,
}: AnnotationSpaceProps) => {
  const isAdding = useIsAdding((state) => state.isAdding);

  const editingAnnotationId = useAnnotationsState(
    (state) => state.editingAnnotationId
  );
  const editingAnnotation = useAnnotationsState(
    (state) => state.editingAnnotation
  );
  const editingHasUpdate = useAnnotationsState(
    (state) => state.editingHasUpdate
  );
  const stopEditing = useAnnotationsState((state) => state.stopEditing);
  const addAnnotation = useAnnotationsState((state) => state.addAnnotation);
  const removeAnnotation = useAnnotationsState(
    (state) => state.removeAnnotation
  );
  const highlightingAnnotationId = useAnnotationsState(
    (state) => state.highlightingAnnotationId
  );

  const currentTimeInNumber = usePlayerState(
    (state) => state.currentTimeInNumber
  );

  const cameraTopics = useCameraTopicState((state) => state.cameraTopics);
  const parentPanelContext = useContext(PanelContext);
  const panelId = useMemo(() => {
    return parentPanelContext?.id;
  }, [parentPanelContext]);
  const currentCameraTopic = useMemo(
    () => (panelId ? cameraTopics[panelId] : ""),
    [panelId, cameraTopics]
  );

  // Ratio to convert from image coordinate system to image space coordinate system
  const imageSpaceWidthRatio = spaceWidth / imageWidth;
  const imageSpaceHeightRatio = spaceHeight / imageHeight;

  const [clickStartPoint, setClickStartPoint] = useState<Point | null>(null);
  const { handleDown, handleMove, handleUp, difference } = usePointerDrag();

  // Calculate clicked point in image space coordinate system
  const clickEndPoint = useMemo(() => {
    if (!clickStartPoint || !difference) return null;
    const limit = {
      maxX: imageWidth,
      maxY: imageHeight,
    };
    return new Point(
      clickStartPoint.x + difference.x / imageSpaceWidthRatio,
      clickStartPoint.y + difference.y / imageSpaceHeightRatio,
      { limit }
    );
  }, [
    clickStartPoint,
    difference,
    imageSpaceWidthRatio,
    imageSpaceHeightRatio,
    imageWidth,
    imageHeight,
  ]);

  // Linier interpolation
  const { interpolatedAnnotations } = useInterpolatedAnnotations();
  // Filter annotations to be displayed
  const { filteredAnnotations } = useAnnotationsFilter({
    annotations: interpolatedAnnotations,
    topicName: currentCameraTopic,
    currentTimeInNumber: currentTimeInNumber() ?? 0,
  });

  // For triggering shaking unchanged annotation
  const setTriggerShakingAnimation = useAnnotationsState(
    (state) => state.setTriggerShakingAnimation
  );

  const handleEscape = useCallback(() => {
    if (editingAnnotationId) {
      if (editingHasUpdate) {
        // Trigger shaking animation for comment card
        setTriggerShakingAnimation(true);
      } else {
        if (isAdding) {
          removeAnnotation(editingAnnotationId);
        }
        stopEditing();
      }
    }
  }, [
    editingAnnotationId,
    editingHasUpdate,
    isAdding,
    removeAnnotation,
    stopEditing,
    setTriggerShakingAnimation,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handleEscape();
    if (!isAdding || editingAnnotationId !== null) return;
    handleDown(e);
    setClickStartPoint(
      new Point(
        e.nativeEvent.offsetX / imageSpaceWidthRatio,
        e.nativeEvent.offsetY / imageSpaceHeightRatio
      )
    );
  };
  const [openedAnnotationId, setOpenedAnnotationId] = useState<string | null>(
    null
  );

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    handleUp(e);
    const timestamp = currentTimeInNumber();
    if (isAdding && editingAnnotationId === null && timestamp) {
      // On adding mode
      // Update annotation state and reset clicked point states
      if (!clickStartPoint) return;
      if (!clickEndPoint || clickStartPoint.samePointTo(clickEndPoint)) {
        // Clicked on the same point
        addAnnotation({
          index: 0,
          type: "point",
          centerPoint: clickStartPoint,
          comment: "",
          targetTopic: currentCameraTopic,
          timestamp_from: timestamp,
          timestamp_to: timestamp,
          generation: 1,
          // TODO(WatanabeToshimitsu): Replace valid frame_id
          frame_id: "",
        });
      } else {
        // Clicked on a different point
        addAnnotation({
          index: 0,
          type: "rect",
          centerPoint: clickStartPoint.middlePointTo(clickEndPoint),
          comment: "",
          targetTopic: currentCameraTopic,
          timestamp_from: timestamp,
          timestamp_to: timestamp,
          generation: 1,
          width: clickStartPoint.horizontalDifferenceTo(clickEndPoint),
          height: clickStartPoint.verticalDifferenceTo(clickEndPoint),
          // TODO(WatanabeToshimitsu): Replace valid frame_id
          frame_id: "",
        });
      }

      // Remove clicked point states
      setClickStartPoint(null);
    }
  };
  const [contextMenuEvent, setContextMenuEvent] = useState<
    MouseEvent<HTMLDivElement>["nativeEvent"] | undefined
  >(undefined);
  const handleClose = () => {
    setContextMenuEvent(undefined);
  };
  const { pasteAnnotationAction } = usePasteAnnotationAction();
  const { keyUpHandlers, keyDownHandlers } = useMemo(
    () => ({
      keyUpHandlers: {},
      keyDownHandlers: {
        Escape: () => {
          handleEscape();
        },
        v: (e: KeyboardEvent) => {
          if (e.ctrlKey || e.metaKey) {
            pasteAnnotationAction();
          }
        },
      },
    }),
    [handleEscape, pasteAnnotationAction]
  );
  useEffect(() => {
    setOpenedAnnotationId(highlightingAnnotationId);
  }, [highlightingAnnotationId]);

  return (
    <Box
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuEvent(e.nativeEvent);
      }}
    >
      <KeyListener
        global
        keyUpHandlers={keyUpHandlers}
        keyDownHandlers={keyDownHandlers}
      />
      <Box
        sx={{
          ...sx,
          cursor:
            isAdding && editingAnnotationId === null ? "crosshair" : "default",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={
          isAdding && editingAnnotationId === null ? handleMove : undefined
        }
        onPointerUp={handlePointerUp}
      >
        {filteredAnnotations.map((annotation) => {
          // Hide annotations if hideAnnotations is true or it's editing
          if (hideAnnotations || editingAnnotation?.id === annotation.id)
            return null;

          switch (annotation.type) {
            case "point":
              return (
                <AnnotationPoint
                  key={annotation.id}
                  annotationId={annotation.id}
                  point={annotation.centerPoint}
                  isHighlighting={annotation.id === highlightingAnnotationId}
                  imageSpaceWidthRatio={imageSpaceWidthRatio}
                  imageSpaceHeightRatio={imageSpaceHeightRatio}
                  spaceWidth={spaceWidth}
                  spaceHeight={spaceHeight}
                />
              );
            case "rect":
              if (!annotation.width || !annotation.height) return null;
              return (
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
                />
              );
            case "interpolate": {
              const interpolatedCoordinate = annotation.interpolateCoordinate(
                currentTimeInNumber() ?? 0
              );
              return (
                <InterpolatedAnnotation
                  instanceId={annotation.instance_id!}
                  key={annotation.id}
                  annotationId={annotation.id}
                  interpolatedCoordinate={interpolatedCoordinate}
                  imageSpaceWidthRatio={imageSpaceWidthRatio}
                  imageSpaceHeightRatio={imageSpaceHeightRatio}
                  spaceWidth={spaceWidth}
                  spaceHeight={spaceHeight}
                />
              );
            }
            default:
              return null;
          }
        })}
        {filteredAnnotations.map((annotation, akey) => {
          if (!(annotation.type === "rect" || annotation.type === "point"))
            return null;
          return (
            <AnnotationSpaceCommentPin
              key={akey}
              annotation={annotation}
              imageSpaceHeightRatio={imageSpaceHeightRatio}
              imageSpaceWidthRatio={imageSpaceWidthRatio}
              spaceHeight={spaceHeight}
              spaceWidth={spaceWidth}
              openedAnnotationId={openedAnnotationId}
              setOpenedAnnotationId={setOpenedAnnotationId}
            />
          );
        })}
        {editingAnnotation &&
          editingAnnotation.targetTopic === currentCameraTopic && (
            <EditingAnnotation
              annotation={editingAnnotation}
              imageSpaceWidthRatio={imageSpaceWidthRatio}
              imageSpaceHeightRatio={imageSpaceHeightRatio}
              spaceWidth={spaceWidth}
              spaceHeight={spaceHeight}
            />
          )}
        {isAdding && clickStartPoint && (
          <NewlyAddingAnnotation
            clickStartPoint={clickStartPoint}
            clickEndPoint={clickEndPoint}
            imageSpaceWidthRatio={imageSpaceWidthRatio}
            imageSpaceHeightRatio={imageSpaceHeightRatio}
            spaceWidth={spaceWidth}
            spaceHeight={spaceHeight}
          />
        )}
      </Box>
      {contextMenuEvent && (
        <Menu
          open={contextMenuEvent !== undefined}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenuEvent !== null
              ? {
                  top: contextMenuEvent.clientY,
                  left: contextMenuEvent.clientX,
                }
              : undefined
          }
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              pasteAnnotationAction({
                x: contextMenuEvent.offsetX / imageSpaceWidthRatio,
                y: contextMenuEvent.offsetY / imageSpaceHeightRatio,
              });
              handleClose();
            }}
          >
            Paste here
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              pasteAnnotationAction();
              handleClose();
            }}
          >
            Paste to original position
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
};

export type useGetAnnotationSpaceGeometryArgs = {
  parentWidth: number;
  parentHeight: number;
  imageWidth: number;
  imageHeight: number;
};

export const useGetAnnotationSpaceGeometry = ({
  parentWidth,
  parentHeight,
  imageWidth,
  imageHeight,
}: useGetAnnotationSpaceGeometryArgs) => {
  // Get the size and position of the annotation space,
  // given the width and height of the parent and the image.
  const [width, height, top, left] = useMemo(() => {
    const imageRatio = imageWidth / imageHeight;
    const parentRatio = parentWidth / parentHeight;

    if (imageRatio > parentRatio) {
      // image is wider than parent
      const width = parentWidth;
      const height = width / imageRatio;
      const top = (parentHeight - height) / 2;
      const left = 0;
      return [width, height, top, left];
    } else {
      // image is taller than parent
      const height = parentHeight;
      const width = height * imageRatio;
      const top = 0;
      const left = (parentWidth - width) / 2;
      return [width, height, top, left];
    }
  }, [parentWidth, parentHeight, imageWidth, imageHeight]);

  return { width, height, top, left };
};
