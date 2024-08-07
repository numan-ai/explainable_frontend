import { KonvaEventObject } from 'konva/lib/Node';
import { Ref, useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';


type WhiteBoardProps = {
  children: any;
  // scale: number;
  view_id: string;
  // setScale: (scale: number) => void;
}

const DEFAULT_SCALE = 0.6;

export const scaleValues = new Map<string, number>();


function WhiteBoard(props: WhiteBoardProps) {
  const divRef: Ref<HTMLDivElement> = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [scale, setScale] = useState(scaleValues.get(props.view_id) || DEFAULT_SCALE);

  // const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [stagePosition, setStagePosition] = useState({
    x: 20,
    y: 20,
  });

  let dragStart = useRef<{ 
    x: number, 
    y: number,
    initX: number,
    initY: number,
  } | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
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

  const dragStageStart = (evt: KonvaEventObject<MouseEvent>) => {
    dragStart.current = {
      x: evt.evt.layerX,
      y: evt.evt.layerY,
      initX: stagePosition.x,
      initY: stagePosition.y,
    };
  }

  const dragStageMove = (evt: KonvaEventObject<MouseEvent>) => {
    evt.cancelBubble = true;
    if (dragStart.current) {
      const x = (evt.evt.layerX - dragStart.current.x) / scale;
      const y = (evt.evt.layerY - dragStart.current.y) / scale;
      setStagePosition({ x: dragStart.current.initX - x, y: dragStart.current.initY - y });
    }
  }

  const dragStageEnd = (evt: KonvaEventObject<MouseEvent>) => {
    dragStart.current = null;
    evt.cancelBubble = true;
  }

  const onZoom = (evt: KonvaEventObject<WheelEvent>) => {
    const minScale = 0.05;
    const maxScale = 3;
    evt.cancelBubble = true;
    const newScale = Math.min(Math.max((scale || DEFAULT_SCALE) - evt.evt.deltaY / 500 * scale, minScale), maxScale);
    setScale(newScale);
    scaleValues.set(props.view_id, newScale);

    const [pastX, pastY] = [evt.evt.layerX/scale + stagePosition.x, evt.evt.layerY/scale + stagePosition.y];
    const [newX, newY] = [evt.evt.layerX/newScale + stagePosition.x, evt.evt.layerY/newScale + stagePosition.y];

    setStagePosition({x: stagePosition.x + (pastX - newX), y: stagePosition.y + (pastY - newY)});

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
