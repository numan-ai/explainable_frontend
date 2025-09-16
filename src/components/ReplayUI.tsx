import { Pause, Play } from "lucide-react";
import { Button } from "./ui/button";
import api from "@/api";
import { useReplayStore } from "@/storages/replayStorage";

const ReplayUI = () => {
  const { isRunning, toggleIsRunning } = useReplayStore();

  return (
    <div className="flex flex-row gap-1 fixed top-[64px] right-0 p-1 w-100 bg-foreground">
      <Button variant="outline" size="icon" className="w-8 h-8 rounded-none" onClick={() => {
        api.request("replay-running", !isRunning, () => {});
        toggleIsRunning();
      }}>
        {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
      </Button>
    </div>
  );
};

export default ReplayUI;