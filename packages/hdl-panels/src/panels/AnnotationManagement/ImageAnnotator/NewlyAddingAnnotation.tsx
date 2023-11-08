import { useTheme } from "@mui/material";
import { Point } from "../types";
import { AnnotationPoint, AnnotationRectangle } from "./AnnotationDisplay";

export type NewlyAddingAnnotationProps = {
  clickStartPoint: Point;
  clickEndPoint: Point | null;
  imageSpaceWidthRatio: number;
  imageSpaceHeightRatio: number;
  spaceWidth: number;
  spaceHeight: number;
};

export const NewlyAddingAnnotation = ({
  clickStartPoint,
  clickEndPoint,
  imageSpaceWidthRatio,
  imageSpaceHeightRatio,
  spaceWidth,
  spaceHeight,
}: NewlyAddingAnnotationProps) => {
  const theme = useTheme();

  if (!clickEndPoint || clickStartPoint.samePointTo(clickEndPoint)) {
    // Clicked on the same point
    return (
      <AnnotationPoint
        annotationId="newlyAddingAnnotation"
        point={clickStartPoint}
        imageSpaceHeightRatio={imageSpaceHeightRatio}
        imageSpaceWidthRatio={imageSpaceWidthRatio}
        spaceWidth={spaceWidth}
        spaceHeight={spaceHeight}
        color={theme.palette.primary.main}
        styleOverrides={{
          pointerEvents: "none",
        }}
      />
    );
  } else {
    const middlePoint = clickStartPoint.middlePointTo(clickEndPoint);

    // Clicked on a different point
    return (
      <AnnotationRectangle
        annotationId="newlyAddingAnnotation"
        centerPoint={middlePoint}
        width={clickStartPoint.horizontalDifferenceTo(clickEndPoint)}
        height={clickStartPoint.verticalDifferenceTo(clickEndPoint)}
        imageSpaceHeightRatio={imageSpaceHeightRatio}
        imageSpaceWidthRatio={imageSpaceWidthRatio}
        spaceWidth={spaceWidth}
        spaceHeight={spaceHeight}
        color={theme.palette.primary.main}
        styleOverrides={{
          pointerEvents: "none",
          borderStyle: "dashed",
        }}
      />
    );
  }
};
