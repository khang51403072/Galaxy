// src/features/home/components/ColorNote.tsx
import React, { memo } from 'react';
import { View } from 'react-native';
import XText from '@/shared/components/XText';
import { useTheme } from '@/shared/theme';

// Định nghĩa props để component an toàn về kiểu dữ liệu
interface ColorNoteProps {
  text: string;
  color: string;
}

/**
 * Component hiển thị một chấm màu và một đoạn text đi kèm.
 * Được memo hóa vì nó là một component thuần túy, chỉ phụ thuộc vào props.
 */
export const ColorNote = memo(({ text, color }: ColorNoteProps) => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 50 }} />
      <XText variant='captionLight' style={{ color: theme.colors.gray800, marginLeft: theme.spacing.xs }}>
        {text}
      </XText>
    </View>
  );
});