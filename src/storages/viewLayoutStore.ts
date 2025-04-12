import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_SCALE = 0.6;
export const DEFAULT_POSITION = { x: 20, y: 20 };

type Position = {
  x: number;
  y: number;
};

type ViewLayoutStoreType = {
  scales: Record<string, number>;
  positions: Record<string, Position>;
  setScale: (viewId: string, scale: number) => void;
  getScale: (viewId: string) => number;
  setPosition: (viewId: string, position: Position) => void;
  getPosition: (viewId: string) => Position;
};

export const useViewLayoutStore = create<ViewLayoutStoreType, [
  ['zustand/persist', ViewLayoutStoreType],
]>(
  persist(
    (set, get) => ({
      scales: {},
      positions: {},
      setScale: (viewId: string, scale: number) => 
        set((state) => ({ 
          scales: { 
            ...state.scales, 
            [viewId]: scale 
          } 
        })),
      getScale: (viewId: string) => 
        get().scales[viewId] ?? DEFAULT_SCALE,
      setPosition: (viewId: string, position: Position) =>
        set((state) => ({
          positions: {
            ...state.positions,
            [viewId]: position
          }
        })),
      getPosition: (viewId: string) =>
        get().positions[viewId] ?? DEFAULT_POSITION,
    }),
    {
      name: 'numan:explainable.view.layout',
    },
  ),
); 