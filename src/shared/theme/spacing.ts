export const spacing = {
  // Extra small spacing
  xs: 4,
  // Small spacing
  sm: 8,
  // Medium spacing (most commonly used)
  md: 16,
  // Large spacing
  lg: 24,
  // Extra large spacing
  xl: 32,
  // 2x extra large
  xxl: 48,
  // 3x extra large
  xxxl: 64,
} as const;

export type Spacing = typeof spacing; 