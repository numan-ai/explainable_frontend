import { Representation } from "@/representation";
import { BaseStructure } from "@/structures/types";

export type WidgetProps = {
  structure: BaseStructure;
  representation: Representation;
  position: Position;
  id: string;
}