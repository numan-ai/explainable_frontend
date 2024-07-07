import type { Representation } from "@/sources";
import { BaseStructure } from "@/structures/types";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


export type ViewType = {
  id: string;
  structure: BaseStructure;
  representation: Representation | null;
  position: Position;
  scale: number;
}

type LayoutStoreType = {
  views: ViewType[];
  dragStartPosition: Position | null;
  addView: (view: ViewType) => void;
  setStructure: (viewId: string, structure: BaseStructure, representation: Representation | null) => void;
  modifyStructure: (viewId: string, callback: (structure: BaseStructure) => BaseStructure) => void;
  setScale: (viewId: string, scale: number) => void;
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
      setStructure: (viewId: string, structure: BaseStructure, representation: Representation | null) => {
        set(state => {
          let view = state.views.find(view => view.id === viewId);
          if (view === undefined) {
            view = {
              id: viewId,
              structure: structure,
              representation: representation,
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
      setScale: (viewId: string, scale: number) => {
        set(state => {
          const view = state.views.find(view => view.id === viewId);
          if (view === undefined) {
            console.error("Can't find view", viewId);
            return state;
          }
          view.scale = scale;

          return state;
        });
      },
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
