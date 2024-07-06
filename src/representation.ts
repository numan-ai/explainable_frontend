import getByPath from "./structures/path_ref";
import { BaseStructure, StringStructure } from "./structures/types";


export type RepresentationStyle = {
  margin?: number;
  spacing?: number;
};

export type Representation = {
  type: string;
  style?: RepresentationStyle;
};


export type StructureSource = {
  type: string;
}

export type StructureSourceReference = {
  type: "reference";
  path: string;
} & StructureSource;


export const getStructureFromSource = (base_structure: BaseStructure, source: StructureSource): BaseStructure => {
  switch (source.type) {
    case "reference":
      const _source = source as StructureSourceReference;
      return getByPath(base_structure, _source.path);
    default:
      return {
        "type": "string",
        "value": "Unknown",
      } as StringStructure;
  }
}
