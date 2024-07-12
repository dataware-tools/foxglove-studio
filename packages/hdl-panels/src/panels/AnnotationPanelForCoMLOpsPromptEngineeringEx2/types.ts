import { annotationStore } from "@hdwlab/api-annotation-store-client";

export type AnnotationPanelForCoMLOpsPromptEngineeringEx2 = {
  annotation: { tag_type: string; tags: string[] };
} & annotationStore.Annotation;

export type UserInputAnnotation = {
  timestampFrom: number;
  timestampTo: number;
  tag_type: string;
  tags: { label: string; value: string }[];
};

export type TagOptions = { value: string; label: string }[];
export type TagTypeOptions = { value: string; label: string }[];
