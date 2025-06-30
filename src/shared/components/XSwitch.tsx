// src/shared/components/XSwitch.tsx
import React from 'react';
import { Switch } from 'react-native';
import { XColors } from '../constants/colors';

type XSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function XSwitch({ value, onValueChange, disabled = false }: XSwitchProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#ccc', true: XColors.primary }}
      thumbColor={value ? XColors.primary : '#f4f3f4'}
      disabled={disabled}
    />
  );
}
