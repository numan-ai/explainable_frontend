import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { Rect } from "react-konva";
import { useShallow } from 'zustand/react/shallow';
import { getWidgetSize } from "./registry";


function MovableContainer(props: {
  defaultPosition: Position,
  id: string,
  widget: string,
  data: any,
  children?: any,
  is_draggable: boolean,
}) {
  const [
    widgetState,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states.get(props.id),
  ]));

  const currentPosition = props.is_draggable ? (
    widgetState?.position || props.defaultPosition
  ) : (
    props.defaultPosition
  );

  const size = getWidgetSize(props.widget, props.data);
  if (size === undefined) {
    console.error("Can't get size of movable container");
    return <></>;
  }

  return (
    <>
      <Rect
        x={currentPosition.x}
        y={currentPosition.y}
        width={size.w}
        height={size.h}
        stroke="rgb(30, 41, 59)"
        // fill="rgb(42, 58, 84)"
        strokeWidth={1}
        meta={{
          id: props.id,
          is_draggable: props.is_draggable,
        }}
      />
      {props.children}
    </>
  );
}

export default MovableContainer;