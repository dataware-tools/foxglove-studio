import { Time } from "@foxglove/rostime";
import create from "zustand";

type Player = {
  isPlaying: boolean;
  setIsPlaying: (newState: boolean) => void;
  currentTime: Time | null;
  setCurrentTime: (newTime: Time) => void;
  currentTimeInNumber: () => number | null;
  isSeeking: boolean;
  setIsSeeking: (newState: boolean) => void;
};

export const usePlayerState = create<Player>((set, get) => ({
  isPlaying: false,
  setIsPlaying: (newState) => set({ isPlaying: newState }),
  currentTime: null,
  setCurrentTime: (newTime) => set({ currentTime: newTime }),
  currentTimeInNumber: () => {
    const currentTime = get().currentTime;
    if (currentTime) {
      return currentTime.sec + currentTime.nsec * 10 ** -9;
    } else {
      return null;
    }
  },
  isSeeking: false,
  setIsSeeking: (newState) => set({ isSeeking: newState }),
}));
