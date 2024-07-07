import { Representation } from "@/sources";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import getSize, { Size } from "@/structures/size";
import { BaseStructure } from "@/structures/types";
import { scaleValues } from "@/WhiteBoard";
import { Arrow, Rect } from "react-konva";
import { useShallow } from 'zustand/react/shallow';
import render from "./render";



export const getMovableContainerSize = (
  item: BaseStructure,
  item_representation: Representation | null,
) => {
  const itemSize = getSize(item, item_representation);
  if (itemSize === undefined) {
    console.error("Can't get size of item", item, item_representation);
    return undefined;
  }
  return itemSize;
}


function MovableContainer(props: {
  item: BaseStructure,
  margin: number,
  arrow_start_box: {
    position: Position,
    size: Size,
  } | null,
  item_representation: Representation | null,
  position: Position,
  id: string,
}) {
  const [
    widgetState,
    setDragStart,
    setPosition,
  ] = useWidgetStateStorage(useShallow((s) => [
    s.states[props.id],
    s.setDragStart,
    s.setPosition,
  ]));

  // const widgetStateRef = useRef(useWidgetStateStorage.getState().states[props.id]);
  // // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  // useEffect(() => useWidgetStateStorage.subscribe(
  //   state => (widgetStateRef.current = state.states[props.id]),
  // ), []);

  // const widgetState = widgetStateRef.current;

  // const widgetState = null;
  // , (old, new_) => {
  //   return (
  //     (old[0]?.position === new_[0]?.position) &&
  //     (old[0]?.dragStart === new_[0]?.dragStart)
  //   );
  // }

  // const lastDrag = useRef<number>(Date.now());
  // const [currentPosition, setPos] = useState(widgetState?.position || props.position);
  // const [dragStart, _setDragStart] = useState(widgetState?.dragStart || null);

  const _setDragStart = (dragStart: any) => {
    setDragStart(props.id, dragStart);
  }
  const currentPosition = widgetState?.position || props.position;
  const dragStart = widgetState?.dragStart || null;

  // const storeRef = useRef<WidgetState>();
  // if (!storeRef.current) {
  //   storeRef.current = useWidgetStateStorage((s) => useShallow(s.states[props.id]));
  // }

  const item = props.item;
  const item_representation = props.item_representation;
  const size = getMovableContainerSize(item, item_representation);
  if (size === undefined) {
    console.error("Can't get size of list item", item, item_representation);
    return <></>;
  }

  const item_position = {
    x: currentPosition.x + props.margin,
    y: currentPosition.y + props.margin,
  }
  const comp = render(item, item_representation, item_position, props.id, 0);

  const arrow_start_box = props.arrow_start_box;
  let arrow_comp = null;
  if (arrow_start_box !== null) {
    const left_start_x = arrow_start_box.position.x;
    const right_start_x = arrow_start_box.position.x + arrow_start_box.size.w;
    const right_end_x = currentPosition.x;

    let arrow_start_x = right_start_x;
    let arrow_end_x = currentPosition.x;
    if (left_start_x > right_end_x) {
      arrow_end_x += size.w + props.margin * 2;
      arrow_start_x -= arrow_start_box.size.w;
    }

    arrow_comp = (
      <Arrow
        points={[
          arrow_start_x,
          arrow_start_box.position.y + arrow_start_box.size.h / 2,
          arrow_end_x,
          currentPosition.y + size.h / 2 + props.margin,
        ]}
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
      />
    );
  }

  return (
    <>
      <Rect
        x={currentPosition.x}
        y={currentPosition.y}
        width={size.w + 10}
        height={size.h + 10}
        stroke="rgb(30, 41, 59)"
        strokeWidth={1}
        onMouseDown={(evt) => {
          if (evt.evt.shiftKey) {
            return;
          }
          _setDragStart({
            layerX: evt.evt.layerX,
            layerY: evt.evt.layerY,
            x: currentPosition.x,
            y: currentPosition.y,
          });
          evt.cancelBubble = true;
        }}
        onMouseMove={(evt) => {
          if (evt.evt.shiftKey) {
            return;
          }
          if (!dragStart) {
            return;
          }
          // if ((Date.now() - lastDrag.current) < 20) {
          //   return;
          // }
          // lastDrag.current = Date.now();

          const view_scale = scaleValues.get(props.id.split(".")[0]) || 1;
          const dx = (evt.evt.layerX - (dragStart?.layerX || 0)) / view_scale;
          const dy = (evt.evt.layerY - (dragStart?.layerY || 0)) / view_scale;
          const newPos = {
            x: (dragStart?.x || 0) + dx,
            y: (dragStart?.y || 0) + dy,
          };
          // setTimeout(() => {
            setPosition(props.id, newPos);
          // }, 10);

          // setPos(newPos);
          evt.cancelBubble = true;
        }}
        onMouseUp={(evt) => {
          if (evt.evt.shiftKey) {
            return;
          }
          _setDragStart(null);
        }}
        onMouseLeave={() => {
          _setDragStart(null);
        }}
      />
      {comp}
      {arrow_comp}
    </>
  );
}

export default MovableContainer;