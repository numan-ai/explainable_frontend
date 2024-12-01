import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { Rect } from "react-konva";
import { useShallow } from 'zustand/react/shallow';


const WIDGET_ID = "pixel";

const getSize = (
  data: {
    size: number,
    color: string,
  },
) => {
  return {
    w: data.size,
    h: data.size,
  };
}


function Widget(props: {
  container_id: string,
  position: Position,
  id: string,
  data: {size: number, color: string},
}) {
  const [
    widgetState,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states.get(props.container_id),
  ]));

  const currentPosition = widgetState?.position;
  if (!currentPosition) {
    console.error("Can't find widget state", props.id);
    return null;
  }

  const size = getSize(props.data);
  if (size === undefined) {
    console.error("Can't get size of list item");
    return <></>;
  }

  return (
    <>
      <Rect
        x={currentPosition.x + props.position.x}
        y={currentPosition.y + props.position.y}
        width={size.w}
        height={size.h}
        stroke="rgb(30, 41, 59)"
        fill={props.data.color}
        strokeWidth={1}
        listening={false}
      />
    </>
  );
}

export default {
  id: WIDGET_ID,
  getSize,
  Widget,
};