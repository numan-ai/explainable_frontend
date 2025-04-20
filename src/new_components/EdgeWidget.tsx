import { EdgeStructure, NodeStructure, Position } from "@/structures/types";
import { Line, Text } from "react-konva";
import { getWidgetSize } from './registry';
import { getStructureById } from "@/storages/viewStorage";

function simple_left_right(x1: number, y1: number, x2: number, _: number, W: number, _2: number){
  return [
    x1 + W*(x2-x1)/Math.abs(x2-x1),
    y1,
  ];
}
export default function EdgeWidget(props: {
  start: Position;
  end: Position;
} & EdgeStructure) {

  // We need to change this to their actual dimensions
  const struct1: NodeStructure | undefined = getStructureById(props.node_start_id);
  const struct2: NodeStructure | undefined = getStructureById(props.node_end_id);
  if (struct1 === undefined || struct2 === undefined) {
    console.error("Can't find structure for edge", props.node_start_id, props.node_end_id);
    return <></>;
  }
  const size1 = getWidgetSize(struct1.widget, struct1.data);
  const size2 = getWidgetSize(struct2.widget, struct2.data);

  // We get the centers of the elements
  const x1 = props.start.x + size1.w / 2;
  const y1 = props.start.y + size1.h / 2;

  const x2 = props.end.x + size2.w / 2;
  const y2 = props.end.y + size2.h / 2;

  const c1 = Math.abs((y2 - y1)/(x2 - x1)) < size1.h/size1.w;
  const c2 = Math.abs((y2 - y1)/(x2 - x1)) < size2.h/size2.w;

  let p1: number[] = [0,0];
  let p2: number[] = [0,0];

  // Then we pick a style, I made simple and fancy so we can pick or merge later, here I choose fancy.

  if (c1) {
    p1 = simple_left_right(x1, y1, x2, y2, size1.w / 2, size1.h / 2)
  } else {
    p1 = simple_left_right(x1, y1, x2, y2, size1.w / 2, size1.h / 2)
  }

  if (c2) {
    p2 = simple_left_right(x2, y2, x1, y1, size2.w / 2, size2.h / 2)
  } else {
    p2 = simple_left_right(x2, y2, x1, y1, size2.w / 2, size2.h / 2)
  }

  let text = null;
  if (props.data !== null){
    text = <Text
      x={(p1[0]+p2[0])/2 - 15}
      y={(p1[1]+p2[1])/2 - 30}
      fontSize={22}
      fill="lightgray"
      text={props.data}
      listening={false}
      align="center"
      verticalAlign="middle"
    />
  }
  return (
    <>
      <Line
        points={[p1[0], p1[1], p2[0], p2[1]]}
        stroke={props.line_color ?? "rgb(240, 240, 240)"}
        strokeWidth={props.line_width ?? 2}
        listening={false}
      />
      {text}
    </>
  );
}
