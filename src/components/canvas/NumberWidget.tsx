import { Widget } from "../registry";
import getByPath from "@/structures/path_ref";
import { WidgetProps } from "../widget";
import { useState } from "react";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { getStructureFromSource, Source } from "@/sources";
import getSize, { Size } from "@/structures/size";
import { Rect, Text } from "react-konva";

import { BaseStructure, NumberStructure } from "@/structures/types";


const WIDGET_ID = "number";


export type NumberCanvasRepresentation = {
  source: Source;
  type: "number";
  round?: number;
  separation?: boolean;
};


const getDefaultRepresentation = (_: BaseStructure): NumberCanvasRepresentation => {
  return {
    type: WIDGET_ID,
  } as NumberCanvasRepresentation
}


export const getNumberValue = (structure: BaseStructure, representation: NumberCanvasRepresentation): string => {
  let round = representation.round || null
  let separation = representation.separation || false


  const subStructure = getByPath(structure, "item") as NumberStructure;
  if (typeof subStructure.value !== "number") {
    console.error("Format placeholder item did not resolve to a number");
  }

  var number: number = subStructure.value
  var formattedNumber = number.toString()

  if (round !== null){
    formattedNumber = number.toFixed(round)
  }

  if (separation){
    const parts = formattedNumber.split('.');
    parts[0] = parseFloat(parts[0]).toLocaleString();
    formattedNumber = parts.join('.');
  }

  return formattedNumber;
}


const getNumberSize = (
  structure: BaseStructure,
  representation: NumberCanvasRepresentation,
) => {
  if (!representation) {
    representation = getDefaultRepresentation(structure);
  }
  const numberValue = getNumberValue(structure, representation);
  const width = numberValue.toString().length

  return {
    w: Math.max(10 * width + 25, 100),
    h: 100,
  } as Size;
}


function NumberCanvasComponent(props: WidgetProps) {
  const { position } = props;
  let representation: NumberCanvasRepresentation | null = props.representation as NumberCanvasRepresentation;

  const source = representation.source as Source
  const structure = getStructureFromSource(props.structure, source) as NumberStructure;

  if (!props.representation) {
    representation = getDefaultRepresentation(structure);
  }

  const size = getSize(structure, representation);

  const [isHovered, setIsHovered] = useState(false);
  const [
    widgetState,
  ] = useWidgetStateStorage((s) => [
    s.states[props.id],
  ]);

  const numberValue = getNumberValue(structure, representation);
  if (size === undefined) {
    console.error("Can't get size of number", structure, representation);
    return <></>;
  }
  
  const isCollapsed = widgetState?.isCollapsed || false;

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        fill={isHovered ? "rgba(30, 41, 59, 0.1)" : "rgba(30, 41, 59, 0.2)"}
        stroke={isCollapsed ? "rgb(30, 41, 59)" : "rgb(20, 20, 20)"}
        strokeWidth={1}
        listening={false}
      />
      <Text
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        fontSize={18}
        fill="lightgray"
        text={numberValue}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </>
  );
}


export default {
  id: WIDGET_ID,
  component: NumberCanvasComponent,
  sizeGetter: getNumberSize,
} as Widget;