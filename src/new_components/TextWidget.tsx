import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { Rect, Text } from "react-konva";
import { useShallow } from 'zustand/react/shallow';


const WIDGET_ID = "text";

type TextWidgetData = {
  text: string;
  width: number;
  background: string;
  foreground: string;
}

const getSize = (
  data: string | TextWidgetData,
) => {
  return {
    w: data.width ?? 300 + 10,
    h: 90 + 10,
  };
}


function Widget(props: {
  container_id: string,
  position: Position,
  id: string,
  data: string | TextWidgetData,
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
    console.error("Can't get size of text widget");
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
        fill={props.data.background ?? "rgb(42, 58, 84)"}
        strokeWidth={1}
        listening={false}
      />
      <Text
        x={currentPosition.x + props.position.x}
        y={currentPosition.y + props.position.y}
        width={size.w}
        height={size.h}
        fontSize={18}
        fill={props.data.foreground ?? "lightgray"}
        text={props.data.text ?? props.data}
        align="center"
        verticalAlign="middle"
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