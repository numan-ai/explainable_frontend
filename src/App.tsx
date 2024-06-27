import "./App.css";

import { Cable, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import ExplainableView from "./ExplainableView";
import { ThemeProvider } from "./components/theme-provider";
import { useWebsocketURIStore } from './storages/websocketURIStore';
import { DEFAULT_DASHBOARD_ID, useDashboardStore } from './storages/dashboardStorage';

import api from "./api";
import { pushHistory } from "./structures/history";
import NoConnectionComponent from "./ui/NoConnectionComponent";


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
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 border-slate-500 z-10">
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
  const [dashboard, setStructure, modifyStructure] = useDashboardStore((s) => [
    s.currentDashboard, s.setStructure, s.modifyStructure
  ]);

  useEffect(() => {
    api.onConnected(() => {
      setIsConnected(true);
    });
    api.onDisconnected(() => {
      setIsConnected(false);
    });

    api.onMessage("snapshot", (data) => {
      setStructure(DEFAULT_DASHBOARD_ID, data.view_id, data.structure);
      // setViewSettings(data.settings);
      // setPaused(data.is_paused);
    });

    api.onMessage("diff", (diff) => {
      modifyStructure(DEFAULT_DASHBOARD_ID, diff.view_id, data => {
        pushHistory(data, diff);
        return data;
      });
    });
  }, []);

  const views = dashboard.views.map((view, index) => {
    return (
      <ExplainableView 
        key={index}
        view={view}
      />
    );
  });

  if (isConnected === false) {
    views.length = 0;
    views.push(
      <NoConnectionComponent/>
    );
  }
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full flex-col">
        <Header
          isConnected={isConnected}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            {/* <ExplainableView /> */}
            { views}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
