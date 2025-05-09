import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { Rect, Text } from "react-konva";
import { useShallow } from 'zustand/react/shallow';
import { CANVAS_COLORS } from "@/lib/colors";


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
  if (typeof data === 'string') {
    return {
      w: 300 + 10,
      h: 90 + 10,
    };
  }
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

  const background = typeof props.data === 'object' && props.data !== null ? props.data.background : null;
  const foreground = typeof props.data === 'object' && props.data !== null ? props.data.foreground : null;
  const text = typeof props.data === 'object' && props.data !== null ? props.data.text : props.data;

  return (
    <>
      <Rect
        x={currentPosition.x + props.position.x}
        y={currentPosition.y + props.position.y}
        width={size.w}
        height={size.h}
        stroke={CANVAS_COLORS.WIDGET.STROKE}
        fill={background ?? CANVAS_COLORS.WIDGET.BACKGROUND}
        strokeWidth={1}
        listening={false}
      />
      <Text
        x={currentPosition.x + props.position.x}
        y={currentPosition.y + props.position.y}
        width={size.w}
        height={size.h}
        fontSize={18}
        fill={foreground ?? CANVAS_COLORS.WIDGET.TEXT}
        text={text ?? props.data}
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