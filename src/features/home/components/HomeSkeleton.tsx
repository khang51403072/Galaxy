import React from 'react';
import { View } from 'react-native';
import { XSkeleton } from '../../../shared/components/XSkeleton';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export default function HomeSkeleton() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 16 }}>
      {/* Header Skeleton */}
      <View style={{ 
        width: '100%', 
        height: 60, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20
      }}>
        <XSkeleton width={40} height={40} borderRadius={20} />
        
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <XSkeleton width={120} height={16} borderRadius={4} />
        </View>
        
        <XSkeleton width={24} height={24} borderRadius={12} />
      </View>

      {/* Title Skeleton */}
      <XSkeleton width={150} height={20} borderRadius={4} style={{ marginBottom: 16 }} />

      {/* Stats Cards Skeleton */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ 
          width: '48%', 
          padding: 16,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm
        }}>
          <XSkeleton width={60} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
          <XSkeleton width={80} height={20} borderRadius={4} />
        </View>
        
        <View style={{ 
          width: '48%', 
          padding: 16,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm
        }}>
          <XSkeleton width={60} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
          <XSkeleton width={80} height={20} borderRadius={4} />
        </View>
      </View>

      {/* Chart Container Skeleton */}
      <View style={{ 
        padding: 16,
        backgroundColor: theme.colors.white,
        borderRadius: 8,
        ...theme.shadows.sm,
        marginBottom: 20
      }}>
        <XSkeleton width={120} height={18} borderRadius={4} style={{ marginBottom: 12 }} />
        
        {/* Color Notes Skeleton */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
            <XSkeleton width={10} height={10} borderRadius={5} />
            <XSkeleton width={40} height={12} borderRadius={4} style={{ marginLeft: 8 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <XSkeleton width={10} height={10} borderRadius={5} />
            <XSkeleton width={40} height={12} borderRadius={4} style={{ marginLeft: 8 }} />
          </View>
        </View>
        
        <XSkeleton width="100%" height={200} borderRadius={8} />
      </View>

      {/* Category Title Skeleton */}
      <XSkeleton width={100} height={18} borderRadius={4} style={{ marginBottom: 16 }} />

      {/* Category Cards Skeleton */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ 
          width: '48%', 
          height: 80,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <XSkeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 8 }} />
          <XSkeleton width={60} height={14} borderRadius={4} />
        </View>
        
        <View style={{ 
          width: '48%', 
          height: 80,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <XSkeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 8 }} />
          <XSkeleton width={60} height={14} borderRadius={4} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ 
          width: '48%', 
          height: 80,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <XSkeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 8 }} />
          <XSkeleton width={60} height={14} borderRadius={4} />
        </View>
        
        <View style={{ 
          width: '48%', 
          height: 80,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <XSkeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 8 }} />
          <XSkeleton width={60} height={14} borderRadius={4} />
        </View>
      </View>
    </View>
  );
} 