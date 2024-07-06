export type BaseStructure = {
  type: string;
}

export type ListStructure = {
  type: "list";
  data: BaseStructure[];
} & BaseStructure;

export type DictStructure = {
  type: "dict";
  keys: BaseStructure[];
  values: BaseStructure[];
} & BaseStructure;

export type NullStructure = {
  type: "null";
} & BaseStructure;

export type NumberStructure = {
  type: "number";
  value: number;
} & BaseStructure;

export type ObjectStructure = {
  type: "object";
  subtype: string;
  data: { [key: string]: BaseStructure };
} & BaseStructure;

export type StringStructure = {
  type: "string";
  value: string;
} & BaseStructure;