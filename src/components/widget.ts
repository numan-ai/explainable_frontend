import { Representation } from "@/representation";
import { BaseStructure } from "@/structures/types";

export type WidgetProps = {
  structure: BaseStructure;
  representation: Representation | null;
  position: Position;
  id: string;
}