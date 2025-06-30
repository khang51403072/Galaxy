export const borderRadius = {
  // Small radius for small elements
  sm: 4,
  // Medium radius for buttons, inputs
  md: 8,
  // Large radius for cards, containers
  lg: 16,
  // Extra large radius for buttons, modals
  xl: 24,
  // Round radius for avatars, circular elements
  round: 50,
  // Full round for circular elements
  full: 9999,
} as const;

export type BorderRadius = typeof borderRadius; 