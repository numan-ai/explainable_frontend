import { Size } from "@/structures/size";
import { Representation } from "@/representation";
import ListCanvasWidget from "./canvas/ListWidget";
import StringCanvasWidget from "./canvas/StringWidget";
import { BaseStructure } from "@/structures/types";


export type Widget = {
  id: string;
  component: (props: any) => JSX.Element;
  sizeGetter: (
    structure: BaseStructure,
    representation: Representation,
  ) => Size | undefined;
}


const registeredWidgets: Map<string, Widget> = new Map<string, Widget>([
  [ListCanvasWidget.id, ListCanvasWidget],
  [StringCanvasWidget.id, StringCanvasWidget],
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
