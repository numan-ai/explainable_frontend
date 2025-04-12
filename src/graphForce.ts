import { EdgeStructure, NodeStructure, Position } from "./structures/types";

const MIN_DISTANCE = 1000; // minimum distance between nodes
const EDGE_LENGTH = 100; // ideal edge length
const LEARNING_RATE = 0.1; // step size for the adjustment
const NODE_LEARNING_RATE = 0.1; // step size for the adjustment


export default function stepMinimizeEdgeLength(
  nodes: NodeStructure[],
  edges: EdgeStructure[],
  positions: Map<string, Position>,
): Map<string, Position> {
  // Function to calculate the Euclidean distance between two positions
  const distance = (pos1: Position, pos2: Position): number => {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
  };

  const newPositions = new Map<string, Position>();

  // Function to normalize a vector
  const normalize = (dx: number, dy: number) => {
    const length = Math.sqrt(dx * dx + dy * dy);
    return { dx: dx / length, dy: dy / length };
  };

  // Update positions based on edge minimization and node repulsion
  nodes.forEach(node => {
    const pos = positions.get(node.object_id);
    if (!pos) return;

    let totalDx = 0;
    let totalDy = 0;

    // Edge attraction force
    edges.forEach(edge => {
      let otherNodeId: string | null = null;
      if (edge.node_start_id === node.object_id) {
        otherNodeId = edge.node_end_id;
      } else if (edge.node_end_id === node.object_id) {
        otherNodeId = edge.node_start_id;
      }

      if (otherNodeId) {
        const otherPos = positions.get(otherNodeId);
        if (!otherPos) return;

        const dist = distance(pos, otherPos);
        const delta = dist - EDGE_LENGTH;

        const direction = normalize(
          otherPos.x - pos.x,
          otherPos.y - pos.y
        );

        totalDx += direction.dx * delta * LEARNING_RATE;
        totalDy += direction.dy * delta * LEARNING_RATE;
      }
    });

    // Node repulsion force to maintain minimum distance
    nodes.forEach(otherNode => {
      if (otherNode.object_id !== node.object_id) {
        const otherPos = positions.get(otherNode.object_id);
        if (!otherPos) return;

        const dist = distance(pos, otherPos);

        if (dist < MIN_DISTANCE) {
          const delta = MIN_DISTANCE - dist;

          const direction = normalize(
            pos.x - otherPos.x,
            pos.y - otherPos.y,
          );

          totalDx += direction.dx * delta * NODE_LEARNING_RATE;
          totalDy += direction.dy * delta * NODE_LEARNING_RATE;
        }
      }
    });

    // Update node position
    newPositions.set(node.object_id, {
      x: pos.x + totalDx,
      y: pos.y + totalDy,
    });
  });

  return newPositions;
}