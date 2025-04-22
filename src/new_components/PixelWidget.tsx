import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { Rect } from "react-konva";
import { useShallow } from 'zustand/react/shallow';
import { CANVAS_COLORS } from "@/lib/colors";

type PixelWidgetData = {
  size: number | null,
  width: number | null,
  height: number | null,
  color: string,
}
const WIDGET_ID = "pixel";

const getSize = (
  data: PixelWidgetData,
) => {
  return {
    w: data.size ?? data.width ?? 100,
    h: data.size ?? data.height ?? 100,
  };
}

function Widget(props: {
  container_id: string,
  position: Position,
  id: string,
  data: PixelWidgetData,
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
        stroke={CANVAS_COLORS.WIDGET.STROKE}
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