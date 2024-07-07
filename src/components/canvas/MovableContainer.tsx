import { Representation } from "@/sources";
import getSize, { Size } from "@/structures/size";
import { BaseStructure } from "@/structures/types";
import { Arrow, Rect } from "react-konva";
import render from "./render";
import { useWidgetStateStorage } from "@/storages/widgetStateStorage";
import { useViewStore } from "@/storages/viewStorage";


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
  ] = useWidgetStateStorage((s) => [
    s.states[props.id],
    s.setDragStart,
    s.setPosition,
  ]);

  const [view] = useViewStore((s) => [s.views.find(view => view.id === props.id.split(".")[0])]);

  const { position } = props;
  const item = props.item;
  const item_representation = props.item_representation;
  const size = getMovableContainerSize(item, item_representation);
  if (size === undefined) {
    console.error("Can't get size of list item", item, item_representation);
    return <></>;
  }
  const currentPosition = widgetState?.position || position;
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
          setDragStart(props.id, {
            layerX: evt.evt.layerX,
            layerY: evt.evt.layerY,
            x: currentPosition.x,
            y: currentPosition.y,
          });
          evt.cancelBubble = true;
        }}
        onMouseMove={(evt) => {
          if (!widgetState?.dragStart) {
            return;
          }
          const dx = (evt.evt.layerX - (widgetState?.dragStart.layerX || 0)) / (view?.scale || 1);
          const dy = (evt.evt.layerY - (widgetState?.dragStart.layerY || 0)) / (view?.scale || 1);
          setPosition(props.id, {
            x: widgetState?.dragStart.x + dx,
            y: widgetState?.dragStart.y + dy,
          });
          evt.cancelBubble = true;
        }}
        onMouseUp={(_) => {
          setDragStart(props.id, null);
        }}
        onMouseLeave={() => {
          setDragStart(props.id, null);
        }}
      />
      {comp}
      {arrow_comp}
    </>
  );
}

export default MovableContainer;