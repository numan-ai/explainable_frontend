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

export type AdditionSource = {
  type: "addition";
  first: Source;
  second: Source;
} & Source;

export type SubtractionSource = {
  type: "subtraction";
  first: Source;
  second: Source;
} & Source;

export type MultiplicationSource = {
  type: "multiplication";
  first: Source;
  second: Source;
} & Source;

export type DivisionSource = {
  type: "division";
  first: Source;
  second: Source;
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
    case "addition":
      var add_number_source = source as AdditionSource;
      var number1 = getStructureFromSource(base_structure, add_number_source.first) as NumberSource
      var number2 = getStructureFromSource(base_structure, add_number_source.second) as NumberSource
      return {
        "type": "number",
        "value": number1.value + number2.value,
      } as NumberStructure;
    case "subtraction":
      var sub_number_source = source as SubtractionSource;
      var number1 = getStructureFromSource(base_structure, sub_number_source.first) as NumberSource
      var number2 = getStructureFromSource(base_structure, sub_number_source.second) as NumberSource
      return {
        "type": "number",
        "value": number1.value - number2.value,
      } as NumberStructure;
    case "multiplication":
      var mul_number_source = source as MultiplicationSource;
      var number1 = getStructureFromSource(base_structure, mul_number_source.first) as NumberSource
      var number2 = getStructureFromSource(base_structure, mul_number_source.second) as NumberSource
      return {
        "type": "number",
        "value": number1.value * number2.value,
      } as NumberStructure;
    case "division":
      var div_number_source = source as DivisionSource;
      var number1 = getStructureFromSource(base_structure, div_number_source.first) as NumberSource
      var number2 = getStructureFromSource(base_structure, div_number_source.second) as NumberSource
      return {
        "type": "number",
        "value": number1.value / number2.value,
      } as NumberStructure;
    default:
      console.error("Unknown source type", source);
      return {
        "type": "string",
        "value": "Unknown",
      } as StringStructure;
  }
}
