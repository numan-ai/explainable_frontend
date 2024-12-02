import { Position } from "@/structures/types";
import { Line, Text } from "react-konva";

function fancy_left_right(x1: number, y1: number, x2: number, y2: number, W: number, _: number){
  return [
    x1 + W*(x2-x1)/Math.abs(x2-x1),
    y1 + W*(y2-y1)/Math.abs(x2-x1),
  ];
}

function fancy_top_bottom(x1: number, y1: number, x2: number, y2: number, _: number, H: number){
  return [
    x1 + H*(x2-x1)/Math.abs(y2-y1),
    y1 + H*(y2-y1)/Math.abs(y2-y1),
  ];
}

function simple_left_right(x1: number, y1: number, x2: number, _: number, W: number, _2: number){
  return [
    x1 + W*(x2-x1)/Math.abs(x2-x1),
    y1,
  ];
}

function simple_top_bottom(x1: number, y1: number, _: number, y2: number, _2: number, H: number){
  return [
    x1,
    y1 + H*(y2-y1)/Math.abs(y2-y1)
  ]
}

export default function EdgeWidget(props: {
  start: Position;
  end: Position;
  data: any;
}) {

  // We need to change this to their actual dimensions
  let W1 = 155;
  let H1 = 100;
  
  let W2 = 155;
  let H2 = 100;

  // We get the centers of the elements
  let x1 = props.start.x + W1;
  let y1 = props.start.y + H1;

  let x2 = props.end.x + W2;
  let y2 = props.end.y + H2;

  let c1 = Math.abs((y2 - y1)/(x2 - x1)) < H1/W1;
  let c2 = Math.abs((y2 - y1)/(x2 - x1)) < H2/W2;

  let p1: number[] = [0,0];
  let p2: number[] = [0,0];

  // Then we pick a style, I made simple and fancy so we can pick or merge later, here I choose fancy.

  if (c1) {
    p1 = simple_left_right(x1, y1, x2, y2, W1, H1)
  } else {
    p1 = simple_left_right(x1, y1, x2, y2, W1, H1)
  }

  if (c2) {
    p2 = simple_left_right(x2, y2, x1, y1, W2, H2)
  } else {
    p2 = simple_left_right(x2, y2, x1, y1, W2, H2)
  }

  let text = null;
  if (props.data !== null){
    text = <Text
      x={(p1[0]+p2[0])/2}
      y={(p1[1]+p2[1])/2}
      fontSize={18}
      fill="lightgray"
      text={props.data}
      listening={false}
    />
  }
  return (
    <>
      <Line
        points={[p1[0], p1[1], p2[0], p2[1]]}
        stroke="rgb(240, 240, 240)"  // Should we allow custom color?
        strokeWidth={2}  // And/or custom width?
        listening={false}
      />
      {text}
    </>
  );
}
