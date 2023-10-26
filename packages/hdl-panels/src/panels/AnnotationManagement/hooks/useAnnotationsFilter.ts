import { useMemo } from "react";
import { useSearchState } from "../stores/search";
import { Annotation, InterpolatedAnnotation } from "../types";

export const useAnnotationsFilter = ({
  annotations,
  topicName,
  currentTimeInNumber,
}: {
  annotations: (Annotation | InterpolatedAnnotation)[];
  topicName: string;
  currentTimeInNumber: number;
}) => {
  const { searchResult } = useSearchState();
  const filteredAnnotations = useMemo(() => {
    if (!annotations) return [];
    return annotations.filter((annotation) => {
      const isSearched = searchResult ? searchResult.has(annotation.id) : true;
      const isTimePoint = annotation.timestamp_from === annotation.timestamp_to;
      // Return time-point-annotation are within 0.5 seconds of the current time
      const isAnnotationInCurrentTimeNeighbor =
        isTimePoint &&
        Math.abs(annotation.timestamp_from - currentTimeInNumber) < 0.5;
      const isCurrentTimeWithinAnnotationTimeSpan =
        !isTimePoint &&
        annotation.timestamp_from < currentTimeInNumber &&
        currentTimeInNumber < annotation.timestamp_to;
      return (
        annotation.targetTopic === topicName &&
        (isAnnotationInCurrentTimeNeighbor ||
          isCurrentTimeWithinAnnotationTimeSpan) &&
        isSearched
      );
    });
  }, [annotations, topicName, currentTimeInNumber, searchResult]);
  return { filteredAnnotations };
};
