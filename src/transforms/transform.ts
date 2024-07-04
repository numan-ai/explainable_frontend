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
    for (let i = 0; i < value_defs.length; i++) {
      const value_def = value_defs[i];
      if (value_def.type === "constant") {
        data.push({
          "type": "string",
          "value": value_def.value,
          "struct_id": `${structure.struct_id}.data._virt_${i}`,
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
  // try {
    structure.data = structure.data.map(item => {
      return transform(item);
    });
  // } catch (e) {
  //   console.log('err', structure);
  //   return null;
  // }
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
  if (structure === undefined) {
    console.error("Object is undefinied", structure);
    return {
      type: "string",
      value: "Undef"
    } as StringStructure;
  }
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
  if (structure.type === undefined) {
    console.error("Object is undefinied", structure);
    console.error("Object does not have type", structure);
    return {
      type: "string",
      value: "No type"
    } as StringStructure;
  }
  return structure;
}