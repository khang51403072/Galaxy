import React from "react";
import { View } from "react-native";
import XIcon from "@/shared/components/XIcon";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { XDatePicker } from "@/shared/components/XDatePicker";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePickerField({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <XIcon
          name="date"
          width={16}
          height={16}
          color={theme.colors.primaryMain}
        />
        <XText variant="titleRegular">Date</XText>
      </View>
      <XDatePicker
        containerStyle={{
          backgroundColor: theme.colors.blackOpacity10,
          borderColor: "transparent",
        }}
        textAlign="center"
        style={{ width: "52%" }}
        value={value}
        onChange={(date) => {
          date.setHours(value.getHours(), value.getMinutes(), 0, 0);
          onChange(date);
        }}
        displayFormat="EE, dd/MM/yyyy"
        mode="date"
      />
    </View>
  );
}

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

export function TimePickerField({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <XIcon
          name="time"
          width={16}
          height={16}
          color={theme.colors.primaryMain}
        />
        <XText variant="titleRegular">Time</XText>
      </View>
      <XDatePicker
        containerStyle={{
          backgroundColor: theme.colors.blackOpacity10,
          borderColor: "transparent",
        }}
        textAlign="center"
        mode="time"
        style={{ width: "52%" }}
        value={value}
        onChange={(date) => {
          date.setMonth(value.getMonth());
          date.setDate(value.getDate());
          onChange(date);
        }}
      />
    </View>
  );
}

