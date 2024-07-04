import { StructureWithContext } from "@/structures/BBox";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


/*
Client-owned data:
- positions of structures relative to a view

We don't need dashboards since this can be controlled by the backend.
How will positions be combined with the structures?
Position needs to be placed either inside of the structure or 
  in a separate map (structure id -> position).
First option is not great since we will mix client-owned and backend-own data.
*/

export type DashboardViewType = {
  id: string;
  swc: StructureWithContext;
}

export type DashoboardType = {
  id: string;
  views: Array<DashboardViewType>;
};

type LayoutStoreType = {
  currentDashboard: DashoboardType;
  dashboards: Map<string, DashoboardType>;
  dragStartPosition: Position | null;
  addView: (view: DashboardViewType) => void;
  addDashboard: (dashboard: DashoboardType) => void;
  selectDashboard: (dashboardId: string) => void;
  setStructure: (dashboardId: string, viewId: string, structure: BaseStructure) => void;
  modifyStructure: (dashboardId: string, viewId: string, callback: (structure: BaseStructure) => BaseStructure) => void;
  moveStructure: (struct_id: string, x: number | null, y: number | null, init: boolean) => void;
};


export const DEFAULT_DASHBOARD_ID = "default";
const DEFAULT_DASHBOARD = {
  id: DEFAULT_DASHBOARD_ID,
  views: [],
  structureBeingMoved: null,
}

export const useDashboardStore = create<LayoutStoreType>()(
  // persist(
  immer(
    (set, _get) => ({
      currentDashboard: DEFAULT_DASHBOARD,
      dashboards: new Map<string, DashoboardType>([[DEFAULT_DASHBOARD_ID, DEFAULT_DASHBOARD]]),
      dragStartPosition: null,
      addView: (view: DashboardViewType) => {
        set(state => {
          state.currentDashboard.views.push(view);
          state.dashboards.set(state.currentDashboard.id, state.currentDashboard);
          return state;
        });
      },
      addDashboard: (dashboard: DashoboardType) => {
        set(state => {
          const newDashboards = new Map<string, DashoboardType>(state.dashboards);
          newDashboards.set(dashboard.id, dashboard);
          return {
            dashboards: newDashboards,
          }
        });
      },
      selectDashboard: (dashboardId: string) => {
        set(state => {
          const dashboard = state.dashboards.get(dashboardId);
          return {
            currentDashboard: dashboard,
          }
        });
      },
      setStructure: (dashboardId: string, viewId: string, structure: BaseStructure) => {
        set(state => {
          const dashboard = state.dashboards.get(dashboardId);
          if (dashboard === undefined) {
            return state;
          }
          let view = dashboard.views.find(view => view.id === viewId);
          if (view === undefined) {
            view = {
              id: viewId,
              swc: {
                structure: structure,
              },
            };
            dashboard.views.push(view);
          }
          view.swc.structure = structure;

          if (state.currentDashboard.id === dashboardId) {
            state.currentDashboard = dashboard;
          }

          return state;
        });
      },
      modifyStructure: (dashboardId: string, viewId: string, callback: (structure: BaseStructure) => BaseStructure) => {
        set(state => {
          const dashboard = state.dashboards.get(dashboardId);
          if (dashboard === undefined) {
            return state;
          }
          const view = dashboard.views.find(view => view.id === viewId);
          if (view === undefined) {
            return state;
          }
          view.swc.structure = callback(view.swc.structure);

          if (state.currentDashboard.id === dashboardId) {
            state.currentDashboard = dashboard;
          }

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
          const view = state.currentDashboard.views.find(view => view.id === parts[0]);
          if (view === undefined) {
            console.error("Can't find view", parts[0]);
            return state;
          }
          const structure = view.swc.structure;
          let current: any = structure;
          for (let i = 1; i < parts.length; i++) {
            current = current[parts[i]];
          }
          view.swc.position = {
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
