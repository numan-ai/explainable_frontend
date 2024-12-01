import { Position } from "@/structures/types";
import { Line } from "react-konva";


export default function NumberComponent(props: {
  start: Position;
  end: Position;
}) {
  return (
    <>
      <Line
        points={[props.start.x + 150, props.start.y + 45, props.end.x + 150, props.end.y + 45]}
        stroke="rgb(240, 240, 240)"
        strokeWidth={2}
        listening={false}
      />
    </>
  );
}
