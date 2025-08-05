//tao apptType
// TypeScript equivalent of the ApptType Kotlin class

import { useTheme } from "@/shared/theme";

export interface ApptType {
  id: string;
  name: string;
  bgColor?: string;
}
// Helper function to create an ApptType
export function createApptType(
  id: string = "Misc",
  name: string = "Misc",
  bgColor: string = useTheme().colors.secondary
): ApptType {
  return {
    id,
    name,
    bgColor,
  };
}
