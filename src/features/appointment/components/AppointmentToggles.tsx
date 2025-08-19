import React from "react";
import { View } from "react-native";
import XText from "@/shared/components/XText";
import XSwitch from "@/shared/components/XSwitch";
import { useTheme } from "@/shared/theme/ThemeProvider";

interface Props {
  value: boolean;
  onChange: (val: boolean) => void;
}

export function ConfirmOnlineToggle({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      }}
    >
      <XText variant="bodyRegular">Confirm Online</XText>
      <XSwitch value={value} onValueChange={onChange} />
    </View>
  );
}


export function GroupApptToggle({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      }}
    >
      <XText variant="bodyRegular">Group Appointment</XText>
      <XSwitch value={value} onValueChange={onChange} />
    </View>
  );
}
