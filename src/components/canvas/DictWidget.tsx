import { getStructureFromSource, Representation, Source } from "@/sources";
import getSize, { type Size } from "@/structures/size";
import { BaseStructure, DictStructure } from "@/structures/types";
import React, { useMemo } from "react";
import { Group } from "react-konva";
import { Widget } from "../registry";
import { WidgetProps } from "../widget";
import MovableContainer from "./MovableContainer";
import render from "./render";

const WIDGET_TYPE = "dict";


export type DictCanvasRepresentation = {
  type: "dict";
  source: Source;
  key_representation?: Representation;
  value_representation?: Representation;
} & Representation;


const getDefaultRepresentation = (_: BaseStructure): DictCanvasRepresentation => {
  return {
    type: WIDGET_TYPE,
    source: {
      type: "ref",
      path: "item",
    } as Source,
  } as DictCanvasRepresentation;
}

const getDictSize = (
  structure: BaseStructure,
  representation: DictCanvasRepresentation | null,
) => {
  if (!representation) {
    representation = getDefaultRepresentation(structure);
  }

  let source = representation.source as Source;
  if (!source) {
    source = {
      type: "ref",
      path: "item",
    } as Source;
  }

  let w = 0;
  let h = 0;

  let struct: DictStructure;
  struct = getStructureFromSource(structure, source) as DictStructure;
  
  const spacing = representation.style?.spacing || 5; 
  const margin = representation.style?.margin || 5;

  let maxKeyW = 0;
  let maxValueW = 0;

  const movableContainerSpacing = spacing * 2;

  for (let i = 0; i < struct.keys.length; i++) {
    const key_structure = struct.keys[i];
    const value_structure = struct.values[i];
    const key_representation = representation.key_representation || null;
    const value_representation = representation.value_representation || null;

    const keySize = getSize(key_structure, key_representation);
    if (keySize === undefined) {
      console.error("Can't get size of item's key", key_structure, key_representation);
      return undefined;
    }

    const valueSize = getSize(value_structure, value_representation);
    if (valueSize === undefined) {
      console.error("Can't get size of item's value", value_structure, value_representation);
      return undefined;
    }
    
    const itemH = Math.max(keySize.h, valueSize.h);

    maxKeyW = Math.max(maxKeyW, keySize.w);
    maxValueW = Math.max(maxValueW, valueSize.w);

    h += itemH + spacing + movableContainerSpacing;
  }

  w += maxKeyW + maxValueW + spacing * 2 + movableContainerSpacing;

  h -= spacing + movableContainerSpacing;

  return {
    w: w + margin * 2,
    h: h + margin * 2,
  } as Size;
}


function DictCanvasComponent(props: WidgetProps) {
  const { position } = props;

  let representation: DictCanvasRepresentation | null = props.representation as DictCanvasRepresentation;

  if (!representation) {
    representation = getDefaultRepresentation(props.structure);
  }

  let source = representation.source as Source;
  if (!source) {
    source = {
      type: "ref",
      path: "item",
    } as Source;
  }

  if (position === undefined || representation === undefined) {
    return <></>;
  }

  let structure: DictStructure;
  structure = getStructureFromSource(props.structure, source) as DictStructure;

  representation.style = representation?.style;

  const size = useMemo(() => {
    return getSize(props.structure, representation);
  }, [props.structure, representation]);

  if (size === undefined) {
    console.error("Can't get size of list", structure, representation);
    return <></>;
  }

  const spacing = representation.style?.spacing || 5;
  const margin = representation.style?.margin || 5;

  let collectedY = margin;

  const maxKeyWidth = Math.max(...structure.keys.map(key => getSize(key, representation.key_representation || null)?.w || 0));

  const children = structure.keys.map((key, i) => {
    const value = structure.values[i];
    const key_representation = representation.key_representation || null;
    const value_representation = representation.value_representation || null;

    const keySize = getSize(key, key_representation);
    if (keySize === undefined) {
      console.error("Can't get size of item's key", key, key_representation);
      return undefined;
    }

    const valueSize = getSize(value, value_representation);
    if (valueSize === undefined) {
      console.error("Can't get size of item's value", value, value_representation);
      return undefined;
    }

    const itemH = Math.max(keySize.h, valueSize.h);
    
    const key_position = {
      x: position.x + margin,
      y: position.y + collectedY,
    } as Position;
    const value_position = {
      x: position.x + maxKeyWidth + margin + spacing * 2,
      y: position.y + collectedY,
    }
    collectedY += itemH + spacing * 3;
    const key_comp = render(key, key_representation, key_position, `${props.id}.keys.${i}`, -(i+1));
    const value_id = `${props.id}.values.${i}`;
    const value_comp = React.createElement(MovableContainer, {
      item: value,
      margin: margin,
      arrow_start_box: {
        position: key_position,
        size: keySize,
      },
      item_representation: value_representation,
      position: value_position,
      id: value_id,
    });
    // const value_comp = render(value, value_representation, value_position, `${props.id}.values.${i}`, i);

    return (
      <Group
        key={i}
      >
        {key_comp}
        {value_comp}
      </Group>
    )
  });

  return (
    <>
      {/* <Rect
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
        listening={false}
      /> */}
      {children}
    </>
  );
}


export default {
  id: WIDGET_TYPE,
  component: DictCanvasComponent,
  sizeGetter: getDictSize,
} as Widget;