import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../shared/theme';
import { XSkeleton } from '../../../shared/components/XSkeleton';

const TicketSkeleton = () => {
  const theme = useTheme();
  return (
    <View style={{ padding: 16 }}>
      {[...Array(5)].map((_, idx) => (
        <View key={idx} style={{ marginBottom: 16, backgroundColor: theme.colors.white, borderRadius: theme.spacing.md, ...theme.shadows.sm, padding: theme.spacing.md }}>
          <XSkeleton width={120} height={18} style={{ marginBottom: 8 }} />
          <XSkeleton width={80} height={14} style={{ marginBottom: 8 }} />
          <XSkeleton width={'100%'} height={1} style={{ marginBottom: 8 }} />
          <XSkeleton width={180} height={14} style={{ marginBottom: 8 }} />
          <XSkeleton width={'100%'} height={1} style={{ marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <XSkeleton width={100} height={12} />
            <XSkeleton width={60} height={12} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <XSkeleton width={100} height={12} />
            <XSkeleton width={60} height={12} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <XSkeleton width={100} height={12} />
            <XSkeleton width={60} height={12} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default TicketSkeleton; 