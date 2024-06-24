import StringStructure from "../structures/StringStructure";
import { getBaseStyles } from "./BaseComponent";

interface StringComponentProps {
  structure: StringStructure;
}


function StringComponent(props: StringComponentProps) {
  const style = getBaseStyles(props.structure);
  return <div className="component string-component" style={style}>
    {props.structure.value}
  </div>;
}

export default StringComponent;