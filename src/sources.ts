import { getStringValue } from "./components/canvas/StringWidget";
import getByPath from "./structures/path_ref";
import { BaseStructure, NumberStructure, StringStructure } from "./structures/types";


export type RepresentationStyle = {
  margin?: number;
  spacing?: number;
};

export type Representation = {
  type: string;
  style?: RepresentationStyle;
};

export type Source = {
  type: string;
}

export type RefSource = {
  type: "ref";
  path: string;
} & Source;

export type StringSource = {
  type: "string";
  format: string;
} & Source;

export type NumberSource = {
  value: number;
  type: "number";
} & Source;


export const getStructureFromSource = (base_structure: BaseStructure, source: Source): BaseStructure => {
  if (source === undefined || source.type === undefined) {
    console.error("Can't get structure from source", source);
    return {
      "type": "string",
      "value": "Unknown",
    } as StringStructure;
  }
  switch (source.type) {
    case "ref":
      const ref_source = source as RefSource;
      return getByPath(base_structure, ref_source.path);
    case "string":
      const str_source = source as StringSource;
      if (str_source?.format === undefined) {
        console.error("Can't get string value", base_structure, source);
        return {
          "type": "string",
          "value": "Unknown",
        } as StringStructure;
      }
      const value = getStringValue(base_structure, str_source.format);
      return {
        "type": "string",
        "value": value,
      } as StringStructure;
    case "number":
      return {
        "type": "number",
        "value": (source as NumberSource).value,
      } as NumberStructure;
    default:
      console.error("Unknown source type", source);
      return {
        "type": "string",
        "value": "Unknown",
      } as StringStructure;
  }
}
