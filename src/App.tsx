import "./App.css";

import { Cable, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import ExplainableView from "./ExplainableView";
import { ThemeProvider } from "./components/theme-provider";
import { useWebsocketURIStore } from './storages/websocketURIStore';
import { useViewStore } from './storages/viewStorage';

import api from "./api";
import { pushHistory } from "./structures/history";
import NoConnectionComponent from "./components/NoConnectionComponent";
import { IS_MOCKED, MOCK_VIEWS } from "./mock";


function ServerURIInput() {
  const [uri, setURI] = useWebsocketURIStore((s) => [s.uri, s.setURI]);

  useEffect(() => {
    api.reconnect(uri);
  }, []);

  return (
    <div className="relative flex flex-row items-center">
      <Input 
        placeholder="Server URI"
        name="server-uri"
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

const accumulatedDiffs = new Map<string, any[]>();


export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);
  const [views, setStructure, modifyStructure, setScale] = useViewStore((s) => [
    s.views, s.setStructure, s.modifyStructure, s.setScale,
  ]);

  useEffect(() => {
    api.onConnected(() => {
      setIsConnected(true);
    });
    api.onDisconnected(() => {
      setIsConnected(false);
    });

    api.onMessage("snapshot", (data) => {
      setStructure(data.view_id, data.structure, data.widget);
      accumulatedDiffs.clear();
    });

    api.onMessage("diff", (diff) => {
      if (!accumulatedDiffs.has(diff.view_id)) {
        accumulatedDiffs.set(diff.view_id, []);
      }
      accumulatedDiffs.get(diff.view_id)!.push(diff);
    });

    setInterval(() => {
      for (let view_id of accumulatedDiffs.keys()) {
        const diffs = accumulatedDiffs.get(view_id)!.slice();
        accumulatedDiffs.get(view_id)!.length = 0;
        if (!diffs.length) {
          continue;
        }
        modifyStructure(view_id, data => {
          for (let diff of diffs) {
            pushHistory(data, diff);
          }
          return data;
        });
      }
    }, 50);
  }, []);

  const view_components = (IS_MOCKED ? MOCK_VIEWS : views).map((view, index) => {
    return (
      <ExplainableView
        key={index}
        view={view}
        setScale={(scale) => {
          setScale(view.id, scale);
        }}
      />
    );
  });

  if (isConnected === false) {
    views.length = 0;
    view_components.push(
      <NoConnectionComponent key={-1}/>
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
            { view_components}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
