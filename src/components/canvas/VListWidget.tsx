import { getStructureFromSource, RefSource, Representation, Source } from "@/sources";
import getSize, { type Size } from "@/structures/size";
import { BaseStructure, ListStructure } from "@/structures/types";
import { Group, Rect } from "react-konva";
import { Widget } from "../registry";
import { WidgetProps } from "../widget";
import render from "./render";

const WIDGET_ID = "vlist";


export type ListCanvasRepresentation = {
  type: "vlist";
  source: Source | Source[];
  item_representation?: Representation | Representation[];
} & Representation;


const getDefaultRepresentation = (_: BaseStructure): ListCanvasRepresentation => {
  return {
    type: WIDGET_ID,
    source: {
      type: "reference",
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

  let w = 0;
  let h = 0;

  let items: ListStructure;
  if (Array.isArray(representation.source)) {
    items = {
      "type": "list",
      "data": representation.source.map(source => getStructureFromSource(structure, source)),
    } as ListStructure;
  } else {
    items = getStructureFromSource(structure, representation.source) as ListStructure;
  }
  
  for (let i = 0; i < items.data.length; i++) {
    const item_structure = items.data[i];
    const item_representation = Array.isArray(representation.item_representation) ? (
      representation.item_representation[i]
    ) : (
      representation.item_representation
    );
    const itemSize = getSize(item_structure, item_representation || null);
    if (itemSize === undefined) {
      console.error("Can't get size of item", item_structure, item_representation);
      return undefined;
    }

    w = Math.max(w, itemSize.w);
    h += itemSize.h + (representation.style?.spacing || 5);
  }

  return {
    w: w + (representation.style?.margin || 5) * 2,
    h: h + (representation.style?.margin || 5) * 1,
  } as Size;
}


function ListCanvasComponent(props: WidgetProps) {
  const { position } = props;

  let representation: ListCanvasRepresentation | null = props.representation as ListCanvasRepresentation;

  if (!representation) {
    representation = getDefaultRepresentation(props.structure);
  }

  if (position === undefined || representation === undefined) {
    return <></>;
  }

  let structure: ListStructure;
  if (Array.isArray(representation.source)) {
    structure = {
      "type": "list",
      "data": representation.source.map(source => getStructureFromSource(props.structure, source)),
    }
  } else {
    const source = representation.source as RefSource;
    structure = getStructureFromSource(props.structure, source) as ListStructure;
  }

  representation.style = representation?.style;

  const size = getSize(props.structure, representation);
  if (size === undefined) {
    console.error("Can't get size of list", structure, representation);
    return <></>;
  }

  const style = representation.style || {};

  let collectedY = representation.style?.margin || 5;

  const children = structure.data.map((item, i) => {
    const item_representation = Array.isArray(representation.item_representation) ? (
      representation.item_representation[i]
    ) : (
      representation.item_representation
    ) || null;
    const compSize = getSize(item, item_representation);
    if (compSize === undefined) {
      console.error("Can't get size of list item", item, item_representation);
      return undefined;
    }
    const item_position = {
      x: position.x + (style.margin || 5),
      y: position.y + collectedY,
    } as Position;
    collectedY += compSize.h + (style.spacing || 5);
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
  id: WIDGET_ID,
  component: ListCanvasComponent,
  sizeGetter: getListSize,
} as Widget;