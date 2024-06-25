import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cable, Wifi, WifiOff } from "lucide-react";
import "./App.css";

import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import api from "./api";
import ExplainableView from "./ExplainableView";
import { ThemeProvider } from "./components/theme-provider";

const DEFAULT_SERVER_URI = "ws://localhost:8120";


type WebsocketURIStoreType = {
  uri: string;
  setURI: (newURI: string) => void;
};

export const useWebsocketURIStore = create<WebsocketURIStoreType, [
  ['zustand/persist', WebsocketURIStoreType],
]>(
  persist(
    (set, _get) => ({
      uri: DEFAULT_SERVER_URI,
      setURI: (newURI: string) => set({ uri: newURI }),
    }),
    {
      name: 'numan:explainable.ws.uri',
    },
  ),
)

type DashboardViewType = {
  id: string;
}

type DashoboardType = {
  id: string;
  views: Array<DashboardViewType>;
};

type LayoutStoreType = {
  currentDashboard: string;
  dashboards: Map<string, DashoboardType>;
  addView: (view: DashboardViewType) => void;
  addDashboard: (dashboard: DashoboardType) => void;
  selectDashboard: (dashboardId: string) => void;
};

export const useDashboardStore = create<LayoutStoreType, [
  ['zustand/persist', LayoutStoreType],
]>(
  persist(
    (set, _get) => ({
      currentDashboard: "default",
      dashboards: new Map<string, DashoboardType>([
        ["default", {
          id: "default",
          views: [],
        }],
      ]),
      addView: (_view: DashboardViewType) => {
      },
      addDashboard: (_dashboard: DashoboardType) => {
      },
      selectDashboard: (dashboardId: string) => {
        set({ currentDashboard: dashboardId });
      },
    }),
    {
      name: 'numan:explainable.dashboard',
    },
  ),
)


function ServerURIInput() {
  const [uri, setURI] = useWebsocketURIStore((s) => [s.uri, s.setURI]);

  useEffect(() => {
    api.reconnect(uri);
  }, []);

  return (
    <div className="relative flex flex-row items-center">
      <Input 
        placeholder="Server URI"
        value={uri}
        onChange={(e) => setURI(e.target.value)}
        className="border-r-0 border-slate-500 min-w-64 rounded-r-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            api.reconnect(uri);
          }
        }}
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="w-12 border-slate-500 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-slate-200 rounded-l-none"
        onClick={() => {
          api.reconnect(uri);
        }}
      >
        <Cable className="h-4 w-4" />
      </Button>
    </div>
  )
}


type HeaderProps = {
  isConnected?: boolean;
};

function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 border-slate-500">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="flex flex-col items-left">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Explainable
          </h3>
          <a className="text-xs text-slate-400" href="https://numan.ai/" tabIndex={-1}>by Numan</a>
        </div>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative flex flex-row items-center gap-4">
            <div>
              {props.isConnected === true ? (
                <Wifi className="text-slate-400"/> 
              ) : (
                props.isConnected === false ? (
                  <WifiOff className="text-red-500"/>
                ) : (
                  <WifiOff className="text-slate-900"/>
                )
              )}
            </div>
            <ServerURIInput/>
          </div>
        </div>
      </div>
    </header>
  );
}


export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    api.onConnected(() => {
      setIsConnected(true);
    });
    api.onDisconnected(() => {
      setIsConnected(false);
    });
  }, []);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full flex-col">
        <Header
          isConnected={isConnected}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            {/* <ExplainableView /> */}
            <ExplainableView view_id="view1"/>
            <ExplainableView view_id="view2"/>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
