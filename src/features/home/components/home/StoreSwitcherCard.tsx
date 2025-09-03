// src/features/home/components/home/StoreSwitcherCard.tsx
import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import XText from '@/shared/components/XText';
import XIcon from '@/shared/components/XIcon';
import { useTheme } from '@/shared/theme';
import { XRow } from '@/shared/components/XRow';
import { XColumn } from '@/shared/components/XColumn';

// Định nghĩa props để component có thể tái sử dụng
interface StoreSwitcherCardProps {
  storeName: string;
  onPressSwitch: () => void;
}

/**
 * Component hiển thị store đang được chọn và cung cấp nút để chuyển store.
 * Được memo hóa để tối ưu hiệu năng.
 */
export const StoreSwitcherCard = memo(({ storeName, onPressSwitch }: StoreSwitcherCardProps) => {
  const theme = useTheme();

  return (
    <XRow
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        ...theme.shadows.sm,
      }}
      align="center"
      justify="space-between"
    >
      <XColumn style={{ width: '70%' }}>
        <XText variant='bodyLight' style={{ color: theme.colors.gray700 }}>
          Store:
        </XText>
        <XText variant='titleMedium' style={{ color: theme.colors.gray700 }} numberOfLines={1}>
          {storeName}
        </XText>
      </XColumn>
      <TouchableOpacity onPress={onPressSwitch} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <XIcon name='switchStore' color={theme.colors.gray700} width={40} height={40} />
      </TouchableOpacity>
    </XRow>
  );
});