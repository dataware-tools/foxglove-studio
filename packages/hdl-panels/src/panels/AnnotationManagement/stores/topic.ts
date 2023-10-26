import create from "zustand";

type CameraTopic = {
  cameraTopics: Record<string, string>;
  setCameraTopic: (panelId: string, cameraTopic: string) => void;
};

export const useCameraTopicState = create<CameraTopic>((set) => ({
  cameraTopics: {},
  setCameraTopic: (panelId: string, cameraTopic: string) => {
    set((state) => {
      return {
        cameraTopics: { ...state.cameraTopics, [panelId]: cameraTopic },
      };
    });
  },
}));
