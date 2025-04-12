import { KonvaEventObject } from 'konva/lib/Node';
import { Ref, useEffect, useRef, useState, ReactNode } from 'react';
import { Layer, Stage } from 'react-konva';
import { useWidgetStateStorage } from './storages/widgetStateStorage';
import stepMinimizeEdgeLength from './graphForce';
import { ViewType } from './storages/viewStorage';
import { Position } from './structures/types';
import { useViewLayoutStore, DEFAULT_SCALE } from './storages/viewLayoutStore';

type WhiteBoardProps = {
  children: ReactNode;
  view: ViewType;
}

export const scaleValues = new Map<string, number>();

function WhiteBoard(props: WhiteBoardProps) {
  const divRef: Ref<HTMLDivElement> = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const [
    widgetStates,
    tempStates,
    setDragStart,
    setPosition,
    setPositionBulk,
  ] = useWidgetStateStorage((s) => [
    s.states,
    s.tempStates,
    s.setDragStart,
    s.setPosition,
    s.setPositionBulk,
  ]);

  const [getScale, setScale, getPosition, setStagePos] = useViewLayoutStore((s) => [
    s.getScale,
    s.setScale,
    s.getPosition,
    s.setPosition,
  ]);
  
  const scale = getScale(props.view.id);
  const stagePosition = getPosition(props.view.id);

  const dragStart = useRef<{ 
    x: number, 
    y: number,
    initX: number,
    initY: number,
  } | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        console.log('New width:', entry.contentRect.width);
        console.log('New height:', entry.contentRect.height);
        setDimensions({
          width: entry.contentRect.width - 2,
          height: entry.contentRect.height
        });
      }
    });

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const oldPositions = new Map<string, Position>();
      for (const [key, value] of Object.entries(widgetStates)) {
        oldPositions.set(key, value.position);
      }
      const newPositions = stepMinimizeEdgeLength(
        props.view.structure.nodes,
        props.view.structure.edges,
        oldPositions,
      );
      setPositionBulk(newPositions);
    }, 40);
  }, [widgetStates, props.view.structure]);

  const dragStageStart = (evt: KonvaEventObject<MouseEvent>) => {
    if (evt.target !== evt.currentTarget && !!evt.target.attrs.meta.id) {
      const node_id = evt.target.attrs.meta.id;
      setDraggingNodeId(node_id);
      setDragStart(node_id, {
        layerX: evt.evt.layerX,
        layerY: evt.evt.layerY,
        x: evt.target.attrs.x,
        y: evt.target.attrs.y,
      });
      return;
    }
    dragStart.current = {
      x: evt.evt.layerX,
      y: evt.evt.layerY,
      initX: stagePosition.x,
      initY: stagePosition.y,
    };
  }

  const dragStageMove = (evt: KonvaEventObject<MouseEvent>) => {
    if (draggingNodeId !== null) {
      const nodeDragStart = tempStates[draggingNodeId]?.dragStart;
      const view_scale = getScale(props.view.id);
      const dx = (evt.evt.layerX - (nodeDragStart?.layerX || 0)) / view_scale;
      const dy = (evt.evt.layerY - (nodeDragStart?.layerY || 0)) / view_scale;
      const newPos = {
        x: (nodeDragStart?.x || 0) + dx,
        y: (nodeDragStart?.y || 0) + dy,
      };
      setPosition(draggingNodeId, newPos);
      return;
    }
    evt.cancelBubble = true;
    if (dragStart.current) {
      const x = (evt.evt.layerX - dragStart.current.x) / scale;
      const y = (evt.evt.layerY - dragStart.current.y) / scale;
      setStagePos(props.view.id, { 
        x: dragStart.current.initX - x, 
        y: dragStart.current.initY - y 
      });
    }
  }

  const dragStageEnd = (evt: KonvaEventObject<MouseEvent>) => {
    if (draggingNodeId !== null) {
      setDraggingNodeId(null);
      return;
    }
    dragStart.current = null;
    evt.cancelBubble = true;
  }

  const onZoom = (evt: KonvaEventObject<WheelEvent>) => {
    const minScale = 0.05;
    const maxScale = 3;
    evt.cancelBubble = true;
    const newScale = Math.min(Math.max((scale || DEFAULT_SCALE) - evt.evt.deltaY / 500 * scale, minScale), maxScale);
    setScale(props.view.id, newScale);

    const [pastX, pastY] = [evt.evt.layerX/scale + stagePosition.x, evt.evt.layerY/scale + stagePosition.y];
    const [newX, newY] = [evt.evt.layerX/newScale + stagePosition.x, evt.evt.layerY/newScale + stagePosition.y];

    setStagePos(props.view.id, {
      x: stagePosition.x + (pastX - newX), 
      y: stagePosition.y + (pastY - newY)
    });

    evt.evt.preventDefault();
  }

  return (
    <div className="w-full h-full min-h-[500px] border border-solid" ref={divRef}>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={dragStageStart}
        onMouseMove={dragStageMove}
        onMouseUp={dragStageEnd}
        onWheel={onZoom}
        onMouseLeave={dragStageEnd}
        offset={stagePosition}
        scale={{
          x: scale,
          y: scale,
        }}
      >
        <Layer>
          {props.children}
        </Layer>
      </Stage>
    </div>
  )
}

export default WhiteBoard
