import { KonvaEventObject } from 'konva/lib/Node';
import { Ref, useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';


type WhiteBoardProps = {
  children: any;
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
  const [scale, setScale] = useState(1);

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

  const dragStageStart = (e: KonvaEventObject<MouseEvent>) => {
    dragStart.current = {
      x: e.evt.layerX,
      y: e.evt.layerY,
      initX: stagePosition.x,
      initY: stagePosition.y,
    };
  }

  const dragStageMove = (e: KonvaEventObject<MouseEvent>) => {
    if (dragStart.current) {
      const x = (e.evt.layerX - dragStart.current.x) / scale;
      const y = (e.evt.layerY - dragStart.current.y) / scale;
      setStagePosition({ x: dragStart.current.initX - x, y: dragStart.current.initY - y });
    }
  }

  const dragStageEnd = (_: KonvaEventObject<MouseEvent>) => {
    dragStart.current = null;
  }

  const onZoom = (e: KonvaEventObject<WheelEvent>) => {
    const minScale = 0.2;
    const maxScale = 3;
    setScale(oldScale => {
      const scale = Math.min(Math.max(oldScale - e.evt.deltaY / 300, minScale), maxScale);

      // if (oldScale !== scale) {
      //   console.log(scale);
      //   setStagePosition(sp => {
      //     return {
      //       x: sp.x - e.evt.deltaY / scale * 1,
      //       y: sp.y - e.evt.deltaY / scale * 1,
      //     }
      //   });
      // }
      
      return scale;
    });
    e.evt.preventDefault();
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
