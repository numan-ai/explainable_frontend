export type GraphStructure = {
  nodes: NodeStructure[];
  edges: EdgeStructure[];
}

export type NodeStructure = {
  object_id: string;
  layer: string;
  widget: string;
  data: any;
  default_x: number;
  default_y: number;
  is_draggable: boolean;
}

export type EdgeStructure = {
  widget: string;
  edge_id: string;
  node_start_id: string;
  node_end_id: string;
  data: any;
  line_width: number;
  line_color: string;
}

export type Position = {
  x: number,
  y: number,
}

export type Size = {
  w: number,
  h: number,
}