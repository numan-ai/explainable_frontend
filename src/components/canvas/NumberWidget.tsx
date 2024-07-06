import { Widget } from "../registry";
import getByPath from "@/structures/path_ref";
import { WidgetProps } from "../widget";

import getSize, { Size } from "@/structures/size";
import { Rect, Text } from "react-konva";
import { BaseStructure, StringStructure } from "@/structures/types";
// Number structure instead of string^^^?

import { useState } from "react";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";


const WIDGET_ID = "number";


export type NumberCanvasRepresentation = {
    type: "number";
    nth_decimal?: number;
    commas?: boolean;
    format?: string;
};

function extractTemplateParts(template: string): [string[], string[]] {
    const regex = /\{([^}]+)\}/g;
    
    const parts = [];
    const placeholders = [];
    
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(template)) !== null) {
      parts.push(template.slice(lastIndex, match.index));
      placeholders.push(match[1]);
      lastIndex = regex.lastIndex;
    }
  
    parts.push(template.slice(lastIndex));
  
    return [parts, placeholders];
  }

const getNumberValue = (structure: BaseStructure, representation: NumberCanvasRepresentation): string => {
    let format = representation.format || "{item}"
    let nth_decimal = representation.nth_decimal || null
    let commas = representation.commas || false
    const [parts, placeholders] = extractTemplateParts(format);
    return parts.map((part, i) => {
      const placeholder = placeholders[i];
      if (i === parts.length - 1) {
        return part;
      }
      const subStructure = getByPath(structure, placeholder) as StringStructure;
      if (typeof subStructure.value !== "number") {
        console.error("Format placeholder", placeholder, "did not resolve to a number");
        return part;
      }

      var number: number = subStructure.value
      var formattedNumber = number.toString()

      if (nth_decimal !== null){
        formattedNumber = number.toFixed(nth_decimal)
      }

      if (commas){
        const parts = formattedNumber.split('.');
        parts[0] = parseFloat(parts[0]).toLocaleString();
        formattedNumber = parts.join('.');
      }

      return part + formattedNumber;
    }).join("");
}

const getNumberSize = (
    structure: BaseStructure,
    representation: NumberCanvasRepresentation,
) => {
    const numberValue = getNumberValue(structure, representation);
    const width = numberValue.toString().length

    return {
        w: Math.max(10 * width + 25, 100),
        h: 100,
    } as Size;

}

function NumberCanvasComponent(props: WidgetProps) {
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
  
    const stringValue = getNumberValue(structure, representation as NumberCanvasRepresentation);
    if (size === undefined) {
        console.error("Can't get size of number", structure, representation);
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
    id: WIDGET_ID,
    component: NumberCanvasComponent,
    sizeGetter: getNumberSize,
} as Widget;