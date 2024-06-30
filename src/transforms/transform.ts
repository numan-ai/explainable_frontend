import { produce } from "immer";


type DisplayConfig = {
  data_type: string;
  params: any;
}


let displayConfig: any = {};


export function setDisplayConfig(config: any) {
  displayConfig = config;
}

function transformObject(structure: ObjectStructure) {
  const config = displayConfig[structure.subtype] as DisplayConfig;
  if (config === undefined) {
    return {
      "type": "string",
      "value": "Unknown"
    } as StringStructure;
  }
  if (config.data_type === "array") {
    const data = [];
    const value_defs = config.params.items;
    for (let value_def of value_defs) {
      if (value_def.type === "constant") {
        data.push({
          "type": "string",
          "value": value_def.value
        } as StringStructure);
      } else if (value_def.type === "field") {
        data.push(structure.data[value_def.name]);
      } else {
        console.error("Unknown value def type", value_def);
      }
    }
    return transform({
      "type": "array",
      "struct_id": structure.struct_id,
      "data": data
    } as ArrayStructure);
  }

  return {
    "type": "string",
    "value": "Unknown"
  } as StringStructure;
}

function transformArray(structure: ArrayStructure) {
  structure.data = structure.data.map(item => {
    return transform(item);
  });
  return structure;
}

function transformMap(structure: MapStructure) {
  return structure;
}

function transformNull(_structure: NullStructure) {
  return {
    type: "string",
    value: "Null",
  } as StringStructure;
}

export default function transform(structure: BaseStructure): BaseStructure {
  return produce(structure, draft => {
    if (draft.type === "object") {
      return transformObject(draft as ObjectStructure);
    }
    if (draft.type === "array") {
      return transformArray(draft as ArrayStructure);
    }
    if (draft.type === "map") {
      return transformMap(draft as MapStructure);
    }
    if (draft.type === "null") {
      return transformNull(draft as NullStructure);
    }
  });
}