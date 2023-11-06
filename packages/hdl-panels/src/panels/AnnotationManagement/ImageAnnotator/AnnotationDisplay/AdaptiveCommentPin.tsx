import { useMemo } from "react";
import { CommentPinPresentation, CommentPinPresentationProps } from "./CommentPinPresentation";

export type AdaptiveCommentPinProps = {
  spaceWidth: number;
  spaceHeight: number;
} & CommentPinPresentationProps;

export const AdaptiveCommentPin = ({
  spaceWidth,
  spaceHeight,
  placement = undefined,
  ...props
}: AdaptiveCommentPinProps) => {
  const bottomY = (props.top ?? 0) + (props.offset ?? 0) + 70;
  const rightX = (props.left ?? 0) + (props.offset ?? 0) + 240;
  const adaptedPlacement = useMemo(() => {
    if (bottomY > spaceHeight && rightX > spaceWidth) {
      return "left-top";
    } else if (bottomY > spaceHeight) {
      return "right-top";
    } else if (rightX > spaceWidth) {
      return "left-bottom";
    } else {
      return "right-bottom";
    }
  }, [bottomY, rightX, spaceWidth, spaceHeight]);
  return (
    <>
      <CommentPinPresentation placement={placement ?? adaptedPlacement} {...props} />
    </>
  );
};
