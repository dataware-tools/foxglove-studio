import create from "zustand";

type ImageGeometry = {
  width: number;
  height: number;
};

export type ImageAnnotationGeometryState = {
  imageGeometry: ImageGeometry;
  setImageGeometry: (geometry: ImageGeometry) => void;
};

export const useImageAnnotationGeometryState =
  create<ImageAnnotationGeometryState>((set) => ({
    imageGeometry: {
      width: 0,
      height: 0,
    },
    setImageGeometry(geometry: ImageGeometry) {
      set({ imageGeometry: geometry });
    },
  }));
