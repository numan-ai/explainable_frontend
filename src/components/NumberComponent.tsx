import NumberStructure from "../structures/NumberStructure";
import { getBaseStyles } from "./BaseComponent";

interface NumberComponentProps {
  structure: NumberStructure;
}


function NumberComponent(props: NumberComponentProps) {
  const style = getBaseStyles(props.structure);
  return (
    <div className="component number-component" style={style}>
      {props.structure.value}
    </div>
  );
}

export default NumberComponent;
