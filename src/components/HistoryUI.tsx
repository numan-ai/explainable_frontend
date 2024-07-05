import type { ViewSettings } from "@/ExplainableView";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideUndo, LucideSettings, LucideRedo, LucidePlay, LucidePause } from "lucide-react";

interface HistoryUIProps {
  paused: boolean;
  onBackClick: () => void;
  onForwardClick: () => void;
  onPauseClick: () => void;
  onSettings: () => void;

  viewSettings: ViewSettings;
}

type UIButtonProps = {
  onClick: () => void;
  children: any;
}

function UIButton(props: UIButtonProps) {
  return (
    <Button
      className="rounded-none [&:not(:last-child)]:border-r-0 text-slate-300"
      variant="outline"
      size="icon"
      onClick={props.onClick}>
      {props.children}
    </Button>
  )
}

type ViewSettingsDrawerProps = {
  children: any;
  viewSettings: ViewSettings;
}

function ViewSettingsDrawer(props: ViewSettingsDrawerProps) {
  return (
    <Drawer shouldScaleBackground={true} direction="right">
      <DrawerTrigger asChild>
        {props.children}
      </DrawerTrigger>
      <DrawerContent showBar={false} className="flex flex-col justify-center items-center w-[350px] h-screen mt-0 pt-8 top-0 right-0 left-auto rounded-none p-4">
        <DrawerHeader>
          <DrawerTitle>View Settings</DrawerTitle>
          <DrawerDescription className="w-full text-center">
            Work in progress
          </DrawerDescription>
        </DrawerHeader>
        <div className="w-full m-1">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">View ID</Label>
          <Input placeholder="View ID" defaultValue={props.viewSettings.view_id} />
        </div>
        </div>
        <DrawerFooter className="w-[350px] items-center">
          <DrawerClose className="flex flex-row items-center gap-2">
            <Button variant="outline">Save</Button>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default function HistoryUI(props: HistoryUIProps) {
  return (
    <div className="flex flex-row justify-between items-left p-2 border border-b-0">
      <div>
        <UIButton onClick={props.onBackClick}><LucideUndo size={18}/></UIButton>
        <UIButton onClick={props.onPauseClick}>{props.paused ? <LucidePlay size={18}/> : <LucidePause size={18}/>}</UIButton>
        <UIButton onClick={props.onForwardClick}><LucideRedo size={18}/></UIButton>
      </div>
      <div>
        <ViewSettingsDrawer
          viewSettings={props.viewSettings}
        >
          <UIButton onClick={() => {}}>
            <LucideSettings size={18}/>
          </UIButton>
        </ViewSettingsDrawer>
      </div>
    </div>
  );
}
