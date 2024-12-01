import { getDataclassRepresentation } from "@/components/canvas/render";
import getWidget from "@/components/registry";
import { Representation } from "@/sources";


const getSize = (structure: BaseStructure, representation: Representation | null) => {
  if (!structure) {
    console.error("Can't get size of structure", structure);
    return undefined;
  }

  if (structure.type === "dataclass") {
    representation = getDataclassRepresentation(structure as DataclassStructure, representation);
  }

  const widget_name = representation?.type || structure.type;
  const registeredComponent = getWidget(widget_name);
  if (registeredComponent === undefined) {
    console.error("Can't find component", widget_name);
    return undefined;
  }
  return registeredComponent.sizeGetter(structure, representation);
}

export default getSize;
