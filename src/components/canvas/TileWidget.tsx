import { getStructureFromSource, Representation, Source } from "@/sources";
import getSize, { Size } from "@/structures/size";
import { BaseStructure, NumberStructure, StringStructure } from "@/structures/types";
import { Rect } from "react-konva";
import { Widget } from "../registry";
import { WidgetProps as WidgetComponentProps } from "../widget";
// import getJustUpdatedState from "@/just_updated";


const WIDGET_TYPE = "tile";


export type TileCanvasRepresentation = {
  type: "tile";
  width?: Source;
  height?: Source;
  color?: Source;
};


const getDefaultRepresentation = (_: BaseStructure): TileCanvasRepresentation => {
  return {
    type: WIDGET_TYPE,
    width: {
      type: "number",
      value: 100,
    },
    height: {
      type: "number",
      value: 100,
    },
    color: {
      type: "string",
      format: "#ef233c",
    },
  } as TileCanvasRepresentation;
}


const getTileSize = (
  structure: BaseStructure,
  representation: Representation,
) => {
  let tile_representation = representation as TileCanvasRepresentation;
  if (!tile_representation) {
    tile_representation = getDefaultRepresentation(structure);
  }

  const width = tile_representation.width ? (
    (getStructureFromSource(structure, tile_representation.width) as NumberStructure).value
  ) : 100;
  const height = tile_representation.height ? (
    (getStructureFromSource(structure, tile_representation.height) as NumberStructure).value
  ) : 100;


  return {
    w: width,
    h: height,
  } as Size;
}


function TileCanvasComponent(props: WidgetComponentProps) {
  const { position } = props;
  let representation: TileCanvasRepresentation | null = props.representation as TileCanvasRepresentation;
  
  if (!props.representation) {
    representation = getDefaultRepresentation(props.structure);
  }

  const size = getSize(props.structure, representation);

  const color = representation.color ? (
    (getStructureFromSource(props.structure, representation.color) as StringStructure).value
  ) : (
    "#ef233c"
  );

  // const justUpdatedState = getJustUpdatedState(props.structure, props.id, 0.2);
  const justUpdatedState = 0.0;

  if (size === undefined) {
    console.error("Can't get size of tile", props.structure, representation);
    return <></>;
  }

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={size.w}
        height={size.h}
        stroke={"rgb(20, 20, 20)"}
        strokeWidth={1}
        listening={false}
      />
      <Rect
        x={position.x + 1}
        y={position.y + 1}
        width={Math.max(size.w - 2, 0)}
        height={Math.max(size.h - 2, 0)}
        opacity={1 - justUpdatedState * 0.6}
        fill={color}
        strokeWidth={0}
        listening={false}
      />
    </>
  );
}


export default {
  id: WIDGET_TYPE,
  component: TileCanvasComponent,
  sizeGetter: getTileSize,
} as Widget;