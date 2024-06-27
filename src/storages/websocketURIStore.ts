import { create } from "zustand";
import { persist } from "zustand/middleware";

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
);
