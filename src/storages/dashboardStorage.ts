import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'

export type DashboardViewType = {
  id: string;
  structure: BaseStructure;
}

export type DashoboardType = {
  id: string;
  views: Array<DashboardViewType>;
};

type LayoutStoreType = {
  currentDashboard: DashoboardType;
  dashboards: Map<string, DashoboardType>;
  addView: (view: DashboardViewType) => void;
  addDashboard: (dashboard: DashoboardType) => void;
  selectDashboard: (dashboardId: string) => void;
  setStructure: (dashboardId: string, viewId: string, structure: BaseStructure) => void;
  modifyStructure: (dashboardId: string, viewId: string, callback: (structure: BaseStructure) => BaseStructure) => void;
};


export const DEFAULT_DASHBOARD_ID = "default";
const DEFAULT_DASHBOARD = {
  id: DEFAULT_DASHBOARD_ID,
  views: [],
}

export const useDashboardStore = create<LayoutStoreType>()(
  // persist(
  immer(
    (set, _get) => ({
      currentDashboard: DEFAULT_DASHBOARD,
      dashboards: new Map<string, DashoboardType>([[DEFAULT_DASHBOARD_ID, DEFAULT_DASHBOARD]]),
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
              structure: structure,
            };
            dashboard.views.push(view);
          }
          view.structure = structure;

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
          view.structure = callback(view.structure);

          if (state.currentDashboard.id === dashboardId) {
            state.currentDashboard = dashboard;
          }
          
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
