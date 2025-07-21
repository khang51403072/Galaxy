import React from 'react';
import { View } from 'react-native';
import { XSkeleton } from '@/shared/components/XSkeleton';
import { useTheme } from '@/shared/theme/ThemeProvider';

const AppointmentItemSkeleton = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        gap: theme.spacing.sm,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <XSkeleton width={80} height={24} />
        <XSkeleton width={60} height={16} />
      </View>

      <XSkeleton width="60%" height={20} />
      <XSkeleton width="40%" height={16} />
      <XSkeleton width="50%" height={16} />
      <XSkeleton width="70%" height={16} />
    </View>
  );
};

export default AppointmentItemSkeleton; 