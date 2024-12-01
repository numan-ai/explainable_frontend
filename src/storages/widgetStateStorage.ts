import { Position } from "@/structures/types";
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
  states: Map<string, WidgetState>;
  tempStates: { [key: string]: WidgetTempState };
  setIsCollapsed: (id: string, isClicked: boolean) => void;
  setDragStart: (id: string, dragStart: DragPosition | null) => void;
  setPosition: (id: string, position: Position | null) => void;
  setPositionBulk: (positions: Map<string, Position>) => void;
  setJustUpdatedState: (id: string, justUpdatedState: number | null) => void;
};

function ensureDefaultState(state: WidgetStateStorageType, id: string) {
  if (state.states.get(id) === undefined) {
    state.states.set(id, {
      isCollapsed: false,
      dragStart: null,
      position: null,
    } as WidgetState);
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
        states: new Map<string, WidgetState>(),
        tempStates: {},
        setIsCollapsed: (id: string, isCollapsed: boolean) => set(state => {
          ensureDefaultState(state, id);
          state.states.get(id)!.isCollapsed = isCollapsed;
        }),
        setDragStart: (id: string, dragStart: DragPosition | null) => set(state => {
          ensureDefaultState(state, id);
          state.tempStates[id].dragStart = dragStart;
        }),
        setPosition: (id: string, position: Position | null) => set(state => {
          ensureDefaultState(state, id);
          state.states.get(id)!.position = position;
        }),
        setPositionBulk: (positions: Map<string, Position>) => set(state => {
          for (const [key, value] of positions) {
            ensureDefaultState(state, key);
            state.states.get(key)!.position = value;
          }
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
      // partialize: (state) => {
        // return Object.fromEntries(
        //   Object.entries(state).filter(([key]) => !['tempStates'].includes(key)),
        // )
      // },
      storage: {
        setItem: (name, newValue) => {
          const data = JSON.stringify({
            state: Object.fromEntries(
              Object.entries(newValue.state).filter(([key]) => !['tempStates'].includes(key)),
            ),
            version: newValue.version,
          });
          localStorage.setItem(name, data);
        },
        removeItem: (name) => localStorage.removeItem(name),
        getItem: (name) => {
          const str = localStorage.getItem(name)
          return {
            state: {
              ...JSON.parse(str!).state,
              states: new Map<string, WidgetState>(JSON.parse(str!).state.states),
            },
          }
        },
      }
    }
  )
);