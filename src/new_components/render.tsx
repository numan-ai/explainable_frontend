import { ViewType } from "@/storages/viewStorage";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import EdgeWidget from "./EdgeWidget";
import MovableContainer from "./MovableContainer";
import { getWidget } from "./registry";
import React from "react";


function renderEdges(view: ViewType) {
  const widgets = [];

  const [
    widgetStates,
  ] = useWidgetStateStorage((s) => [
    s.states,
  ]);

  for (let i = 0; i < view.structure.edges.length; i++) {
    const edge = view.structure.edges[i];
    if (!widgetStates.get(edge.node_start_id) || !widgetStates.get(edge.node_end_id)) {
      continue;
    }
    const startPos = widgetStates.get(edge.node_start_id)!.position;
    const endPos = widgetStates.get(edge.node_end_id)!.position;
    if (!startPos || !endPos) {
      console.error("Can't find positions", edge, startPos, endPos);
      continue;
    }
    widgets.push(<EdgeWidget 
      start={startPos}
      end={endPos}
      key={edge.edge_id} 
      {...edge}
    />);
  }

  return widgets;
}


export default function render(view: ViewType) {
  if (!view.structure) {
    console.error("Can't render structure", view.structure);
    return null;
  }

  // const node_positions = new Map<string, Position>();
  const widgets = [];
  for (let i = 0; i < view.structure.nodes.length; i++) {
    const node = view.structure.nodes[i];

    const widget = getWidget(node.widget);

    if (!widget) {
      console.error("Can't find widget", node.widget);
      continue;
    }

    const elt = React.createElement(widget, {
      container_id: node.node_id,
      id: node.node_id,
      position: {
        x: 0,
        y: 0,
      },
      data: node.data,
    })

    widgets.push((
      <MovableContainer
        key={node.node_id}
        id={node.node_id}
        defaultPosition={{
          x: node.default_x,
          y: node.default_y,
        }}
        widget={node.widget}
        data={node.data}
      >
        {elt}
      </MovableContainer>
    ));
  }
  const edges = renderEdges(view);
  return (
    <>
      {edges}
      {widgets}
    </>
  );
}
