import React, { useMemo } from "react";
import { View } from "react-native";
import XDropdown from "@/shared/components/XDropdown";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";

export interface ApptType {
  bgColor: string;
}

interface Props {
  selectedApptType?: { label: string; value: ApptType };
  dropdownOptions: { label: string; value: ApptType }[];
  handleApptTypeSelect: (item: { label: string; value: ApptType }) => void;
}

export default function AppointmentTypeDropdown({
  selectedApptType,
  dropdownOptions,
  handleApptTypeSelect,
}: Props) {
  const theme = useTheme();

  const MemoizedDropdown = useMemo(() => {
    return (
      <XDropdown
        value={selectedApptType}
        renderLabel={(item) => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <XInput
                value={item.label}
                onChangeText={() => {}}
                iconLeft={
                  <View
                    style={{
                      borderRadius: theme.spacing.sm,
                      height: theme.spacing.md,
                      width: theme.spacing.md,
                      backgroundColor: item.value.bgColor,
                    }}
                  />
                }
                iconRight="downArrow"
                editable={false}
                pointerEvents="none"
              />
            </View>
          );
        }}
        renderItem={(item, isSelected) => {
          return (
            <View
              style={{
                borderBottomColor: theme.colors.border,
                borderBottomWidth: 1,
                paddingVertical: theme.spacing.sm,
                paddingLeft: theme.spacing.sm,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  marginEnd: theme.spacing.sm,
                  borderRadius: theme.spacing.sm,
                  height: theme.spacing.md,
                  width: theme.spacing.md,
                  backgroundColor: (item.value as ApptType).bgColor,
                }}
              />
              <XText variant="headingRegular">{item.label}</XText>
            </View>
          );
        }}
        placeholder="Choose Service"
        options={dropdownOptions}
        onSelect={handleApptTypeSelect}
      />
    );
  }, [selectedApptType, dropdownOptions, handleApptTypeSelect, theme]);

  return MemoizedDropdown;
}
