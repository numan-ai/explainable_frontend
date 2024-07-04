import { StructureWithContext, getBBox } from "@/structures/BBox";
import { Group, Rect } from "react-konva";
import renderCanvas, { defaultStyles, getStructureRendering } from "./render";
import { useDashboardStore } from "@/storages/dashboardStorage";
import { useMemo } from "react";


export default function ArrayCanvasComponent(props: StructureWithContext) {
  const [moveStructure] = useDashboardStore(s => {
    return [s.moveStructure, ]
  });

  const { position } = props;

  if (position === undefined || props.rendering === undefined) {
    return <></>;
  }

  const startDraggingItem = (struct_id: string, x: number, y: number) => {
    moveStructure(struct_id, x, y, true);
  }

  const dragItem = (struct_id: string, x: number, y: number) => {
    moveStructure(struct_id, x, y, false);
  }

  const endDraggingItem = (struct_id: string) => {
    moveStructure(struct_id, null, null, false);
  }

  const structure = props.structure as ArrayStructure;
  props.rendering.style = props.rendering?.style || defaultStyles[ArrayCanvasComponent.name];

  const bbox = getBBox(props);
  const style = props.rendering.style;

  let collectedX = props.rendering.style.margin;

  // const children = useMemo(() => {
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
        <Group
          key={i}
          onMouseDown={(e) => {
            startDraggingItem(item.struct_id, e.evt.layerX, e.evt.layerY);
          }}
          onMouseMove={(e) => {
            dragItem(item.struct_id, e.evt.layerX, e.evt.layerY);
          }}
          onMouseUp={(e) => {
            endDraggingItem(item.struct_id);
          }}
        >
          {comp}
        </Group>
      )
    });
  // }, [structure.data]);

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