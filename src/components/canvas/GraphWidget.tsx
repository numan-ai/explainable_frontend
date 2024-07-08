import { getStructureFromSource, Representation, Source } from "@/sources";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import getSize, { type Size } from "@/structures/size";
import { BaseStructure, ListStructure, StringStructure } from "@/structures/types";
import React from "react";
import { Group, Line } from "react-konva";
import { Widget } from "../registry";
import { WidgetProps } from "../widget";
import MovableContainer from "./MovableContainer";

const WIDGET_TYPE = "graph";


export type GraphCanvasRepresentation = {
  type: "graph";
  nodes: {
    id: Source;
    source: Source | Source[];
    widget?: Representation | Representation[];
  }
  edges: {
    source: Source | Source[];
    label: Source;
    start: Source;
    end: Source;
  }
} & Representation;


const getDefaultRepresentation = (_: BaseStructure): GraphCanvasRepresentation => {
  return {
    type: WIDGET_TYPE,
    nodes: {
      id: {
        type: "ref",
        path: "item",
      } as Source,
      source: {
        type: "ref",
        path: "item.nodes",
      } as Source,
    },
    edges: {
      source: {
        type: "ref",
        path: "item.edges",
      } as Source,
      label: {
        type: "ref",
        path: "item.label",
      } as Source,
      start: {
        type: "ref",
        path: "item.start",
      } as Source,
      end: {
        type: "ref",
        path: "item.end",
      } as Source,
    }
  } as GraphCanvasRepresentation;
}


const getGraphSize = (
  _: BaseStructure,
  __: GraphCanvasRepresentation | null,
) => {
  return {
    w: 0,
    h: 0,
  } as Size;
}


function GraphCanvasComponent(props: WidgetProps) {
  const { position } = props;

  const [widgetStates] = useWidgetStateStorage((s) => [
    s.states,
  ]);

  let representation: GraphCanvasRepresentation | null = props.representation as GraphCanvasRepresentation;

  if (!representation) {
    representation = getDefaultRepresentation(props.structure);
  }

  if (position === undefined || representation === undefined) {
    return <></>;
  }

  let node_structures: BaseStructure[];
  if (Array.isArray(representation.nodes.source)) {
    node_structures = representation.nodes.source.map(source => getStructureFromSource(props.structure, source))
  } else {
    node_structures = (getStructureFromSource(props.structure, representation.nodes.source) as ListStructure).data;
  }

  const style = representation.style || {};

  let collectedX = representation.style?.margin || 5;

  const node_positions = new Map<string, Position>();
  const node_sizes = new Map<string, Size>();

  const children = node_structures.map((node, i) => {
    const node_representation = Array.isArray(representation.nodes.widget) ? (
      representation.nodes.widget[i]
    ) : (
      representation.nodes.widget
    ) || null;

    const compSize = getSize(node, node_representation);
    if (compSize === undefined) {
      console.error("Can't get size of list item", node, node_representation);
      return undefined;
    }

    const item_position = {
      x: position.x + collectedX,
      y: position.y + (style.margin || 5),
    } as Position;
    collectedX += compSize.w + (style.spacing || 5) * 3;

    const widgeId = `${props.id}.nodes.${i}`;

    const value_comp = React.createElement(MovableContainer, {
      item: node,
      margin: 5,
      arrow_start_box: null,
      item_representation: node_representation,
      position: item_position,
      id: widgeId,
    });

    const node_id = getStructureFromSource(node, representation.nodes.id) as StringStructure;
    if (node_id === undefined) {
      console.error("Can't get node id", node, representation.nodes.id);
      return undefined;
    }

    const nodePos = widgetStates[widgeId]?.position || item_position;

    node_positions.set(node_id.value, nodePos);
    node_sizes.set(node_id.value, compSize);

    return (
      <Group
        key={i}
      >
        {value_comp}
      </Group>
    )
  });

  let edge_structures: BaseStructure[];
  if (Array.isArray(representation.edges.source)) {
    edge_structures = representation.edges.source.map(source => getStructureFromSource(props.structure, source))
  } else {
    edge_structures = (getStructureFromSource(props.structure, representation.edges.source) as ListStructure).data;
  }

  const edges: JSX.Element[] = [];

  edge_structures.forEach((edge_struct, i) => {
    const start_id = getStructureFromSource(edge_struct, representation.edges.start) as StringStructure;
    const end_id = getStructureFromSource(edge_struct, representation.edges.end) as StringStructure;

    if (start_id === undefined || end_id === undefined) {
      console.error("Can't get edge start or end id", edge_struct, representation.edges.start, representation.edges.end);
      return undefined;
    }

    const startSize = node_sizes.get(start_id.value);
    const endSize = node_sizes.get(end_id.value);

    const start = {
      x: (node_positions.get(start_id.value)?.x || 0) + (startSize?.w || 0) / 2,
      y: (node_positions.get(start_id.value)?.y || 0) + (startSize?.h || 0) / 2,
    }

    const end = {
      x: (node_positions.get(end_id.value)?.x || 0) + (endSize?.w || 0) / 2,
      y: (node_positions.get(end_id.value)?.y || 0) + (endSize?.h || 0) / 2,
    }

    edges.push(
      <Line
        points={[start.x, start.y, end.x, end.y]}
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
        key={i}
      />
    );
  });

  return (
    <>
      {edges}
      {children}
    </>
  );
}


export default {
  id: WIDGET_TYPE,
  component: GraphCanvasComponent,
  sizeGetter: getGraphSize,
} as Widget;