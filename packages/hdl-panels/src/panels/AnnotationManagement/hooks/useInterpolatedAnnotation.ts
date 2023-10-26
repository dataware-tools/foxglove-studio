import { useMemo } from "react";
import { useAnnotationsState } from "../stores/annotation";
import {
  Annotation,
  AnnotationForImageOnTimePoint,
  InterpolatedAnnotation,
  Point,
} from "../types";

const toZeroIfNaN = (value: number) =>
  !isNaN(value) && isFinite(value) ? value : 0;

const linearInterpolate = (start: number, end: number, coefficient: number) => {
  return start + coefficient * (end - start);
};

const genLinearInterpolator =
  (sortedAnnotations: AnnotationForImageOnTimePoint[]) =>
  (currentTimeInNumber: number) => {
    const startCandidates = sortedAnnotations.filter(
      (a) => a.timestamp_to < currentTimeInNumber
    );
    const start = startCandidates[startCandidates.length - 1];
    const end = sortedAnnotations.find(
      (a) => a.timestamp_from >= currentTimeInNumber
    );
    if (!start || !end) return undefined;
    const startCoordinate = {
      centerPoint: start.centerPoint,
      height: start.height ?? 0,
      width: start.width ?? 0,
    };
    const endCoordinate = {
      centerPoint: end.centerPoint,
      height: end.height ?? 0,
      width: end.width ?? 0,
    };

    const interpolationCoefficient =
      (currentTimeInNumber - start.timestamp_to) /
      (end.timestamp_from - start.timestamp_to);
    const centerX = linearInterpolate(
      startCoordinate.centerPoint.x,
      endCoordinate.centerPoint.x,
      interpolationCoefficient
    );
    const centerY = linearInterpolate(
      startCoordinate.centerPoint.y,
      endCoordinate.centerPoint.y,
      interpolationCoefficient
    );
    const height = linearInterpolate(
      startCoordinate.height,
      endCoordinate.height,
      interpolationCoefficient
    );
    const width = linearInterpolate(
      startCoordinate.width,
      endCoordinate.width,
      interpolationCoefficient
    );

    const interpolatedCoordinate = {
      centerPoint: new Point(centerX, centerY),
      height: toZeroIfNaN(height),
      width: toZeroIfNaN(width),
    };

    return interpolatedCoordinate;
  };

const checkIfAnnotationCanBeInterpolated = (
  annotation: Annotation
): boolean => {
  // If annotation have time span, interpolation is skipped
  if (annotation.timestamp_from !== annotation.timestamp_to) return false;
  // If annotation does not have tracking instance, it should not be interpolated
  if (!annotation.instance_id) return false;
  // Annotation should be point or rect
  if (annotation.type !== "point" && annotation.type !== "rect") return false;

  return true;
};

export const useInterpolatedAnnotations = (): {
  interpolatedAnnotations: (Annotation | InterpolatedAnnotation)[];
} => {
  const { annotations } = useAnnotationsState();
  const interpolatedAnnotations = useMemo(() => {
    if (!annotations) return [];

    // Find annotations that should be interpolated
    const annotationsShouldBeInterpolated: Record<
      string,
      AnnotationForImageOnTimePoint[]
    > = {};

    annotations.forEach((annotation) => {
      if (!checkIfAnnotationCanBeInterpolated(annotation)) return;
      const instanceId = annotation.instance_id!;
      // If the instance is already in interpolated wait list, skip
      if (annotationsShouldBeInterpolated[instanceId]) return;

      // Find annotations that track the same instance
      const annotationsMayBeInterPolated = annotations.filter(
        (a) =>
          checkIfAnnotationCanBeInterpolated(a) && a.instance_id === instanceId
      );

      // If there is no other annotations that track same instance, skip
      if (annotationsMayBeInterPolated.length < 2) return;

      // Finally, add to the list
      annotationsShouldBeInterpolated[instanceId] =
        annotationsMayBeInterPolated as AnnotationForImageOnTimePoint[];
    });

    const interpolatedAnnotations: InterpolatedAnnotation[] = [];

    // Linear interpolate annotations
    Object.entries(annotationsShouldBeInterpolated).forEach(
      ([instanceId, annotations]) => {
        const sortedAnnotations = annotations.sort(
          (a, b) => a.timestamp_from - b.timestamp_from
        );

        const interpolatedAnnotation: InterpolatedAnnotation = {
          index: 0,
          id: `interpolated-${sortedAnnotations[0].id}`,
          timestamp_from: sortedAnnotations[0].timestamp_from,
          timestamp_to:
            sortedAnnotations[sortedAnnotations.length - 1].timestamp_to,
          type: "interpolate",
          comment: sortedAnnotations[0].comment,
          instance_id: instanceId,
          // TODO: targetTopic and frame_id should be changed depends on timestamp
          targetTopic: sortedAnnotations[0].targetTopic || "",
          frame_id: sortedAnnotations[0].frame_id || "",
          interpolateCoordinate: genLinearInterpolator(sortedAnnotations),
        };
        interpolatedAnnotations.push(interpolatedAnnotation);
      }
    );
    // NOTE(t-watanabe): To avoid overlapping, interpolated annotations are placed before non-interpolated annotations
    return [...interpolatedAnnotations, ...annotations];
  }, [annotations]);
  return { interpolatedAnnotations };
};
