import { Rect, Text } from "react-konva";
import { getBBox } from "../structures/BBox";

type StringComponentProps = {
  structure: StringStructure,
  position: Position,
};


export default function StringCanvasComponent(props: StringComponentProps) {
  const { structure } = props;
  const bbox = getBBox(props);

  // const [isHovered, setIsHovered] = useState(false);
  // const setIsHovered = (isHovered: boolean) => {
  //   console.log(isHovered);
  // }

  return (
    <>
      <Rect
        x={props.position.x}
        y={props.position.y}
        width={bbox.w}
        height={bbox.h}
        fill="rgba(30, 41, 59, 0.1)"
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
        listening={false}
      />
      <Text
        x={props.position.x}
        y={props.position.y}
        width={bbox.w}
        height={bbox.h}
        fontSize={18}
        fill="lightgray"
        text={structure.value}
        align="center"
        verticalAlign="middle"
        onClick={() => {
          console.log(123);
        }}
        onMouseEnter={() => {
          // setIsHovered(true);
        }}
        onMouseLeave={() => {
          // setIsHovered(false);
        }}
      />
    </>
  );
}