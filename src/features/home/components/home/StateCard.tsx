// features/home/components/StatCard.tsx
import React, { memo } from 'react';
import { View } from 'react-native';
import XText from '@/shared/components/XText';
import { useTheme } from '@/shared/theme';

interface StatCardProps {
  title: string;
  value: number;
}

export const StatCard = memo(({ title, value }: StatCardProps) => {
  const theme = useTheme();
  
  return (
    <View style={{
      width: '48%',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing.xs,
      ...theme.shadows.sm
    }}>
      <XText variant='bodyLight' style={{ color: theme.colors.gray700 }}>
        {title}:
      </XText>
      <XText variant='bodyMedium' style={{ color: theme.colors.gray700 }}>
        $ {value?.toFixed(2) || 0}
      </XText>
    </View>
  );
});