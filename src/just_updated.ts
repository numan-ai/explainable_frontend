import { useShallow } from "zustand/react/shallow";
import { useWidgetStateStorage } from "./storages/widgetStateStorage";
import { BaseStructure } from "./structures/types";
import { useEffect, useRef } from "react";


let updatesCounter = new Set<string>();

export default function getJustUpdatedState(structure: BaseStructure, widget_id: string, decaySpeed = 0.1) {
  // return 0.0;
  console.log(updatesCounter.size);
  if (updatesCounter.size >= 10) {
    return 0.0;
  }
  const [
    widgetTempState,
    setJustUpdatedState,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.tempStates[widget_id],
    s.setJustUpdatedState,
  ]));

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updState = widgetTempState?.justUpdatedState;

  useEffect(() => {
    if ((updState === null || updState < 0.8) && (structure?.justUpdated || 0) + 100 > Date.now()) {
      setJustUpdatedState(widget_id, -1.0);
      updatesCounter.add(widget_id);
    }
    
    if (updState !== null && updState >= 0.0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setJustUpdatedState(widget_id, decaySpeed);
      }, 50);
    } else if (updState !== null) {
      updatesCounter.delete(widget_id);
      setTimeout(() => {
        setJustUpdatedState(widget_id, null);
      }, 50);
    }
  }, [widgetTempState, structure?.justUpdated]);

  return Math.max(widgetTempState?.justUpdatedState || 0.0, 0.0);
}
