import { Size } from "@/structures/size";
import { Representation } from "@/sources";
import ListCanvasWidget from "./canvas/ListWidget";
import VListCanvasWidget from "./canvas/VListWidget";
import DictCanvasWidget from "./canvas/DictWidget";
import GraphCanvasWidget from "./canvas/GraphWidget";
import StringCanvasWidget from "./canvas/StringWidget";
import NumberCanvasWidget from "./canvas/NumberWidget";
import { BaseStructure } from "@/structures/types";


export type Widget = {
  id: string;
  component: (props: any) => JSX.Element;
  sizeGetter: (
    structure: BaseStructure,
    representation: Representation | null,
  ) => Size | undefined;
}


const registeredWidgets: Map<string, Widget> = new Map<string, Widget>([
  [ListCanvasWidget.id, ListCanvasWidget],
  [VListCanvasWidget.id, VListCanvasWidget],
  [DictCanvasWidget.id, DictCanvasWidget],
  [GraphCanvasWidget.id, GraphCanvasWidget],
  [StringCanvasWidget.id, StringCanvasWidget],
  [NumberCanvasWidget.id, NumberCanvasWidget],
]);

const getWidget = (name: string) => {
  const widget = registeredWidgets.get(name);
  if (widget === undefined) {
    console.error("Can't find widget", name);
    return undefined;
  }
  return widget;
}

export default getWidget;
