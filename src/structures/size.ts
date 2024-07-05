import getWidget from "@/components/registry";
import { Representation } from "@/representation";
import { BaseStructure } from "./types";


export type Size = {
  w: number,
  h: number,
}


const getSize = (structure: BaseStructure, representation: Representation) => {
  const registeredComponent = getWidget(representation.type);
  if (registeredComponent === undefined) {
    console.error("Can't find component", representation.type);
    return undefined;
  }
  return registeredComponent.sizeGetter(structure, representation);
}

export default getSize;
