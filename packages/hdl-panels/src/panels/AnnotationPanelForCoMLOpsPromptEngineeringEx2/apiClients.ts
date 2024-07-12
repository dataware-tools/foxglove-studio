import { annotationStore } from "@hdwlab/api-annotation-store-client";
import { useAPIClient, useAPIClientWithSWR } from "@hdwlab/api-helper-typescript";
import { useCallback, useMemo } from "react";
import { useDatabaseRecordId } from "../../hooks/useDatabaseRecordId";
import { AnnotationPanelForCoMLOpsPromptEngineeringEx2, UserInputAnnotation } from "./types";

const API_VERSION = "dataware-tools.com/v1alpha5";
const ANNOTATION_TASK_ID = "comlops-pe-ex2";
export const useAddAnnotation = () => {
  const { databaseId, recordId } = useDatabaseRecordId();

  const client = useAPIClient();

  const request = async (annotation: UserInputAnnotation) => {
    const annotationInRequestObject: annotationStore.Annotation = {
      _api_version: API_VERSION,
      _kind: "ArbitraryAnnotation",
      timestamp_from: annotation.timestampFrom,
      timestamp_to: annotation.timestampTo,
      record_id: recordId,
      // @ts-expect-error ArbitraryAnnotation can include arbitrary properties.
      annotation_task_id: ANNOTATION_TASK_ID,
    };

    const response = await client(
      annotationStore.Configuration,
      annotationStore.AnnotationApi,
      "createAnnotation",
      {
        databaseId,
        annotation: annotationInRequestObject,
      },
    );
    return response;
  };

  return { request };
};

export const useUpdateAnnotation = () => {
  const { databaseId } = useDatabaseRecordId();

  const client = useAPIClient();

  const request = async (annotation: AnnotationPanelForCoMLOpsPromptEngineeringEx2) => {
    const annotationInRequestObject: annotationStore.Annotation = {
      ...annotation,
      generation: annotation.generation + 1,
    };

    const response = await client(
      annotationStore.Configuration,
      annotationStore.AnnotationApi,
      "updateAnnotation",
      {
        databaseId,
        annotationId: annotation.annotation_id,
        annotation: annotationInRequestObject,
      },
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
        },
      );
      return response;
    },
    [databaseId, client],
  );

  return { request };
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
          $and: [{ _kind: "ArbitraryAnnotation", annotation_task_id: ANNOTATION_TASK_ID }],
          record_id: recordId,
        },
        per_page: -1,
      },
    },
  });

  const refetchServerAnnotations = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    annotations: data?.data as AnnotationPanelForCoMLOpsPromptEngineeringEx2[] | undefined,
    refetchServerAnnotations,
  };
};
