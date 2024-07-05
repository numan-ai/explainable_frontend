import React from "react";
import getWidget from "../registry";
import { Representation } from "@/representation";
import { BaseStructure } from "@/structures/types";


export default function render(structure: BaseStructure, representation: Representation, position: Position, id: string, key: number) {
  const component_name = representation.type;
  const widget = getWidget(component_name);

  if (widget === undefined) {
    console.error("Can't find widget", component_name);
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
