import create from "zustand";

type IsAdding = {
  isAdding: boolean;
  startAdding: () => void;
  stopAdding: () => void;
};

export const useIsAdding = create<IsAdding>((set) => ({
  isAdding: false,
  startAdding: () => set({ isAdding: true }),
  stopAdding: () => set({ isAdding: false }),
}));
