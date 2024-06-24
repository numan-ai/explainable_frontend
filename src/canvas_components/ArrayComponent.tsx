import { StructureWithContext, getBBox } from "@/structures/BBox";
import { Rect } from "react-konva";
import renderCanvas, { getStructureRendering } from "./render";


const defaultStyle = {
  margin: 0,
  spacing: 10,  
}


export default function ArrayCanvasComponent(props: StructureWithContext) {
  const { position } = props;
  if (position === undefined || props.rendering === undefined) {
    return <></>
  }
  const structure = props.structure as ArrayStructure;
  props.rendering.style = props.rendering?.style || defaultStyle;

  const bbox = getBBox(props);
  const style = props.rendering.style;

  let collectedX = props.rendering.style.margin;

  const children = structure.data.map((item, i) => {
    const sub_swc = {
      structure: item,
      rendering: getStructureRendering(item),
    } as StructureWithContext;
    const compBBox = getBBox(sub_swc);
    sub_swc.position = {
      x: position.x + collectedX,
      y: position.y + style.margin,
    } as Position;
    collectedX += compBBox.w + style.spacing;
    const comp = renderCanvas(sub_swc, i);
    return (
      <>
        {comp}
      </>
    )
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