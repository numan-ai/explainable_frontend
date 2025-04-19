import { ViewType } from "@/storages/viewStorage";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import EdgeWidget from "./EdgeWidget";
import MovableContainer from "./MovableContainer";
import { getWidget } from "./registry";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import ClickableExclusiveEdgeWidget from "./ClickableExclusiveEdgeWidget";


let NODES_INITIALIZED = 0;


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
      // console.error("Can't find positions", edge);
      continue;
    }
    const startPos = widgetStates.get(edge.node_start_id)!.position;
    const endPos = widgetStates.get(edge.node_end_id)!.position;
    if (!startPos || !endPos) {
      console.error("Can't find positions", edge, startPos, endPos);
      continue;
    }
    if (edge.widget === "clickable_exclusive_edge") {
      widgets.push(<ClickableExclusiveEdgeWidget
        start={startPos}
        end={endPos}
        {...edge}
      />);
    } else {
    widgets.push(<EdgeWidget 
      start={startPos}
        end={endPos}
        key={edge.edge_id} 
        {...edge}
      />);
    }
  }

  return widgets;
}


export default function render(view: ViewType) {
  const [
    states,
    setPosition,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states,
    s.setPosition,
  ]));

  if (!view.structure) {
    console.error("Can't render structure", view.structure);
    return null;
  }

  // Ensure positions are set in a side effect
  useEffect(() => {
    view.structure.nodes.forEach((node) => {
      if (!states.get(node.object_id) || !states.get(node.object_id)?.position) {
        setPosition(node.object_id, {
          x: node.default_x,
          y: node.default_y,
        });
        NODES_INITIALIZED++;
        if (NODES_INITIALIZED === 1000 && NODES_INITIALIZED % 500 === 0) {
          toast("More than 1,000 nodes have been created");
        }
      }
    });
  }, [view.structure.nodes.map(x => x.object_id), setPosition]);

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
      container_id: node.object_id,
      id: node.object_id,
      position: {
        x: 0,
        y: 0,
      },
      data: node.data,
      is_draggable: node.is_draggable ?? true,
    })

    widgets.push((
      <MovableContainer
        key={node.object_id}
        id={node.object_id}
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
