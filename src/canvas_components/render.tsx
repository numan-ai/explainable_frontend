import type { StructureWithContext } from "@/structures/BBox"
import ArrayVCanvasComponent from "./ArrayVComponent"
import StringCanvasComponent from "./StringComponent"
import ArrayCanvasComponent from "./ArrayComponent"


export type StructureRendering = {
  component: (props: any) => JSX.Element;
  style?: {[key: string]: any};
}


export const renderingContexts: {
  [key: string]: StructureRendering
} = {
  "view1": {
    component: ArrayVCanvasComponent,
  },
}


export const getStructureRendering = (structure: BaseStructure): StructureRendering => {
  const func = renderingContexts[structure.struct_id];
  if (func !== undefined) {
    return func;
  }
  return {
    component: renderComponentMap[structure.type],
  };
}


export const renderComponentMap: {
  [key: string]: (props: any) => JSX.Element
} = {
  "string": StringCanvasComponent,
  "number": StringCanvasComponent,
  "array": ArrayCanvasComponent,
  "null": StringCanvasComponent,
}

export default function renderCanvas(swc: StructureWithContext, key: number) {
  swc.rendering = getStructureRendering(swc.structure);
  const comp = swc.rendering.component;
  const inst = comp({
    ...swc,
    key: key,
  });
  return inst;
}

export const defaultStyles = {
  [ArrayCanvasComponent.name]: {
    margin: 0,
    spacing: 10,
  },
  [ArrayVCanvasComponent.name]: {
    margin: 0,
    spacing: 10,
  }
}