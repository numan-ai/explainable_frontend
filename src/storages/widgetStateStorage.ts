import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type DragPosition = {
  layerX: number;
  layerY: number;
  x: number;
  y: number;
}

export type WidgetState = {
  isCollapsed: boolean;
  dragStart: DragPosition | null;
  position: Position | null;
}

export type WidgetStateStorageType = {
  states: { [key: string]: WidgetState };
  setIsCollapsed: (id: string, isClicked: boolean) => void;
  setDragStart: (id: string, dragStart: DragPosition | null) => void;
  setPosition: (id: string, position: Position) => void;
};

function ensureDefaultState(state: WidgetStateStorageType, id: string) {
  if (state.states[id] !== undefined) {
    return;
  }
  state.states[id] = {
    isCollapsed: false,
    dragStart: null,
    position: null,
  } as WidgetState;
}

export const useWidgetStateStorage = create<WidgetStateStorageType>()(
  persist(
    immer(
      (set, _get) => ({
        states: {},
        setIsCollapsed: (id: string, isCollapsed: boolean) => set(state => {
          ensureDefaultState(state, id);
          state.states[id].isCollapsed = isCollapsed;
        }),
        setDragStart: (id: string, dragStart: DragPosition | null) => set(state => {
          ensureDefaultState(state, id);
          state.states[id].dragStart = dragStart;
        }),
        setPosition: (id: string, position: Position) => set(state => {
          ensureDefaultState(state, id);
          state.states[id].position = position;
        }),
      }),
    ),
    {
      'name': 'numan:explainable.widgetState'
    }
  )
);