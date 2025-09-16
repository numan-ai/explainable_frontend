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

function WhiteBoard(props: WhiteBoardProps) {
  const divRef: Ref<HTMLDivElement> = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [draggedPosition, setDraggedPosition] = useState<Position | null>(null);

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + 0
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        setScale(props.view.id, DEFAULT_SCALE);
        setStagePos(props.view.id, { x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [props.view.id, setScale, setStagePos]);

  const dragStageStart = (evt: KonvaEventObject<MouseEvent>) => {
    if (evt.target !== evt.currentTarget && !!evt.target.attrs?.meta?.id && !evt.evt.shiftKey) {
      if (evt.target.attrs.meta.is_draggable === false) {
        return;
      }
      const node_id = evt.target.attrs.meta.id;

      // Handle alt-click to reset position
      if (evt.evt.altKey) {
        const node = props.view.structure.nodes.find(n => n.object_id === node_id);
        if (node) {
          setPosition(node_id, { x: node.default_x, y: node.default_y });
        }
        return;
      }

      setDraggingNodeId(node_id);
      setDragStart(node_id, {
        layerX: evt.evt.layerX,
        layerY: evt.evt.layerY,
        x: evt.target.attrs.x,
        y: evt.target.attrs.y,
      });
      return;
    }
    // drag scene
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
        x: Math.round((nodeDragStart?.x || 0) + dx),
        y: Math.round((nodeDragStart?.y || 0) + dy),
      };
      setPosition(draggingNodeId, newPos);
      setDraggedPosition(newPos);
      return;
    }
    evt.cancelBubble = true;
    if (dragStart.current) {
      // drag scene
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
      setDraggedPosition(null);
      return;
    }
    // drag scene
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
    <>
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
          <Layer name="top-layer" />
        </Stage>
      </div>
      {draggedPosition && (
        <div 
          style={{
            position: 'fixed',
            top: '74px',
            right: '10px',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            border: '1px solid #2196F3',
            borderRadius: '4px',
            padding: '8px 12px',
            fontFamily: 'monospace',
            color: '#2196F3',
            fontSize: '14px',
            lineHeight: '1.4',
            zIndex: 1000,
          }}
        >
          {draggingNodeId}
          <div>x: {draggedPosition.x}</div>
          <div>y: {draggedPosition.y}</div>
        </div>
      )}
    </>
  )
}

export default WhiteBoard
