interface ObjectComponentProps {
  structure: ObjectStructure;
  structureMapper: StructureMappers;
  render: (struct: BaseStructure, renderMap: StructureMappers) => JSX.Element;
}


function getObjectFieldMapperValue(obj: ObjectStructure, mapperValue: FieldMapperValue): BaseStructure {
  const parts: string[] = mapperValue.path.split(".");
  let current: any = obj.data;
  for (let i = 0; i < parts.length; i++) {
    current = current[parts[i] as keyof BaseStructure];
  }
  if (current === undefined) {
    return {
      "type": "string",
      "value": "Null"
    } as StringStructure;
  }
  return current as BaseStructure;
}


function getMapperValue(data: ObjectStructure, mapperValue: BaseMapperValue): BaseStructure {
  switch (mapperValue.type) {
    case "field":
      return getObjectFieldMapperValue(data, mapperValue as FieldMapperValue);
    case "number":
      return {
        type: "number",
        value: (mapperValue as NumberMapperValue).value
      } as NumberStructure;
    case "string":
      return {
        type: "string",
        value: (mapperValue as StringMapperValue).value
      } as StringStructure;
    case "null":
        return {
          type: "string",
          value: "Null"
        } as StringStructure;
    default:
      return {
        "type": "string",
        "value": "Unknown"
      } as StringStructure;
  };
}


function mapObject(object: ObjectStructure, mapper: BaseStructureMapper, _structureMapper: StructureMappers): BaseStructure {
  switch (mapper.type) {
    case "array":
      const arrayMapper = mapper as ArrayStructureMapper;
      return {
        type: "array",
        data: arrayMapper.items.map(item => getMapperValue(object, item))
      } as ArrayStructure;
    default:
      return {
        "type": "string",
        "value": "Unknown"
      } as StringStructure;
  };
}



function ObjectComponent(props: ObjectComponentProps) {
  const mapper = props.structureMapper[props.structure.subtype];
  if (mapper === undefined) {
    return (
      <div>
        <p>Unknown object type</p>
      </div>
    );
  }
  const mappedData = mapObject(props.structure, mapper, props.structureMapper);
  const renderedData = props.render(mappedData, props.structureMapper);
  return (
    <>
      {renderedData}
    </>
  );
}

export default ObjectComponent;