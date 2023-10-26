import { annotationStore } from "@hdwlab/api-annotation-store-client";
import {
  AnnotationCommentedImagePixel,
  AnnotationCommentedImageRectangularArea,
  Annotation as ServerAnnotation,
} from "@hdwlab/api-annotation-store-client/dist/browser/client";
import {
  useAPIClient,
  useAPIClientWithSWR,
} from "@hdwlab/api-helper-typescript";
import { useCallback, useMemo } from "react";
import { API_VERSION } from "./ImageAnnotator/constants";
import { useAnnotationsState } from "./stores/annotation";
import { Annotation, AnnotationForImageOnTimePoint, Point } from "./types";

const useDatabaseRecordId = () => {
  const queryStrings = new URLSearchParams(window.location.search);
  const databaseId = queryStrings.get("database-id") ?? "unknownDatabase";
  const recordId = queryStrings.get("record-id") ?? "unknownDatabase";

  return { databaseId, recordId };
};

export const useAddAnnotation = () => {
  const { databaseId, recordId } = useDatabaseRecordId();

  const client = useAPIClient();

  const request = async (
    annotation: Omit<AnnotationForImageOnTimePoint, "id">
  ) => {
    // @ts-expect-error annotation_id and generation will be inserted by backend api.
    const annotationInRequestObject: annotationStore.Annotation = (() => {
      switch (annotation.type) {
        case "point":
          return {
            _api_version: API_VERSION,
            _kind: "AnnotationCommentedImagePixel",
            timestamp_from: annotation.timestamp_from,
            timestamp_to: annotation.timestamp_to,
            record_id: recordId,
            commented_image_pixel: {
              text: annotation.comment,
              frame_id: annotation.frame_id,
              target_topic: annotation.targetTopic,
              image_pixel: {
                x: annotation.centerPoint.x,
                y: annotation.centerPoint.y,
              },
              instance_id: annotation.instance_id,
            },
            created_at: new Date().getTime() / 1000.0, // msec. -> sec.
          };
        case "rect":
          return {
            _api_version: API_VERSION,
            _kind: "AnnotationCommentedImageRectangularArea",
            timestamp_from: annotation.timestamp_from,
            timestamp_to: annotation.timestamp_to,
            record_id: recordId,
            commented_image_rectangular_area: {
              text: annotation.comment,
              frame_id: annotation.frame_id,
              target_topic: annotation.targetTopic,
              image_rectangular_area: {
                center_x: annotation.centerPoint.x,
                center_y: annotation.centerPoint.y,
                size_x: annotation.width,
                size_y: annotation.height,
              },
              instance_id: annotation.instance_id,
            },
            created_at: new Date().getTime() / 1000.0, // msec. -> sec.
          };
        default:
          throw new Error("Unsupported annotation type");
      }
    })();

    const response = await client(
      annotationStore.Configuration,
      annotationStore.AnnotationApi,
      "createAnnotation",
      {
        databaseId,
        annotation: annotationInRequestObject,
      }
    );
    return response;
  };

  return { request };
};

export const useUpdateAnnotation = () => {
  const { databaseId } = useDatabaseRecordId();

  const client = useAPIClient();

  const request = async (
    annotationId: string,
    // NOTE(yusukefs): Make annotation optional except for the generation property.
    annotation: Partial<Annotation> & Pick<Annotation, "generation">
  ) => {
    // @ts-expect-error _kind and record_id are immutable in this app.
    const annotationInRequestObject: annotationStore.Annotation = (() => {
      switch (annotation.type) {
        case "point":
          return {
            _api_version: API_VERSION,
            annotation_id: annotation.id,
            timestamp_from: annotation.timestamp_from,
            timestamp_to: annotation.timestamp_to,
            generation: annotation.generation + 1,
            commented_image_pixel: {
              text: annotation.comment,
              target_topic: annotation.targetTopic,
              frame_id: annotation.frame_id,
              image_pixel: annotation.centerPoint
                ? {
                    x: annotation.centerPoint.x,
                    y: annotation.centerPoint.y,
                  }
                : undefined,
              instance_id: annotation.instance_id,
            },
          };
        case "rect":
          return {
            _api_version: API_VERSION,
            annotation_id: annotation.id,
            timestamp_from: annotation.timestamp_from,
            timestamp_to: annotation.timestamp_to,
            generation: annotation.generation + 1,
            commented_image_rectangular_area: {
              text: annotation.comment,
              target_topic: annotation.targetTopic,
              frame_id: annotation.frame_id,
              image_rectangular_area: {
                center_x: annotation.centerPoint?.x,
                center_y: annotation.centerPoint?.y,
                size_x: annotation.width,
                size_y: annotation.height,
              },
              instance_id: annotation.instance_id,
            },
          };
        default:
          throw new Error("Unsupported annotation type");
      }
    })();

    const response = await client(
      annotationStore.Configuration,
      annotationStore.AnnotationApi,
      "updateAnnotation",
      {
        databaseId,
        annotationId,
        annotation: annotationInRequestObject,
      }
    );
    return response;
  };

  return { request };
};

export const useDeleteAnnotation = () => {
  const { databaseId } = useDatabaseRecordId();

  const client = useAPIClient();

  const request = useMemo(
    () => async (annotationId: string) => {
      const response = await client(
        annotationStore.Configuration,
        annotationStore.AnnotationApi,
        "deleteAnnotation",
        {
          databaseId,
          annotationId,
        }
      );
      return response;
    },
    [databaseId, client]
  );

  return { request };
};

const convServerAnnotationToFrontState = (
  annotation: ServerAnnotation
): Annotation | undefined => {
  if (annotation._kind === "AnnotationCommentedImagePixel") {
    // @ts-expect-error if _kind is AnnotationCommentedImagePixel, type must have below type
    const rawPoint: AnnotationCommentedImagePixel = annotation;
    const point: Annotation = {
      index: 0,
      id: rawPoint.annotation_id,
      type: "point",
      centerPoint: new Point(
        rawPoint.commented_image_pixel.image_pixel.x,
        rawPoint.commented_image_pixel.image_pixel.y
      ),
      comment: rawPoint.commented_image_pixel.text,
      targetTopic: rawPoint.commented_image_pixel.target_topic,
      timestamp_from: rawPoint.timestamp_from as number,
      timestamp_to: rawPoint.timestamp_to as number,
      generation: rawPoint.generation,
      frame_id: rawPoint.commented_image_pixel.frame_id,
      instance_id: rawPoint.commented_image_pixel.instance_id,
    };
    return point;
  } else if (annotation._kind === "AnnotationCommentedImageRectangularArea") {
    // @ts-expect-error if _kind is AnnotationCommentedImageRectangularArea, type must have below type
    const rawRect: AnnotationCommentedImageRectangularArea = annotation;
    const rect: Annotation = {
      index: 0,
      id: rawRect.annotation_id,
      type: "rect",
      centerPoint: new Point(
        rawRect.commented_image_rectangular_area.image_rectangular_area.center_x,
        rawRect.commented_image_rectangular_area.image_rectangular_area.center_y
      ),
      comment: rawRect.commented_image_rectangular_area.text,
      targetTopic: rawRect.commented_image_rectangular_area.target_topic,
      timestamp_from: rawRect.timestamp_from as number,
      timestamp_to: rawRect.timestamp_to as number,
      generation: rawRect.generation,
      height:
        rawRect.commented_image_rectangular_area.image_rectangular_area.size_y,
      width:
        rawRect.commented_image_rectangular_area.image_rectangular_area.size_x,
      frame_id: rawRect.commented_image_rectangular_area.frame_id,
      instance_id: rawRect.commented_image_rectangular_area.instance_id,
    };
    return rect;
  } else if (
    annotation._kind === "ArbitraryAnnotation" &&
    // @ts-expect-error if annotation is generated by specific workflow, it must have scene_caption property.
    annotation.scene_caption
  ) {
    const arbitraryAnnotation: Annotation = {
      index: 0,
      id: annotation.annotation_id,
      type: "arbitrary",
      // @ts-expect-error if annotation is generated by specific workflow, it must have scene_caption property.
      comment: annotation.summary ?? "",
      generation: annotation.generation,
      timestamp_from: annotation.timestamp_from as number,
      timestamp_to: annotation.timestamp_to as number,
    };
    return arbitraryAnnotation;
  } else {
    return undefined;
  }
};

export const useServerAnnotations = () => {
  const { databaseId, recordId } = useDatabaseRecordId();
  const { data, mutate } = useAPIClientWithSWR({
    APIClientClass: annotationStore.AnnotationApi,
    APIConfigurationClass: annotationStore.Configuration,
    operationId: "searchAnnotation",
    params: {
      databaseId,
      searchAnnotationRequest: {
        query: {
          $or: [
            { _kind: "AnnotationCommentedImagePixel" },
            { _kind: "AnnotationCommentedImageRectangularArea" },
            { _kind: "ArbitraryAnnotation" },
          ],
          record_id: recordId,
        },
        per_page: -1,
      },
    },
  });

  const syncLocalAnnotationsToFetched = useCallback(() => {
    if (data && data.length > 0) {
      useAnnotationsState.setState({
        annotations: data.data
          .map(convServerAnnotationToFrontState)
          .filter((annotation) => annotation !== undefined)
          .sort((a, b) => {return a!.timestamp_from - b!.timestamp_from})
          .map((annotation, index) => {
            return { ...annotation, index: index + 1 };
          }) as Annotation[],
      });
    } else {
      useAnnotationsState.setState({ annotations: [] });
    }
  }, [data]);

  const fetchServerAnnotations = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    fetchedAnnotations: data,
    syncLocalAnnotationsToFetched,
    fetchServerAnnotations,
  };
};
