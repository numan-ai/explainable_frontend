import { StructureWithContext, getBBox } from "@/structures/BBox";
import { Rect } from "react-konva";
import renderCanvas, { getStructureRendering } from "./render";


const defaultStyle = {
  margin: 0,
  spacing: 10,  
}


export default function ArrayVCanvasComponent(props: StructureWithContext) {
  const { position } = props;
  if (position === undefined || props.rendering === undefined) {
    return <></>
  }
  const structure = props.structure as ArrayStructure;
  props.rendering.style = props.rendering?.style || defaultStyle;

  const bbox = getBBox(props);
  const style = props.rendering.style;

  let collectedY = style.margin;

  const children = structure.data.map((item, i) => {
    const swc = {
      structure: item,
      position: {x: 0, y: 0},
      rendering: getStructureRendering(item),
    } as StructureWithContext;
    const compBBox = getBBox(swc);
    swc.position = {
      x: position.x + style.margin,
      y: position.y + collectedY,
    };
    collectedY += compBBox.h + style.spacing;
    return renderCanvas(swc, i);
  });

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={bbox.w}
        height={bbox.h}
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
      />
      {children}
    </>
  );
}