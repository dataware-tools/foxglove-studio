import { Box, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { interpolatedCoordinate } from "../../types";
import { AnnotationPoint } from "./AnnotationPoint";
import { AnnotationRectangle } from "./AnnotationRectangle";
import { CommonAnnotationProps } from "./utils";

export type InterpolatedAnnotationProps = {
  interpolatedCoordinate?: interpolatedCoordinate;
  instanceId: string;
} & CommonAnnotationProps;
export const InterpolatedAnnotation = ({
  interpolatedCoordinate,
  instanceId,
  ...props
}: InterpolatedAnnotationProps) => {
  if (!interpolatedCoordinate) return null;
  if (
    (interpolatedCoordinate.height === 0 && interpolatedCoordinate.width === 0) ||
    (!interpolatedCoordinate.height && !interpolatedCoordinate.width)
  ) {
    return (
      <Tooltip title={instanceId}>
        <Box>
          <AnnotationPoint
            key={props.annotationId}
            point={interpolatedCoordinate.centerPoint}
            styleOverrides={{
              cursor: "default",
              backgroundColor: "none",
              borderStyle: "dashed",
              "&:hover": {
                backgroundColor: "none",
              },
            }}
            color={alpha(grey[400], 0.5)}
            {...props}
          />
        </Box>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={instanceId}>
        <Box>
          <AnnotationRectangle
            key={props.annotationId}
            centerPoint={interpolatedCoordinate.centerPoint}
            width={interpolatedCoordinate.width ?? 0}
            height={interpolatedCoordinate.height ?? 0}
            styleOverrides={{
              cursor: "default",
              borderStyle: "dashed",
              "&:hover": {
                backgroundColor: "none",
              },
            }}
            color={alpha(grey[400], 0.5)}
            {...props}
          />
        </Box>
      </Tooltip>
    );
  }
};
