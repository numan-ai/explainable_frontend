// import BaseStructure from "./structures.tsx/BaseStructure";
// import ObjectStructure from "./structures.tsx/ObjectStructure";


interface BaseMapperValue {
  type: string;
}

interface FieldMapperValue extends BaseMapperValue {
  type: "field";
  path: string;
}

interface NumberMapperValue extends BaseMapperValue {
  type: "number";
  value: number;
}

interface StringMapperValue extends BaseMapperValue {
  type: "string";
  value: string;
}


interface BaseStructureMapper {
  type: string;
}

interface ArrayStructureMapper extends BaseStructureMapper {
  type: string;
  items: BaseMapperValue[];
}


interface StructureMappers {
  [key: string]: BaseStructureMapper;
}
