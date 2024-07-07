import { KonvaEventObject } from 'konva/lib/Node';
import { Ref, useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';


type WhiteBoardProps = {
  children: any;
  scale: number;
  setScale: (scale: number) => void;
}


function WhiteBoard(props: WhiteBoardProps) {
  const divRef: Ref<HTMLDivElement> = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
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
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
      setDimensions({
        width: divRef.current.offsetWidth - 2,
        height: divRef.current.offsetHeight
      });
    }
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
      const x = (evt.evt.layerX - dragStart.current.x) / props.scale;
      const y = (evt.evt.layerY - dragStart.current.y) / props.scale;
      setStagePosition({ x: dragStart.current.initX - x, y: dragStart.current.initY - y });
    }
  }

  const dragStageEnd = (evt: KonvaEventObject<MouseEvent>) => {
    dragStart.current = null;
    evt.cancelBubble = true;
  }

  const onZoom = (evt: KonvaEventObject<WheelEvent>) => {
    const minScale = 0.2;
    const maxScale = 3;
    evt.cancelBubble = true;
    const scale = Math.min(Math.max((props.scale || 1) - evt.evt.deltaY / 300, minScale), maxScale);
    props.setScale(scale);
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
          x: props.scale,
          y: props.scale,
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
