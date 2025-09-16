import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

type ReplayStoreType = {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  toggleIsRunning: () => void;
};


export const useReplayStore = create<ReplayStoreType>()(
  immer((set, get) => ({
    isRunning: true,
    setIsRunning: (isRunning: boolean) => set({ isRunning }),
    toggleIsRunning: () => set({ isRunning: !get().isRunning }),
  }))
)
