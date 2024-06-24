import ArrayComponent from "./ArrayComponent"
import MapComponent from "./MapComponent"
import NumberComponent from "./NumberComponent"
import ObjectComponent from "./ObjectComponent"
import StringComponent from "./StringComponent"


function renderNumber(structure: NumberStructure) {
  return <NumberComponent structure={structure} />
}


function renderString(structure: StringStructure) {
  return <StringComponent structure={structure} />
}


function renderArray(structure: ArrayStructure, renderMap: StructureMappers) {
  return (
    <ArrayComponent
      structure={structure}
      renderMap={renderMap}
      render={render}
    />
  );
}


function renderMap(structure: MapStructure, renderMap: StructureMappers) {
  return (
    <MapComponent
      structure={structure}
      renderMap={renderMap} 
      render={render}
    />
  );
}


function renderObject(structure: ObjectStructure, renderMap: StructureMappers) {
  return (
    <ObjectComponent
      structure={structure}
      structureMapper={renderMap}
      render={render}
    />
  );
}


export function getBaseStyles(structure: BaseStructure) {
  const style = {
    "backgroundColor": "#e9c46a00",
    "transition": "background-color 1s linear",
  };
  if (structure.justUpdated === true) {
    style['backgroundColor'] = "#e9c46a77";
    style['transition'] = "background-color 0.01s linear";
  }

  return style;
}


export default function render(structure: BaseStructure, structureMappers: StructureMappers) {
  switch (structure.type) {
    case "number":
      return renderNumber(structure as NumberStructure);
    case "string":
      return renderString(structure as StringStructure);
    case "array":
      return renderArray(structure as ArrayStructure, structureMappers);
    case "map":
      return renderMap(structure as MapStructure, structureMappers);
    case "object":
      return renderObject(structure as ObjectStructure, structureMappers);
      case "null":
        return renderString({
          "type": "string",
          "value": "Null"
        } as StringStructure);
    default:
      return <div>Unknown</div>
  }
}