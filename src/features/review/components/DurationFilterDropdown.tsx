import React, { useMemo } from "react";
import { View } from "react-native";
import XDropdown from "@/shared/components/XDropdown";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { XRow } from "@/shared/components/XRow";
import XButton from "@/shared/components/XButton";
import XIcon from "@/shared/components/XIcon";

interface Props {
  selectedApptType?: { label: string; value: number };
  dropdownOptions: { label: string; value: number }[];
  onItemSelect: (item: { label: string; value: number }) => void;
  onSearch: () => void
}

const COMMON_HEIGHT = 44
export default function DurationFilterDropdown({
  selectedApptType,
  dropdownOptions,
  onItemSelect,
  onSearch
}: Props) {
  const theme = useTheme();
  
  const MemoizedDropdown = useMemo(() => {
    return (
      <XRow gap={theme.spacing.sm} align='center' justify="space-between">
        <XDropdown
          value={selectedApptType}
          renderLabel={(item) => {
            return (
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
            );
          }}
          renderItem={(item, isSelected) => {
            return (
              <XRow
                style={{
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 1,
                  paddingVertical: theme.spacing.sm,
                  paddingLeft: theme.spacing.sm,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: isSelected ? theme.colors.primaryOpacity5: "transparent"
                }}
              >
                <XText variant="headingRegular">{item.label}</XText>
              </XRow>
            );
          }}
          placeholder="Choose Service"
          options={dropdownOptions}
          onSelect={onItemSelect}
          style={{ flex: 1}}
        />
        <XButton  
          style={{ width:COMMON_HEIGHT, height:COMMON_HEIGHT}} 
          icon={<XIcon color={theme.colors.white} name="load"></XIcon>} 
          onPress={onSearch} />
      </XRow>
      
    );
  }, [selectedApptType, dropdownOptions, onItemSelect, theme]);

  return MemoizedDropdown;
}
