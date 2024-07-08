import React from "react";
import getWidget from "../registry";
import { Representation } from "@/sources";
import { BaseStructure, DataclassStructure, DictStructure, StringStructure } from "@/structures/types";
import { StringCanvasRepresentation } from "./StringWidget";


export const dataclassDisplayConfig = new Map<string, Representation>();


export function getDefaultDataclassStructure(structure: DataclassStructure) {
  if (!structure || structure.type !== "dataclass") {
    console.error("Can't get dataclass structure", structure);
    return undefined;
  }

  return {
    "type": "dict",
    "keys": Object.keys(structure.data).map(key => {
      return {
        "type": "string",
        "value": key,
      } as StringStructure;
    }),
    "values": Object.values(structure.data),
  } as DictStructure;
}


export function getDataclassRepresentation(structure: DataclassStructure, representation: Representation | null) {
  if (representation) {
    return representation;
  }

  representation = dataclassDisplayConfig.get((structure as DataclassStructure).subtype) || null;

  if (!representation) {
    representation = {
      type: "string",
      format: "Error rendering dataclass",
    } as StringCanvasRepresentation;
  }

  return representation;
}


export default function render(structure: BaseStructure, representation: Representation | null, position: Position, id: string, key: number) {  
  if (!structure) {
    console.error("Can't render structure", structure);
    return null;
  }

  if (structure.type === "dataclass") {
    // representation = (!representation) ? (
    //   dataclassDisplayConfig.get((structure as DataclassStructure).subtype) || null
    // ) : (
    //   representation
    // );
    // console.log(representation);
    // if (!representation) {
    //   structure = getDefaultDataclassStructure(structure as DataclassStructure) as DictStructure;
    // }
    representation = getDataclassRepresentation(structure as DataclassStructure, representation);
  }
  
  const widget_name = representation?.type || structure.type;
  const widget = getWidget(widget_name);

  if (widget === undefined) {
    console.error("Can't find widget", widget_name);
    return null;
  }
  const inst = React.createElement(widget.component, {
    structure: structure,
    representation: representation,
    position: position,
    id: id,
    key: key,
  });
  return inst;
}
