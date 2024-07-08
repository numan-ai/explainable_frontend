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
  position: Position | null;
}

export type WidgetTempState = {
  dragStart: DragPosition | null;
  justUpdatedState: number | null;
}

export type WidgetStateStorageType = {
  states: { [key: string]: WidgetState };
  tempStates: { [key: string]: WidgetTempState };
  setIsCollapsed: (id: string, isClicked: boolean) => void;
  setDragStart: (id: string, dragStart: DragPosition | null) => void;
  setPosition: (id: string, position: Position | null) => void;
  setJustUpdatedState: (id: string, justUpdatedState: number | null) => void;
};

function ensureDefaultState(state: WidgetStateStorageType, id: string) {
  if (state.states[id] === undefined) {
    state.states[id] = {
      isCollapsed: false,
      dragStart: null,
      position: null,
    } as WidgetState;
  }

  if (state.tempStates[id] === undefined) {
    state.tempStates[id] = {
      dragStart: null,
      justUpdatedState: null,
    } as WidgetTempState;
  }
}

export const useWidgetStateStorage = create<WidgetStateStorageType>()(
  persist(
    immer(
      (set, _get) => ({
        states: {},
        tempStates: {},
        setIsCollapsed: (id: string, isCollapsed: boolean) => set(state => {
          ensureDefaultState(state, id);
          state.states[id].isCollapsed = isCollapsed;
        }),
        setDragStart: (id: string, dragStart: DragPosition | null) => set(state => {
          ensureDefaultState(state, id);
          state.tempStates[id].dragStart = dragStart;
        }),
        setPosition: (id: string, position: Position | null) => set(state => {
          ensureDefaultState(state, id);
          state.states[id].position = position;
        }),
        setJustUpdatedState: (id: string, justUpdatedState: number | null) => set(state => {
          ensureDefaultState(state, id);
          if (justUpdatedState === null) {
            state.tempStates[id].justUpdatedState = null;
          } else {
            if (state.tempStates[id].justUpdatedState === null) {
              state.tempStates[id].justUpdatedState = 0.0;
            }
            if (justUpdatedState < 0.0) {
              state.tempStates[id].justUpdatedState = 0.0;
            }
            const tmpState = state.tempStates[id];
            if (tmpState !== null && tmpState.justUpdatedState !== null) {
              tmpState.justUpdatedState -= justUpdatedState;
            }
          }
        }),
      }),
    ),
    {
      'name': 'numan:explainable.widgetState',
      partialize: (state) => {
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => !['tempStates'].includes(key)),
        )
      },
    }
  )
);