import React from "react";
import getWidget from "../registry";
import { Representation } from "@/sources";
import { BaseStructure, DataclassStructure, DictStructure, StringStructure } from "@/structures/types";


export function getDataclassStructure(structure: DataclassStructure) {
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


export default function render(structure: BaseStructure, representation: Representation | null, position: Position, id: string, key: number) {  
  if (structure && structure.type === "dataclass" && !representation) {
    structure = getDataclassStructure(structure as DataclassStructure) as DictStructure;
  }

  if (!structure) {
    console.error("Can't render structure", structure);
    return null;
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
