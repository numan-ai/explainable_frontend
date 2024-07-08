import { getStructureFromSource, Representation, Source } from "@/sources";
import getByPath from "@/structures/path_ref";
import getSize, { Size } from "@/structures/size";
import { Rect, Text } from "react-konva";
import { Widget } from "../registry";
import { WidgetProps } from "../widget";

import getJustUpdatedState from "@/just_updated";
import { BaseStructure, NumberStructure } from "@/structures/types";


const WIDGET_TYPE = "number";


export type NumberCanvasRepresentation = {
  type: "number";
  source?: Source;
  round?: number;
  separation?: boolean;
};


const getDefaultRepresentation = (_: BaseStructure): NumberCanvasRepresentation => {
  return {
    type: WIDGET_TYPE,
    source: {
      type: "ref",
      path: "item",
    },
  } as NumberCanvasRepresentation
}


export const getNumberValue = (structure: BaseStructure, representation: NumberCanvasRepresentation): string => {
  let round = representation.round || null;
  let separation = representation.separation || false;

  let numRepresentation = representation as NumberCanvasRepresentation;
  if (!numRepresentation) {
    numRepresentation = getDefaultRepresentation(structure);
  }

  let source = numRepresentation.source as Source;
  if (!source) {
    source = {
      type: "ref",
      path: "item",
    } as Source;
  }
  const newStructure = getStructureFromSource(structure, source) as NumberStructure;
  if (typeof newStructure.value !== "number") {
    console.error("Format placeholder item did not resolve to a number");
  }

  var number: number = newStructure.value;
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
  representation: Representation,
) => {
  let num_representation = representation as NumberCanvasRepresentation;
  if (!num_representation) {
    num_representation = getDefaultRepresentation(structure);
  }
  const numberValue = getNumberValue(structure, num_representation);
  const width = numberValue.length

  return {
    w: Math.max(10 * width + 25, 100),
    h: 100,
  } as Size;
}


function NumberCanvasComponent(props: WidgetProps) {
  const { position } = props;
  let representation: NumberCanvasRepresentation | null = props.representation as NumberCanvasRepresentation;

  if (!props.representation) {
    representation = getDefaultRepresentation(props.structure);
  }

  let source = representation.source as Source;
  if (source === undefined) {
    source = {
      type: "ref",
      path: "item",
    } as Source;
  }
  const structure = getStructureFromSource(props.structure, source) as NumberStructure;

  const size = getSize(structure, representation);

  const justUpdatedState = getJustUpdatedState(props.structure, props.id);

  const numberValue = getNumberValue(structure, representation);
  if (size === undefined) {
    console.error("Can't get size of number", structure, representation);
    return <></>;
  }

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        fill={`rgba(30, 41, 59, ${(justUpdatedState * 0.8 + 0.2).toFixed(2)})`}
        stroke={false ? "rgb(30, 41, 59)" : "rgb(20, 20, 20)"}
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
  id: WIDGET_TYPE,
  component: NumberCanvasComponent,
  sizeGetter: getNumberSize,
} as Widget;