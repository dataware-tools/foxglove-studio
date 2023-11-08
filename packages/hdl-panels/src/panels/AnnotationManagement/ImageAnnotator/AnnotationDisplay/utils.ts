import { SxProps, Theme, alpha, useTheme } from "@mui/material";
import { useMemo } from "react";
import { usePlayerState } from "../../stores/player";
import { Annotation } from "../../types";

export const boxShadowProperties = (isEditing: boolean) => {
  if (!isEditing) return {};

  return {
    boxShadow: "0px 0px 2px 2px rgba(36, 124, 255, 0.8)",
    WebkitBowShadow: "0px 0px 2px 2px rgba(36, 124, 255, 0.8)",
  };
};

export type CommonAnnotationProps = {
  annotationId: string;
  imageSpaceHeightRatio: number;
  imageSpaceWidthRatio: number;
  spaceWidth: number;
  spaceHeight: number;
  isEditing?: boolean;
  isHighlighting?: boolean;
  color?: string;
  styleOverrides?: SxProps<Theme>;
};

export const calcIsOnTimestamp = (
  curTimestamp: number,
  timestampFrom?: number,
  timestampTo?: number,
) => {
  const isTimestampValid = timestampFrom && timestampTo;
  const isTimeSpan = timestampFrom !== timestampTo;
  const isOnTimestamp =
    isTimestampValid &&
    ((isTimeSpan && curTimestamp >= timestampFrom && curTimestamp <= timestampTo) ||
      (!isTimeSpan && curTimestamp - timestampFrom < 0.1 && curTimestamp - timestampFrom > -0.1));
  return Boolean(isOnTimestamp);
};

export const useIsOnTimestamp = ({ annotation }: { annotation: Annotation | null }) => {
  const currentTimeInNumber = usePlayerState((state) => state.currentTimeInNumber);
  const curTimestamp = currentTimeInNumber() || 0;
  const isOnTimestamp = calcIsOnTimestamp(
    curTimestamp,
    annotation?.timestamp_from,
    annotation?.timestamp_to,
  );
  return isOnTimestamp;
};

export const useAnnotationStyle = ({
  annotation,
  color,
  borderWidth = 1,
}: {
  annotation: Annotation | null;
  color?: string;
  borderWidth?: number;
}) => {
  const theme = useTheme();
  const isOnTimestamp = useIsOnTimestamp({ annotation });

  const colorFixed = isOnTimestamp
    ? color || theme.palette.primary.main
    : color
    ? alpha(color, 0.5)
    : alpha(theme.palette.primary.main, 0.5);

  const borderWidthFixed = useMemo(
    () => (isOnTimestamp ? borderWidth * 2 : borderWidth),
    [isOnTimestamp, borderWidth],
  );
  const outlineWidthFixed = useMemo(() => (isOnTimestamp ? 1 : 0), [isOnTimestamp]);
  return { colorFixed, borderWidthFixed, outlineWidthFixed };
};
