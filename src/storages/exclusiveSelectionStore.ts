import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";

type SelectionState = {
  selections: Record<string, string>; // group -> selected object_id
  setSelection: (group: string, objectId: string) => void;
  clearSelection: (group: string) => void;
};

export const useExclusiveSelectionStore = create<SelectionState, [
  ['zustand/persist', SelectionState],
]>(
  persist(
    (set) => ({
      selections: {},
      setSelection: (group: string, objectId: string) => {
        set((state) => {
          const newSelections = {
            ...state.selections,
            [group]: objectId,
          };
          // Send updated selections to backend
          api.request("update_selections", { selections: newSelections }, () => {});
          return { selections: newSelections };
        });
      },
      clearSelection: (group: string) => {
        set((state) => {
          const { [group]: _, ...rest } = state.selections;
          // Send updated selections to backend
          api.request("update_selections", { selections: rest }, () => {});
          return { selections: rest };
        });
      },
    }),
    {
      name: 'numan:explainable.exclusive.selections',
      onRehydrateStorage: () => (state) => {
        console.log("onRehydrateStorage", state);
        if (state) {
          // Send the rehydrated state to backend
          api.request("update_selections", { selections: state.selections }, () => {});
        }
      },
    },
  ),
); 