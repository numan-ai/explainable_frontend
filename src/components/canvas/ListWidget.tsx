import { getStructureFromSource, RefSource, Representation, Source } from "@/sources";
import getSize, { type Size } from "@/structures/size";
import { BaseStructure, ListStructure } from "@/structures/types";
import { Group, Rect } from "react-konva";
import { Widget } from "../registry";
import { WidgetProps } from "../widget";
import render from "./render";

const WIDGET_TYPE = "list";


export type ListCanvasRepresentation = {
  type: "list";
  source: Source | Source[];
  item_widget?: Representation | Representation[];
} & Representation;


const getDefaultRepresentation = (_: BaseStructure): ListCanvasRepresentation => {
  return {
    type: WIDGET_TYPE,
    source: {
      type: "ref",
      path: "item",
    } as Source,
  } as ListCanvasRepresentation;
}


const getListSize = (
  structure: BaseStructure,
  representation: ListCanvasRepresentation | null,
) => {
  if (!representation) {
    representation = getDefaultRepresentation(structure);
  }
  let source = representation.source as Source;
  if (!source) {
    source = {
      type: "ref",
      path: "item",
    } as RefSource;
  }

  let w = 0;
  let h = 0;

  let items: ListStructure;
  if (Array.isArray(source)) {
    items = {
      "type": "list",
      "data": source.map(source => getStructureFromSource(structure, source)),
    } as ListStructure;
  } else {
    items = getStructureFromSource(structure, source) as ListStructure;
  }
  
  for (let i = 0; i < items.data.length; i++) {
    const item_structure = items.data[i];
    if (item_structure === undefined) {
      console.error("Can't get structure item", items);
      return undefined;
    }
    const item_representation = Array.isArray(representation.item_widget) ? (
      representation.item_widget[i]
    ) : (
      representation.item_widget
    );
    const itemSize = getSize(item_structure, item_representation || null);
    if (itemSize === undefined) {
      console.error("Can't get size of item", item_structure, item_representation);
      return undefined;
    }

    w += itemSize.w + (representation.style?.spacing ?? 5);
    h = Math.max(h, itemSize.h);
  }

  w -= (representation.style?.spacing ?? 5);

  return {
    w: w + (representation.style?.margin ?? 5) * 2,
    h: h + (representation.style?.margin ?? 5) * 2,
  } as Size;
}


function ListCanvasComponent(props: WidgetProps) {
  const { position } = props;

  let representation: ListCanvasRepresentation | null = props.representation as ListCanvasRepresentation;

  if (!representation) {
    representation = getDefaultRepresentation(props.structure);
  }
  let source = representation.source as Source;
  if (!source) {
    source = {
      type: "ref",
      path: "item",
    } as RefSource;
  }

  if (position === undefined || representation === undefined) {
    return <></>;
  }

  let structure: ListStructure;
  if (Array.isArray(source)) {
    structure = {
      "type": "list",
      "data": source.map(source => getStructureFromSource(props.structure, source)),
    }
  } else {
    structure = getStructureFromSource(props.structure, source) as ListStructure;
  }

  const size = getSize(props.structure, representation);
  if (size === undefined) {
    console.error("Can't get size of list", structure, representation);
    return <></>;
  }

  const style = representation.style || {};

  let collectedX = representation.style?.margin ?? 5;

  const children = structure.data.map((item, i) => {
    const item_representation = Array.isArray(representation.item_widget) ? (
      representation.item_widget[i]
    ) : (
      representation.item_widget
    ) || null;
    const compSize = getSize(item, item_representation);
    if (compSize === undefined) {
      console.error("Can't get size of list item", item, item_representation);
      return undefined;
    }
    const item_position = {
      x: position.x + collectedX,
      y: position.y + (style.margin ?? 5),
    } as Position;
    collectedX += compSize.w + (style.spacing ?? 5);
    const comp = render(item, item_representation, item_position, `${props.id}.${i}`, i);
    
    return (
      <Group
        key={i}
        // onMouseDown={(e) => {
        //   startDraggingItem(item.struct_id, e.evt.layerX, e.evt.layerY);
        // }}
        // onMouseMove={(e) => {
        //   dragItem(item.struct_id, e.evt.layerX, e.evt.layerY);
        // }}
        // onMouseUp={(_) => {
        //   endDraggingItem(item.struct_id);
        // }}
      >
        {comp}
      </Group>
    )
  });

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
        listening={false}
      />
      {children}
    </>
  );
}


export default {
  id: WIDGET_TYPE,
  component: ListCanvasComponent,
  sizeGetter: getListSize,
} as Widget;