// src/shared/components/XSwitch.tsx
import React from 'react';
import { Switch } from 'react-native';
import { XColors } from '../constants/colors';
import {useTheme} from '@/shared/theme/ThemeProvider';
type XSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function XSwitch({ value, onValueChange, disabled = false }: XSwitchProps) {
  const theme = useTheme();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#ccc', true: theme.colors.primary }}
      thumbColor={value ? theme.colors.white : '#f4f3f4'}
      disabled={disabled}
    />
  );
}
