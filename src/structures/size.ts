import getWidget from "@/components/registry";
import { Representation } from "@/sources";
import { BaseStructure } from "./types";


export type Size = {
  w: number,
  h: number,
}


const getSize = (structure: BaseStructure, representation: Representation | null) => {
  const widget_name = representation?.type || structure.type;
  const registeredComponent = getWidget(widget_name);
  if (registeredComponent === undefined) {
    console.error("Can't find component", widget_name);
    return undefined;
  }
  return registeredComponent.sizeGetter(structure, representation);
}

export default getSize;
