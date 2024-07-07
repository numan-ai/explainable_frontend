import getWidget from "@/components/registry";
import { Representation } from "@/sources";
import { BaseStructure, DataclassStructure, DictStructure } from "./types";
import { getDataclassStructure } from "@/components/canvas/render";


export type Size = {
  w: number,
  h: number,
}


const getSize = (structure: BaseStructure, representation: Representation | null) => {
  if (structure && structure.type === "dataclass" && !representation) {
    structure = getDataclassStructure(structure as DataclassStructure) as DictStructure;
  }

  if (!structure) {
    console.error("Can't get size of structure", structure);
    return undefined;
  }

  const widget_name = representation?.type || structure.type;
  const registeredComponent = getWidget(widget_name);
  if (registeredComponent === undefined) {
    console.error("Can't find component", widget_name);
    return undefined;
  }
  return registeredComponent.sizeGetter(structure, representation);
}

export default getSize;
