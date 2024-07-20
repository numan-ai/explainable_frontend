import { LATEST_VERSION } from "@/api";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ClipboardCopy } from "lucide-react";

export default function ServerIsOutdatedComponent() {
  const [isCopied, setCopied] = useState(false);
  const pipCommand = "pip install explainable --upgrade";

  return (
    <div className="flex flex-col items-center justify-center mt-[10vh] slower-appear">
      <h1 className="text-xl font-extrabold mb-3">Heads up!</h1>
      <p className="text-sm text-slate-400 text-center">
        Your version of Explainable is outdated. <br/>
        Please update to the latest version ({LATEST_VERSION}) to continue.<br/><br/>
        <code>{pipCommand}</code>
        <Button 
          variant="outline"
          className="w-6 h-6 p-0 ml-2 rounded-[4px]"
          onClick={() => {
            navigator.clipboard.writeText(pipCommand);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }}
        >
          {!isCopied ? (
            <ClipboardCopy className="h-3 w-3"/>
          ) : (
            <Check className="h-3 w-3"/>
          )}
        </Button>
      </p>
    </div>
  )
}