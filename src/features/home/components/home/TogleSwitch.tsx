// src/features/home/components/ToggleSwitch.tsx

import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../shared/theme/ThemeProvider';
import XText from '../../../../shared/components/XText';

// Định nghĩa props cho component để đảm bảo type safety
interface ToggleSwitchProps {
  value: 'week' | 'month';
  onChange: (value: 'week' | 'month') => void;
}

// Bọc component trong React.memo để ngăn re-render không cần thiết
export const ToggleSwitch = memo(({ value, onChange }: ToggleSwitchProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.blackOpacity10,
        borderRadius: 8,
        overflow: 'hidden',
        width: "60%",
        height: 32,
        padding: theme.spacing.xs, // Đơn giản hóa padding
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: value === 'week' ? theme.colors.white : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: theme.borderRadius.sm,
          height: '100%', // Đảm bảo button chiếm hết chiều cao
        }}
        onPress={() => onChange('week')}
        activeOpacity={0.8}
      >
        <XText variant='captionRegular' style={{ color: theme.colors.gray700 }}>Week</XText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: value === 'month' ? theme.colors.white : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: theme.borderRadius.sm,
          height: '100%',
        }}
        onPress={() => onChange('month')}
        activeOpacity={0.8}
      >
        <XText variant='captionRegular' style={{ color: theme.colors.gray700 }}>Month</XText>
      </TouchableOpacity>
    </View>
  );
});