import { GraphStructure } from "@/structures/types";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


export type ViewType = {
  id: string;
  structure: GraphStructure;
}

type LayoutStoreType = {
  views: ViewType[];
  dragStartPosition: Position | null;
  addView: (view: ViewType) => void;
  setStructure: (viewId: string, structure: GraphStructure) => void;
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
      setStructure: (viewId: string, structure: GraphStructure) => {
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
    }),
  )
)
