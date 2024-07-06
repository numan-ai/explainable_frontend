import type { Representation } from "@/representation";
import { BaseStructure } from "@/structures/types";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


export type ViewType = {
  id: string;
  structure: BaseStructure;
  representation: Representation | null;
  position: Position;
}

type LayoutStoreType = {
  views: ViewType[];
  dragStartPosition: Position | null;
  addView: (view: ViewType) => void;
  setStructure: (viewId: string, structure: BaseStructure) => void;
  modifyStructure: (viewId: string, callback: (structure: BaseStructure) => BaseStructure) => void;
  moveStructure: (struct_id: string, x: number | null, y: number | null, init: boolean) => void;
};


export const useViewStore = create<LayoutStoreType>()(
  // persist(
  immer(
    (set, _get) => ({
      views: [],
      dragStartPosition: null,
      addView: (view: ViewType) => {
        set(state => {
          state.views.push(view);
          return state;
        });
      },
      setStructure: (viewId: string, structure: BaseStructure) => {
        set(state => {
          let view = state.views.find(view => view.id === viewId);
          if (view === undefined) {
            view = {
              id: viewId,
              structure: structure,
            } as ViewType;
            state.views.push(view);
          }
          view.structure = structure;

          return state;
        });
      },
      modifyStructure: (viewId: string, callback: (structure: BaseStructure) => BaseStructure) => {
        set(state => {
          
          const view = state.views.find(view => view.id === viewId);
          if (view === undefined) {
            return state;
          }
          view.structure = callback(view.structure);

          return state;
        });
      },
      moveStructure: (struct_id: string, x: number | null, y: number | null, init: boolean = false) => {
        set(state => {
          if (x === null && y === null) {
            state.dragStartPosition = null;
            return state;
          }

          if (!init && state.dragStartPosition === null) {
            return state;
          }

          if (init && x !== null && y !== null) {
            state.dragStartPosition = {
              x: x,
              y: y,
            };
            return state;
          }

          if (state.dragStartPosition === null) {
            console.error("Can't move structure without drag start position");
            return state;
          }

          if (x === null || y === null) {
            console.error("Can't move structure without new position");
            return state;
          }

          const diffX = x - state.dragStartPosition.x;
          const diffY = y - state.dragStartPosition.y;

          const parts: string[] = struct_id.split(".");
          const view = state.views.find(view => view.id === parts[0]);
          if (view === undefined) {
            console.error("Can't find view", parts[0]);
            return state;
          }
          const structure = view.structure;
          let current: any = structure;
          for (let i = 1; i < parts.length; i++) {
            current = current[parts[i]];
          }
          view.position = {
            x: 100 + diffX,
            y: 100 + diffY,
          }

          return state
        });
      }
    }),
  )
  // , {
  //   name: 'numan:explainable.dashboard',
  //   storage: {
  //     getItem: (name) => {
  //       const data = localStorage.getItem(name);
  //       if (data === null) {
  //         return {
  //           state: {},
  //         };
  //       }
  //       return {
  //         state: {
  //           ...JSON.parse(data).state,
  //           dashboards: new Map(JSON.parse(data).state.dashboards),
  //         },
  //       }
  //     },
  //     setItem: (name, newValue) => {
  //       const str = JSON.stringify(newValue);
  //       localStorage.setItem(name, str)
  //     },
  //     removeItem: (name) => localStorage.removeItem(name),
  //   }
  // })
)
