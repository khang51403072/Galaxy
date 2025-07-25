// src/shared/components/XDivider.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  color?: string;
  thickness?: number;
  spacing?: number;
};

export default function XDivider({ color = '#E0E0E0', thickness = 1, spacing = 12 }: Props) {
  return (
    <View
      style={{
        height: thickness,
        backgroundColor: color,
        // marginVertical: spacing,
        width: '100%',
      }}
    />
  );
}
