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
  if (structure.type === "object") {
    return transformObject(structure as ObjectStructure);
  }
  if (structure.type === "array") {
    return transformArray(structure as ArrayStructure);
  }
  if (structure.type === "map") {
    return transformMap(structure as MapStructure);
  }
  if (structure.type === "null") {
    return transformNull(structure as NullStructure);
  }
  return structure;
}