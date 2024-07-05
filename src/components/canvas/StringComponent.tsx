import type { Widget } from "../registry";
import getSize, { Size } from "@/structures/size";
import { Rect, Text } from "react-konva";
import { useState } from "react";
import { BaseStructure, StringStructure } from "@/structures/types";
import getByPath from "@/structures/path_ref";
import { WidgetProps } from "../widget";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";


export type StringCanvasRepresentation = {
  type: "string";
  max_size?: number;
  format?: string;
};


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


const getStringValue = (structure: BaseStructure, format: string): string => {
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
  representation: StringCanvasRepresentation,
) => {
  // TODO: implement formatting and support for arbitrary structures
  const stringValue = getStringValue(structure, representation.format || "{item}");
  const lines = stringValue.split("\n");
  const biggestLine = Math.min(
    lines.reduce((acc, line) => Math.max(acc, line.length), 0),
    representation.max_size || Number.MAX_SAFE_INTEGER,
  );

  return {
    w: Math.max(10 * biggestLine + 25, 100),
    h: Math.max(50 + lines.length * 20, 100),
  } as Size;
}


function StringCanvasComponent(props: WidgetProps) {
  const { structure, representation, position } = props;
  const size = getSize(structure, representation);

  const [isHovered, setIsHovered] = useState(false);
  const [
    widgetState,
    setIsCollapsed,
    setDragStart,
    setPosition,
  ] = useWidgetStateStorage((s) => [
    s.states[props.id],
    s.setIsCollapsed,
    s.setDragStart,
    s.setPosition,
  ]);

  const stringValue = getStringValue(structure, (representation as StringCanvasRepresentation).format || "{item}");
  if (size === undefined) {
    console.error("Can't get size of string", structure, representation);
    return <></>;
  }

  const isCollapsed = widgetState?.isCollapsed || false;

  const currentPosition = widgetState?.position || position;

  return (
    <>
      <Rect
        x={currentPosition.x}
        y={currentPosition.y}
        width={size.w}
        height={size.h}
        fill={isHovered ? "rgba(30, 41, 59, 0.1)" : "rgba(30, 41, 59, 0.2)"}
        stroke={isCollapsed ? "rgb(30, 41, 59)" : "rgb(20, 20, 20)"}
        strokeWidth={1}
        listening={false}
      />
      <Text
        x={currentPosition.x}
        y={currentPosition.y}
        width={size.w}
        height={size.h}
        fontSize={18}
        fill="lightgray"
        text={stringValue}
        align="center"
        verticalAlign="middle"
        onMouseDown={(evt) => {
          setDragStart(props.id, {
            layerX: evt.evt.layerX,
            layerY: evt.evt.layerY,
            x: currentPosition.x,
            y: currentPosition.y,
          });
        }}
        onMouseMove={(evt) => {
          if (!widgetState?.dragStart) {
            return;
          }
          const dx = evt.evt.layerX - (widgetState?.dragStart.layerX || 0);
          const dy = evt.evt.layerY - (widgetState?.dragStart.layerY || 0);
          setPosition(props.id, {
            x: widgetState?.dragStart.x + dx,
            y: widgetState?.dragStart.y + dy,
          });
        }}
        onMouseUp={(_) => {
          setDragStart(props.id, null);
        }}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setDragStart(props.id, null);
        }}
        onClick={() => {
          // setIsCollapsed(props.id, !isCollapsed);
        }}
      />
    </>
  );
}


export default {
  id: "string",
  component: StringCanvasComponent,
  sizeGetter: getStringSize,
} as Widget;