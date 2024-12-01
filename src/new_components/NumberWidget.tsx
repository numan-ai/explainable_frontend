import { Position } from "@/structures/types";
import { Rect, Text } from "react-konva";


export default function NumberComponent(props: {
  text: string;
  position: Position;
}) {
  const { position } = props;

  const size = {w: 300, h: 90};
  const justUpdatedState = 0.0;

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        fill={`rgba(30, 41, 59, ${(justUpdatedState * 0.8 + 0.2).toFixed(2)})`}
        stroke={false ? "rgb(30, 41, 59)" : "rgb(20, 20, 20)"}
        strokeWidth={1}
        listening={false}
      />
      <Text
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        fontSize={18}
        fill="lightgray"
        text={props.text}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </>
  );
}
