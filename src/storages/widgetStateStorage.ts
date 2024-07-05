import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type WidgetState = {
  isCollapsed: boolean;
  position: Position;
}

type WidgetStateStorageType = {
  states: { [key: string]: WidgetState };
  setIsCollapsed: (id: string, isClicked: boolean) => void;
  setPosition: (id: string, position: Position) => void;
};

function ensureDefaultState(state: WidgetStateStorageType, id: string) {
  if (state.states[id] !== undefined) {
    return;
  }
  state.states[id] = {
    isCollapsed: false,
    position: {
      x: 0,
      y: 0,
    },
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