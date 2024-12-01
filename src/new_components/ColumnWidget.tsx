import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { useShallow } from 'zustand/react/shallow';
import { getWidget, getWidgetSize } from "./registry";
import React from "react";


const WIDGET_ID = "column";

const getSize = (
  data: any,
) => {
  let w = 0;
  let h = 0;

  for (let widget of data) {
    const size = getWidgetSize(widget.widget, widget.data);
    if (size === undefined) {
      console.error("Can't get size of list item", widget);
      return undefined;
    }
    w = Math.max(w, size.w);
    h += size.h;
  }
  return {
    w,
    h,
  };
}


function Widget(props: {
  container_id: string,
  position: Position,
  id: string,
  data: any,
}) {
  const [
    widgetState,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states.get(props.container_id),
  ]));

  const currentPosition = widgetState?.position;
  if (!currentPosition) {
    return null;
  }

  const size = getSize(props.data);
  if (size === undefined) {
    console.error("Can't get size of list item");
    return <></>;
  }

  const widgets = [];
  let y = props.position.y;

  for (let widget of props.data) {
    const widgetComponent = getWidget(widget.widget);
    if (!widgetComponent) {
      console.error("Can't find widget", widget.widget);
      continue;
    }
    const size = getWidgetSize(widget.widget, widget.data);
    if (size === undefined) {
      console.error("Can't get size of list item", widget);
      continue;
    }
    widgets.push(React.createElement(widgetComponent, {
      container_id: props.container_id,
      position: {
        x: props.position.x,
        y: y,
      },
      id: widget.object_id,
      data: widget.data,
    }));
    y += size.h;
  }

  return (
    <>
      {widgets}
    </>
  );
}

export default {
  id: WIDGET_ID,
  getSize,
  Widget,
};