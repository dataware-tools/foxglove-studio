import { Dispatch, SetStateAction } from "react";
import { useSeekPlayback } from "../../../hooks/useSeekPlayback";
import { useAnnotationsState } from "../../stores/annotation";
import { usePlayerState } from "../../stores/player";
import { Annotation, AnnotationForImageOnTimePoint } from "../../types";
import { unixtimeToFoxgloveTime } from "../../utils";
import { AdaptiveCommentPin } from "./AdaptiveCommentPin";
import { calcIsOnTimestamp } from "./utils";

type AnnotationSpaceCommentPinProps = {
  annotation: AnnotationForImageOnTimePoint;
  imageSpaceWidthRatio: number;
  imageSpaceHeightRatio: number;
  spaceWidth: number;
  spaceHeight: number;
  openedAnnotationId: string | null;
  setOpenedAnnotationId: Dispatch<SetStateAction<string | null>>;
};
export const AnnotationSpaceCommentPin = ({
  annotation,
  imageSpaceWidthRatio,
  imageSpaceHeightRatio,
  spaceWidth,
  spaceHeight,
  openedAnnotationId,
  setOpenedAnnotationId,
}: AnnotationSpaceCommentPinProps) => {
  const startEditing = useAnnotationsState((state) => state.startEditing);
  const currentTimeInNumber = usePlayerState(
    (state) => state.currentTimeInNumber
  );
  const editingHasUpdate = useAnnotationsState(
    (state) => state.editingHasUpdate
  );

  const seekPlayback = useSeekPlayback();
  const editingAnnotation = useAnnotationsState(
    (state) => state.editingAnnotation
  );

  const handleClickAnnotationPin = (
    e: React.MouseEvent<HTMLDivElement>,
    targetAnnotation: Annotation
  ) => {
    e.stopPropagation();
    if (
      calcIsOnTimestamp(
        currentTimeInNumber() || 0,
        targetAnnotation.timestamp_from,
        targetAnnotation.timestamp_to
      )
    ) {
      startEditing(targetAnnotation.id);
    }

    // Seek to annotation timestamp
    if (targetAnnotation && !editingHasUpdate) {
      seekPlayback(unixtimeToFoxgloveTime(targetAnnotation.timestamp_from));
    }
  };
  return (
    <AdaptiveCommentPin
      offset={5}
      key={annotation.id}
      index={annotation.index}
      comment={annotation.comment}
      left={
        (annotation.centerPoint.x + (annotation.width ?? 0) / 2) *
        imageSpaceWidthRatio
      }
      top={
        (annotation.centerPoint.y + (annotation.height ?? 0) / 2) *
        imageSpaceHeightRatio
      }
      spaceWidth={spaceWidth}
      spaceHeight={spaceHeight}
      open={openedAnnotationId === annotation.id && !editingAnnotation}
      isOnTime={calcIsOnTimestamp(
        currentTimeInNumber() || 0,
        annotation.timestamp_from,
        annotation.timestamp_to
      )}
      onMouseOver={() => {
        setOpenedAnnotationId(annotation.id);
      }}
      onMouseOut={() => {
        setOpenedAnnotationId(null);
      }}
      onClick={(e) => {
        handleClickAnnotationPin(e, annotation);
      }}
    />
  );
};
