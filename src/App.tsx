import "./App.css";

import { Input } from "@/components/ui/input";
import { Cable, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExplainableView from "./ExplainableView";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { useViewStore } from './storages/viewStorage';
import { useWebsocketURIStore } from './storages/websocketURIStore';

import api, { LATEST_VERSION } from "./api";
import NoConnectionComponent from "./components/NoConnectionComponent";
import ServerIsOutdatedComponent from "./components/ServerIsOutdatedComponent";
import { dataclassDisplayConfig } from "./components/canvas/render";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { IS_MOCKED, MOCK_VIEWS } from "./mock";
import { Representation } from "./sources";
import { pushHistory } from "./structures/history";


const didYouKnowMessages = [
  "Did you know that you can Alt+Click a widget to reset its position",
  "Did you know that you can Shft+Drag to move around without dragging widgets"
]


function checkVersionMatches(a: string, b: string) {
  /* only major and minor versions are checked */

  const a_parts = (a || "0.0.0").split(".");
  const b_parts = (b || "0.0.0").split(".");
  if (a_parts[0] !== b_parts[0]) {
    return false;
  }
  if (a_parts[1] !== b_parts[1]) {
    return false;
  }
  return true;
}


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
    <div>
      <header className="sticky top-0 flex h-[64px] items-center gap-4 border-b bg-background px-4 md:px-6 border-slate-500 z-10">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
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
    </div>
  );
}

const accumulatedDiffs = new Map<string, any[]>();


function Spinner() {
  return (
    <div role="status" className='flex justify-center items-center'>
      <span className='sr-only'>Loading...</span>
      <div className='h-3 w-3 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s] mr-2 ml-0'></div>
      <div className='h-3 w-3 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s] mr-2 ml-0'></div>
      <div className='h-3 w-3 bg-slate-400 rounded-full animate-bounce mr-2 ml-0'></div>
    </div>
  )
}


function ConnectingComponent() {
  return (
    <div className="flex w-full items-center justify-center flex-col absolute top-16 left-0 right-0 bottom-0 bg-background z-10 overflow-hidden y h-[100vh - 64px] pb-48">
      <span className="text-2xl font-semibold mb-5 text-slate-400">Connecting</span>
      <Spinner/>
    </div>
  );
}

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);
  const [isOutdated, setIsOutdated] = useState<boolean | undefined>(undefined);

  const [views, setStructure, modifyStructure] = useViewStore((s) => [
    s.views, s.setStructure, s.modifyStructure,
  ]);

  useEffect(() => {
    setTimeout(() => {
      toast(didYouKnowMessages[Math.floor(Math.random() * didYouKnowMessages.length)]);
    }, 350);

    api.onConnected(() => {
      setIsConnected(true);
    });
    api.onDisconnected(() => {
      setIsConnected(false);
    });

    api.onMessage("init", (data) => {
      if (!checkVersionMatches(data.version, LATEST_VERSION)) {
        setIsOutdated(true);
      } else {
        setIsOutdated(false);
      }
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

    api.onMessage("displayConfig", (config) => {
      dataclassDisplayConfig.clear();
      for (let [key, value] of Object.entries(config)) {
        dataclassDisplayConfig.set(key, value as Representation);
      }
    });

    setInterval(() => {
      // console.log(`I have ${accumulatedDiffs.get("view1")?.length} diffs`);
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
    }, 100);
  }, []);

  let comp = null;

  if (isConnected === false && !IS_MOCKED) {
    comp =(
      <NoConnectionComponent key={-1}/>
    );
  } else if (isConnected === undefined && !IS_MOCKED) {
    comp = <ConnectingComponent key={-1}/>;
  } else {
    const view_components = (IS_MOCKED ? MOCK_VIEWS : views).map((view, index) => {
      return (
        <ExplainableView
          key={index}
          view={view}
          // setScale={(scale) => {
          //   setScale(view.id, scale);
          // }}
        />
      );
    });

    const rows = [];
    for (let idx = 0; idx < view_components.length; idx += 2) {
      rows.push(
        <ResizablePanel
          key={idx}
          className="rounded-none w-full h-full"
        >
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel className="rounded-none w-full h-full">
              {view_components[idx]}
            </ResizablePanel>
            {view_components[idx + 1] && (
              <>
                <ResizableHandle withHandle={true}/>
                <ResizablePanel className="rounded-none w-full h-full">
                  {view_components[idx + 1]}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      );
      if (idx !== view_components.length - 1) {
        rows.push(
          <ResizableHandle
            key={-(idx + 1)}
            withHandle={true}
          />
        );
      }
      // if (idx !== view_components.length - 1) {
      //   panels.push(
      //     <ResizableHandle
      //       key={-(idx + 1)}
      //       withHandle={true}
      //     />
      //   );
      // }
    }
    comp = (
      <>
        {/* <HistoryUI 
          paused={false}
          viewSettings={{view_id: ""}}
          onBackClick={() => {
            
          }}
          onPauseClick={() => {
            api.request("pause", true, (_: any) => {
            });
          }}
          onForwardClick={() => {
            
          }} 
          onSettings={() => {}}
        /> */}
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-none border w-full h-full"
        >
          {rows}
        </ResizablePanelGroup>
      </>
    )
  }

  if (isOutdated) {
    comp = (
      <ServerIsOutdatedComponent/>
    );
  }
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full flex-col h-screen">
        <Header
          isConnected={isConnected}
        />
        <main className="h-full">
          {comp}
        </main>
      </div>
    </ThemeProvider>
  )
}
