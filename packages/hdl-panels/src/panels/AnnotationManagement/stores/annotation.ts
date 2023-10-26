import { v4 as uuidv4 } from "uuid";
import create from "zustand";
import { Annotation, AnnotationForImageOnTimePoint } from "../types";

export type AnnotationsState = {
  annotations?: Annotation[];
  filteredAnnotations?: Annotation[];
  editingAnnotationId: string | null;
  editingAnnotation: AnnotationForImageOnTimePoint | null;
  highlightingAnnotationId: string | null;
  // Flag if the editing annotation has been updated.
  editingHasUpdate: boolean;
  startEditing: (annotationId: string) => void;
  stopEditing: () => void;
  setHighlightingAnnotationId: (annotationId: string | null) => void;
  addAnnotation: (
    newAnnotation: Omit<AnnotationForImageOnTimePoint, "id">
  ) => Annotation;
  getAnnotation: (annotationId: string) => Annotation | null;
  updateAnnotation: (
    annotationId: string,
    newAnnotation: Partial<AnnotationForImageOnTimePoint>
  ) => void;
  updateEditingAnnotation: (
    newAnnotation: Partial<AnnotationForImageOnTimePoint>
  ) => void;
  removeAnnotation: (annotationId: string) => void;
  isNewlyAddingAnnotation: (annotationId: string) => boolean;
  incrementGeneration: (annotationId: string) => void;

  // For triggering shaking animation of the unchanged annotation
  triggerShakingAnimation: boolean;
  setTriggerShakingAnimation: (triggerShakingAnimation: boolean) => void;
};

export const useAnnotationsState = create<AnnotationsState>((set, get) => ({
  annotations: undefined,
  filteredAnnotations: undefined,
  // NOTE(yusukefs): editingAnnotationId is used to avoid rerendering cased by the editing annotation
  editingAnnotationId: null,
  editingAnnotation: null,
  editingHasUpdate: false,
  highlightingAnnotationId: null,
  isAnnotationEditing: false,
  startEditing: (annotationId) => {
    // NOTE(yusukefs): Avoid resetting editingHasUpdate on mouseUp
    if (get().editingAnnotation?.id === annotationId) return;
    const annotation = get().getAnnotation(annotationId);

    if (annotation?.type !== "rect" && annotation?.type !== "point") {
      return;
    }

    set({
      editingAnnotationId: annotationId,
      editingAnnotation: annotation,
      editingHasUpdate: false,
    });
  },
  stopEditing: () =>
    set({
      editingAnnotationId: null,
      editingAnnotation: null,
      editingHasUpdate: false,
    }),
  setHighlightingAnnotationId: (annotationId) =>
    set({ highlightingAnnotationId: annotationId }),
  addAnnotation: (newAnnotation) => {
    const newAnnotationObject = {
      id: `newlyAddingAnnotation-${uuidv4()}`,
      ...newAnnotation,
    };

    set((state) => ({
      annotations: [...(state.annotations ?? []), newAnnotationObject],
      editingAnnotationId: newAnnotationObject.id,
      editingAnnotation: { ...newAnnotationObject },
      editingHasUpdate: false,
    }));
    return newAnnotationObject;
  },
  getAnnotation(annotationId) {
    return (
      get().annotations?.find((annotation) => annotation.id === annotationId) ??
      null
    );
  },
  updateAnnotation(annotationId, newAnnotation) {
    set((state) => ({
      annotations: state.annotations?.map((annotation) => {
        if (annotation.id !== annotationId) {
          return annotation;
        }
        return {
          ...annotation,
          ...newAnnotation,
        };
      }) as Annotation[],
      editingHasUpdate: true,
    }));
  },
  updateEditingAnnotation(newAnnotation) {
    set((state) => {
      if (!state.editingAnnotation) {
        throw new Error("No editing annotation");
      }
      return {
        editingAnnotation: {
          ...state.editingAnnotation,
          ...newAnnotation,
        },
        editingHasUpdate: true,
      };
    });
  },
  removeAnnotation: (annotationId) => {
    set((state) => ({
      annotations: state.annotations?.filter(
        (annotation) => annotation.id !== annotationId
      ),
    }));
    // Stop editing if the removing annotation is being edited
    if (get().editingAnnotationId === annotationId) {
      get().stopEditing();
    }
  },
  isNewlyAddingAnnotation(annotationId) {
    return annotationId.startsWith("newlyAddingAnnotation-");
  },
  incrementGeneration(annotationId) {
    set((state) => ({
      annotations: state.annotations?.map((annotation) => {
        if (annotation.id !== annotationId) {
          return annotation;
        }
        return {
          ...annotation,
          generation: annotation.generation + 1,
        };
      }),
    }));
  },

  triggerShakingAnimation: false,
  setTriggerShakingAnimation: (triggerShakingAnimation) =>
    set({ triggerShakingAnimation }),
}));
