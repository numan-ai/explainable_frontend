import { ViewType } from '../storages/viewStorage';
import { Position } from '../structures/types';
import { getWidgetSize } from '../new_components/registry';

export interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ContentBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  centerX: number;
  centerY: number;
}

/**
 * Calculate viewport bounds in world coordinates
 */
export function calculateViewportBounds(
  stagePosition: Position,
  dimensions: { width: number; height: number },
  scale: number
): ViewportBounds {
  const left = stagePosition.x;
  const top = stagePosition.y;
  const right = left + dimensions.width / scale;
  const bottom = top + dimensions.height / scale;
  
  return { left, top, right, bottom };
}

/**
 * Check if any content is visible in the current viewport
 */
export function hasVisibleContent(
  view: ViewType,
  widgetStates: Map<string, { position: Position | null }>,
  viewportBounds: ViewportBounds
): boolean {
  if (!view.structure || !view.structure.nodes.length) {
    return false;
  }
  
  // For large datasets (100+ widgets), use the first widget for performance
  const nodesToCheck = view.structure.nodes.length > 100 
    ? [view.structure.nodes[0]] 
    : view.structure.nodes;
  
  // Check if any widget is visible in the viewport
  for (const node of nodesToCheck) {
    const widgetState = widgetStates.get(node.object_id);
    if (!widgetState?.position) continue;
    
    const widgetX = widgetState.position.x;
    const widgetY = widgetState.position.y;
    
    // Get actual widget size
    const widgetSize = getWidgetSize(node.widget, node.data);
    if (!widgetSize) continue;
    
    const widgetWidth = widgetSize.w;
    const widgetHeight = widgetSize.h;
    
    // Check if widget intersects with viewport
    if (widgetX < viewportBounds.right && 
        widgetX + widgetWidth > viewportBounds.left &&
        widgetY < viewportBounds.bottom && 
        widgetY + widgetHeight > viewportBounds.top) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculate the bounds of all content
 */
export function calculateContentBounds(
  view: ViewType,
  widgetStates: Map<string, { position: Position | null }>
): ContentBounds | null {
  if (!view.structure || !view.structure.nodes.length) {
    return null;
  }
  
  // For large datasets (100+ widgets), use the first widget for performance
  const nodesToCheck = view.structure.nodes.length > 100 
    ? [view.structure.nodes[0]] 
    : view.structure.nodes;
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  for (const node of nodesToCheck) {
    const widgetState = widgetStates.get(node.object_id);
    if (!widgetState?.position) continue;
    
    const widgetSize = getWidgetSize(node.widget, node.data);
    if (!widgetSize) continue;
    
    const widgetX = widgetState.position.x;
    const widgetY = widgetState.position.y;
    const widgetWidth = widgetSize.w;
    const widgetHeight = widgetSize.h;
    
    minX = Math.min(minX, widgetX);
    minY = Math.min(minY, widgetY);
    maxX = Math.max(maxX, widgetX + widgetWidth);
    maxY = Math.max(maxY, widgetY + widgetHeight);
  }
  
  if (minX === Infinity) {
    return null;
  }
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

/**
 * Calculate the position to center content in the viewport
 */
export function calculateCenteringPosition(
  contentBounds: ContentBounds,
  dimensions: { width: number; height: number },
  scale: number
): Position {
  // Calculate center of viewport
  const viewportCenterX = dimensions.width / 2 / scale;
  const viewportCenterY = dimensions.height / 2 / scale;
  
  // Set position to center content in viewport
  return {
    x: contentBounds.centerX - viewportCenterX,
    y: contentBounds.centerY - viewportCenterY
  };
}
