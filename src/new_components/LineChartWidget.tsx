import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { Position } from "@/structures/types";
import { Line, Rect, Text } from "react-konva";
import { useShallow } from 'zustand/react/shallow';

type LineChartWidgetData = {
  width: number | null,
  height: number | null,
  lineColor: string | null,
  backgroundColor: string | null,
  data: number[],
  min: number | null,
  max: number | null,
}
const WIDGET_ID = "linechart";

const getSize = (
  data: LineChartWidgetData,
) => {
  return {
    w: data.width ?? 100,
    h: data.height ?? 100,
  };
}

function Widget(props: {
  container_id: string,
  position: Position,
  id: string,
  data: LineChartWidgetData,
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
    console.error("Can't get size of line chart widget");
    return <></>;
  }

  const min = props.data.min ?? Math.min(...props.data.data) ?? 0;
  const max = props.data.max ?? Math.max(...props.data.data) ?? 100;
  const points = props.data.data.map((x, i) => [i / props.data.data.length * (size.w - 10), (size.h - 10) - (x - min) / ((max - min) || 1) * (size.h - 10)]);
  // replace NaN with 0
  points.forEach((point, i) => {
    if (isNaN(point[0]) || isNaN(point[1])) {
      points[i] = [0, 0];
    }
  });

  return (
    <>
      <Rect
        x={currentPosition.x + props.position.x}
        y={currentPosition.y + props.position.y}
        width={size.w}
        height={size.h}
        stroke="rgb(30, 41, 59)"
        fill={props.data.backgroundColor ?? "rgb(42, 58, 84)"}
        strokeWidth={1}
        listening={false}
      />
      <Line
        x={currentPosition.x + props.position.x + 10}
        y={currentPosition.y + props.position.y + 2}
        points={points.flat()}
        stroke="red"
      />
      <Text
        x={currentPosition.x + props.position.x + 5}
        y={currentPosition.y + props.position.y + 8}
        width={size.w}
        height={18}
        fontSize={18}
        fill="lightgray"
        text={max.toFixed(2)}
        verticalAlign="middle"
        listening={false}
      />
      <Text
        x={currentPosition.x + props.position.x + 5}
        y={currentPosition.y + props.position.y + size.h - 18 - 5}
        width={size.w}
        height={18}
        fontSize={18}
        fill="lightgray"
        text={min.toFixed(2)}
        verticalAlign="middle"
        listening={false}
      />
      <Text
        x={currentPosition.x + props.position.x - 5}
        y={currentPosition.y + props.position.y + size.h - 18 - 5}
        width={size.w}
        height={18}
        fontSize={18}
        fill="lightgray"
        text={(props.data.data[props.data.data.length - 1] ?? NaN).toFixed(2)}
        align="right"
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