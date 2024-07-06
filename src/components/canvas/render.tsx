import React from "react";
import getWidget from "../registry";
import { Representation } from "@/representation";
import { BaseStructure } from "@/structures/types";


export default function render(structure: BaseStructure, representation: Representation | null, position: Position, id: string, key: number) {
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
