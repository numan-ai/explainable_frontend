import { StructureRendering, getStructureRendering } from "@/canvas_components/render";

export type BBox = {
  w: number,
  h: number,
}

const getArrayBBox = (swc: StructureWithContext): BBox =>{
  const style = swc.rendering?.style;
  if (style === undefined) {
    return {
      w: 0,
      h: 0,
    }
  }
  const bbox: BBox = {
    w: 0,
    h: 0,
  };
  bbox.w = style.margin;
  bbox.h = style.margin;

  const structure = swc.structure as ArrayStructure;

  structure.data.map(item => {
    const sub_swc = {
      structure: item,
      rendering: getStructureRendering(item),
    }
    const itemBBox = getBBox(sub_swc);
    bbox.w += itemBBox.w + style.spacing;
    bbox.h = Math.max(bbox.h, itemBBox.h);
  });

  bbox.w += style.margin - style.spacing;
  bbox.h += style.margin * 2;

  return bbox;
}

const getArrayVBBox = (swc: StructureWithContext): BBox =>{
  const style = swc.rendering?.style;
  if (style === undefined) {
    return {
      w: 0,
      h: 0,
    }
  }
  const bbox: BBox = {
    w: 0,
    h: 0,
  };
  bbox.w = style.margin;
  bbox.h = style.margin;

  const structure = swc.structure as ArrayStructure;

  structure.data.map(item => {
    const sub_swc = {
      structure: item,
      rendering: getStructureRendering(item),
    }
    const itemBBox = getBBox(sub_swc);
    bbox.w = Math.max(bbox.w, itemBBox.w);
    bbox.h += itemBBox.h + style.spacing;
  });

  bbox.w += style.margin * 2;
  bbox.h += style.margin - style.spacing;

  return bbox;
}

const getStringBBox = (swc: StructureWithContext): BBox =>{
  const structure = swc.structure as StringStructure;

  const lines = structure.value.toString().split("\n");
  const biggestLine = lines.reduce((acc, line) => Math.max(acc, line.length), 0);

  const bbox: BBox = {
    w: 0,
    h: 0,
  };
  bbox.w = Math.max(10 * biggestLine + 25, 100);
  bbox.h = 100;

  return bbox;
}

const boxGetters: {
  [key: string]: (structure: any) => BBox
} = {
  "ArrayCanvasComponent": getArrayBBox,
  "ArrayVCanvasComponent": getArrayVBBox,
  "StringCanvasComponent": getStringBBox,
}

export const getBBox = (swc: StructureWithContext) => {
  if (swc.rendering === undefined) {
    return {
      w: 0,
      h: 0,
    };
  }
  if (boxGetters[swc.rendering.component.name] === undefined) {
    console.error("Can't find bbox getter", swc.rendering);
  }
  return boxGetters[swc.rendering.component.name](swc);
}

export type StructureWithContext = {
  structure: BaseStructure;
  position?: Position;
  rendering?: StructureRendering;
}