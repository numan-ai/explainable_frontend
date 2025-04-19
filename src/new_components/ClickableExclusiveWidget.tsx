import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { useShallow } from 'zustand/react/shallow';
import { getWidget, getWidgetSize } from "./registry";
import { Group, Rect } from "react-konva";
import React from "react";
import { useExclusiveSelectionStore } from "@/storages/exclusiveSelectionStore";

const WIDGET_ID = "clickable_exclusive";

type WidgetData = {
  widget: {
    widget: string;
    data: unknown;
    object_id: string;
  };
  group: string;
  object_id: string;
};

const getSize = (
  data: WidgetData,
) => {
  let w = 0;
  let h = 0;
  const size = getWidgetSize(data.widget.widget, data.widget.data);
  if (size === undefined) {
    return undefined;
  }
  w = Math.max(w, size.w);
  h += size.h;

  return {
    w,
    h,
  };
}

function Widget(props: {
  container_id: string,
  position: Position,
  id: string,
  data: WidgetData,
  is_draggable: boolean | undefined,
}) {
  const [
    widgetState,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states.get(props.container_id),
  ]));

  const [selections, setSelection] = useExclusiveSelectionStore(
    useShallow((s) => [s.selections, s.setSelection])
  );

  const isSelected = selections[props.data.group] === props.id;

  const currentPosition = widgetState?.position;
  if (!currentPosition) {
    return null;
  }

  const size = getSize(props.data);
  if (size === undefined) {
    console.error("Can't get size of clickable exclusive widget");
    return <></>;
  }

  const widgetComponent = getWidget(props.data.widget.widget);
  if (!widgetComponent) {
    console.error("Can't find widget", props.data.widget.widget);
    return <></>;
  }
  const widget = React.createElement(widgetComponent, {
    container_id: props.container_id,
    position: {
      x: props.position.x,
      y: props.position.y,
    },
    id: props.data.widget.object_id,
    data: props.data.widget.data,
  });

  const meta = (props.is_draggable === true) ? {
    id: props.container_id,
  } : {};

  return (
    <Group listening={true} onClick={(e) => {
      e.cancelBubble = false;
      setSelection(props.data.group, props.id);
    }}>
      <Rect
        x={currentPosition.x + props.position.x - 1}
        y={currentPosition.y + props.position.y - 1}
        width={size.w + 2}
        height={size.h + 2}
        fill="white"
        stroke={isSelected ? "#2196F3" : "black"}
        strokeWidth={isSelected ? 2 : 1}
        meta={meta}
      />
      {widget}
    </Group>
  );
}

export default {
  id: WIDGET_ID,
  getSize,
  Widget,
};