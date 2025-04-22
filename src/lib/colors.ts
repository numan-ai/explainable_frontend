// Canvas colors
export const CANVAS_COLORS = {
  WIDGET: {
    STROKE: 'rgb(30, 41, 59)',
    BACKGROUND: 'rgb(42, 58, 84)',
    TEXT: 'lightgray',
    CHART_LINE: 'red',
  },
  EDGE: {
    STROKE: 'rgb(30, 41, 59)',
    DEFAULT_LINE: 'rgb(240, 240, 240)',
    HIGHLIGHT: '#2196F3', // Used in ClickableExclusiveEdgeWidget
  },
  SELECTION: {
    ACTIVE: 'rgb(240, 240, 240)',
    INACTIVE: 'black',
  },
} as const;

// HTML/UI colors
export const UI_COLORS = {
  TEXT_COLOR: "hsl(var(--foreground))",
  TEXT_MUTED_COLOR: "hsl(var(--muted-foreground))",
  BORDER: 'hsl(var(--border))',
  BACKGROUND: 'hsl(var(--background))',
  CONNECTION_COLORS: {
    DISCONNECTED: 'rgb(239, 68, 68)',
    CONNECTED: 'hsl(var(--muted-foreground))',
  },
} as const;