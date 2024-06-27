import { produce } from "immer";

function transformObject(structure: ObjectStructure) {
  const new_structure = {
    "type": "array",
    "struct_id": structure.struct_id,
    "data": [
      structure.data.name,
      structure.data.age,
      structure.data.parent,
    ]
  }

  return transform(new_structure);
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