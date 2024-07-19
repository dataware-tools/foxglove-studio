import { annotationStore } from "@hdwlab/api-annotation-store-client";

export type AnnotationForCoMLOpsPromptEngineeringEx2 = {
  annotation: { tag_type: string; tags: string[]; note: string };
  annotation_task_id: string;
} & annotationStore.Annotation;

export type UserInputAnnotation = {
  timestampFrom: number;
  timestampTo: number;
  tagType: string;
  note: string;
  tags: { label: string; value: string }[];
};

export type TagOptions = { value: string; label: string }[];
export type TagTypeOptions = { value: string; label: string }[];

export type TagOptionsForEachTagType = {
  tag_type: { label: string; value: string };
  tag_options: TagOptions;
}[];
