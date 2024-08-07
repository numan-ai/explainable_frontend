import { getStructureFromSource, Representation, Source } from "@/sources";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import getByPath from "@/structures/path_ref";
import getSize, { Size } from "@/structures/size";
import { BaseStructure, StringStructure } from "@/structures/types";
import { useState } from "react";
import { Rect, Text } from "react-konva";
import { useShallow } from "zustand/react/shallow";
import { Widget } from "../registry";
import { WidgetProps as WidgetComponentProps } from "../widget";


const WIDGET_TYPE = "string";


export type StringCanvasRepresentation = {
  type: "string";
  source?: Source;
  max_size?: number;
  format?: string;
};


const getDefaultRepresentation = (_: BaseStructure): StringCanvasRepresentation => {
  return {
    source: {
      type: "ref",
      path: "item",
    },
    type: WIDGET_TYPE,
    format: "{item}",
  } as StringCanvasRepresentation;
}


function extractTemplateParts(template: string): [string[], string[]] {
  // GPT-generated code to extract template parts from a string
  // Regular expression to match placeholders in the format {placeholder}
  const regex = /\{([^}]+)\}/g;
  
  // Arrays to store parts and placeholders
  const parts = [];
  const placeholders = [];
  
  // Variables to keep track of the last position and match
  let lastIndex = 0;
  let match;

  // Iterate over all matches in the template string
  while ((match = regex.exec(template)) !== null) {
    // Push the string part before the placeholder to the parts array
    parts.push(template.slice(lastIndex, match.index));
    // Push the placeholder itself to the placeholders array
    placeholders.push(match[1]);
    // Update the lastIndex to the end of the current match
    lastIndex = regex.lastIndex;
  }

  // Push the remaining part of the string after the last placeholder
  parts.push(template.slice(lastIndex));

  return [parts, placeholders];
}


export const getStringValue = (structure: BaseStructure, format: string): string => {
  const [parts, placeholders] = extractTemplateParts(format);
  return parts.map((part, i) => {
    const placeholder = placeholders[i];
    if (i === parts.length - 1) {
      return part;
    }
    const subStructure = getByPath(structure, placeholder) as StringStructure;
    if (subStructure === undefined) {
      console.error("Format placeholder", placeholder, "did not resolve to a string");
      return part;
    }
    return part + subStructure.value;
  }).join("");
}


const getStringSize = (
  structure: BaseStructure,
  representation: Representation,
) => {
  let str_representation = representation as StringCanvasRepresentation;
  if (!str_representation) {
    str_representation = getDefaultRepresentation(structure);
  }
  let source = str_representation.source as Source;
  if (!source) {
    source = {
      type: "ref",
      path: "item",
    } as Source;
  }
  const newStructure = getStructureFromSource(structure, source) as StringStructure;
  const stringValue = getStringValue(newStructure, str_representation.format || "{item}");
  const lines = stringValue.split("\n");
  const biggestLine = Math.min(
    lines.reduce((acc, line) => Math.max(acc, line.length), 0),
    str_representation.max_size || Number.MAX_SAFE_INTEGER,
  );

  return {
    w: Math.max(10 * biggestLine + 25, 100),
    h: Math.max(50 + lines.length * 20, 100),
  } as Size;
}


function StringCanvasComponent(props: WidgetComponentProps) {
  const { position } = props;
  let representation: StringCanvasRepresentation | null = props.representation as StringCanvasRepresentation;
  
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
  const structure = getStructureFromSource(props.structure, source) as StringStructure;

  const size = getSize(structure, representation);

  const [isHovered, _] = useState(false);
  const [
    widgetState,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states[props.id],
  ]));

  const stringValue = getStringValue(structure, (representation as StringCanvasRepresentation).format || "{item}");
  if (size === undefined) {
    console.error("Can't get size of string", structure, representation);
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
        text={stringValue}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </>
  );
}


export default {
  id: WIDGET_TYPE,
  component: StringCanvasComponent,
  sizeGetter: getStringSize,
} as Widget;