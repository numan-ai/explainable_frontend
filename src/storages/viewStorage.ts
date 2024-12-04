import { GraphStructure } from "@/structures/types";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


export type ViewType = {
  id: string;
  structure: GraphStructure;
}

type LayoutStoreType = {
  views: ViewType[];
  dragStartPosition: null;
  addView: (view: ViewType) => void;
  setStructure: (viewId: string, structure: GraphStructure) => void;
};


const STRUCTURE_REGISTRY = new Map<string, any>();


export function getStructureById(id: string) {
  return STRUCTURE_REGISTRY.get(id);
}


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
          for (let node of structure.nodes) {
            STRUCTURE_REGISTRY.set(node.node_id, node);
          }

          return state;
        });
      },
    }),
  )
)
