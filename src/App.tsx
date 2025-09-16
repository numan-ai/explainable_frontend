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

import pako from 'pako';
import api, { MINIMAL_VERSION } from "./api";
import NoConnectionComponent from "./components/NoConnectionComponent";
import ServerIsOutdatedComponent from "./components/ServerIsOutdatedComponent";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { UI_COLORS } from "./lib/colors";
import ReplayUI from "./components/ReplayUI";
import { useReplayStore } from "./storages/replayStorage";


const decompressGzippedData = (gzippedData: string): string | null => {
  try {
    const charData = gzippedData.split('').map(function(x){return x.charCodeAt(0);});
    const buffer = new Uint8Array(charData);

    const decompressedData = pako.ungzip(buffer, { to: 'string' });

    return decompressedData;
  } catch (error) {
    console.error('Error decompressing data:', error);
    return null;
  }
};

const didYouKnowMessages = [
  (<span>
    Did you know that you can
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      Alt + Click
    </kbd>
    a widget to reset its position
  </span>),
  (<span>
    Did you know that you can 
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      Shift + Drag
    </kbd>
    to move around without dragging widgets
  </span>),
  (<span>
    Did you know that you can 
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      Ctrl + 0
    </kbd>
    to reset view position and scale
  </span>),
]


function checkVersionMatches(a: string, b: string) {
  /* only major and minor versions are checked */
  const a_parts = (a || "0.0.0").split(".");
  const b_parts = (b || "0.0.0").split(".");
  if (a_parts[0] < b_parts[0]) {
    return false;
  }
  if (a_parts[0] == b_parts[0] && a_parts[1] < b_parts[1]) {
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
      <header className="sticky top-0 flex h-[64px] items-center gap-4 border-b px-4 md:px-6 z-10" style={{
        borderColor: UI_COLORS.BORDER,
      }}>
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="flex flex-col items-left">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight" style={{
              color: UI_COLORS.TEXT_COLOR,
            }}>
              Explainable
            </h3>
            <a className="text-xs hover:underline" href="https://numan.ai/" tabIndex={-1} style={{
              color: UI_COLORS.TEXT_MUTED_COLOR,
            }}>by Numan Team</a>
          </div>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <div className="relative flex flex-row items-center gap-4">
              <div>
                {props.isConnected === true ? (
                  <Wifi style={{
                    color: UI_COLORS.CONNECTION_COLORS.CONNECTED,
                  }}/> 
                ) : (
                  props.isConnected === false ? (
                    <WifiOff style={{
                      color: UI_COLORS.CONNECTION_COLORS.DISCONNECTED,
                    }}/>
                  ) : (
                    <WifiOff style={{
                      color: UI_COLORS.CONNECTION_COLORS.CONNECTED,
                    }}/>
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
    <div className="flex w-full items-center justify-center flex-col absolute top-16 left-0 right-0 bottom-0 z-10 overflow-hidden y h-[100vh - 64px] pb-48">
      <span className="text-2xl font-semibold mb-5" style={{
        color: UI_COLORS.TEXT_MUTED_COLOR,
      }}>Connecting</span>
      <Spinner/>
    </div>
  );
}

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);
  const [isOutdated, setIsOutdated] = useState<boolean | undefined>(undefined);
  const [isReplay, setIsReplay] = useState<boolean>(false);
  const { setIsRunning } = useReplayStore();

  const [views, setStructure] = useViewStore((s) => [
    s.views, s.setStructure,
  ]);

  useEffect(() => {
    setTimeout(() => {
      toast(didYouKnowMessages[Math.floor(Math.random() * didYouKnowMessages.length)]);
    }, 350);

    api.onConnected(() => {
      setIsConnected(true);
      setTimeout(() => {
        if (api.currentVersion === null) {
          setIsOutdated(true);
        }
      }, 300);
    });
    api.onDisconnected(() => {
      api.currentVersion = null;
      setIsConnected(false);
    });

    api.onMessage("init", (data) => {
      setIsRunning(true);
      api.currentVersion = data.version;
      if (data.type === 'replay') {
        setIsReplay(true);
      } else {
        setIsReplay(false);
      }
      if (!checkVersionMatches(data.version, MINIMAL_VERSION)) {
        setIsOutdated(true);
      } else {
        setIsOutdated(false);
      }
    });

    api.onMessage("snapshot", (data) => {
      const uncompressed = decompressGzippedData(atob(data.structure));
      if (uncompressed === null) {
        console.error("Can't decompress structure");
        return;
      }
      const structure = JSON.parse(uncompressed);
      setStructure(data.view_id, structure);
      // if (api.currentVersion === null) {
      //   setIsOutdated(true);
      // }
      // accumulatedDiffs.clear();
    });
  }, []);

  let comp = null;

  if (isConnected === false) {
    comp =(
      <NoConnectionComponent key={-1}/>
    );
  } else if (isConnected === undefined) {
    comp = <ConnectingComponent key={-1}/>;
  } else {
    const view_components = (views).map((view, index) => {
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
    }
    comp = (
      <>
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-none w-full h-full"
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
      <div className="flex min-h-screen w-full flex-col h-screen" style={{
        backgroundColor: UI_COLORS.BACKGROUND,
      }}>
        <Header
          isConnected={isConnected}
        />
        <main className="h-full">
          {comp}
          {isReplay && (
            <ReplayUI/>
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}
