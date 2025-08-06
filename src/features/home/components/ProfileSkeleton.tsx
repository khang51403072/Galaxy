import React from 'react';
import { View, StyleSheet } from 'react-native';
import { XSkeleton } from '../../../shared/components/XSkeleton';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@/shared/theme';

export const ProfileSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={theme.colors.primaryGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
      >
        {/* Avatar skeleton */}
        <View style={styles.avatarContainer}>
          <XSkeleton width={120} height={120} borderRadius={60} />
        </View>
      </LinearGradient>
      
      {/* Content Section */}
      <View style={styles.content}>
        {/* Information Section */}
        <View style={styles.section}>
          <XSkeleton width={100} height={24} style={styles.sectionTitle} />
          
          {/* Row skeletons */}
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.row}>
              <XSkeleton width={80} height={16} />
              <XSkeleton width={200} height={16} />
            </View>
          ))}
        </View>

        <XSkeleton width="100%" height={1} style={styles.divider} />

        {/* Password Section */}
        <View style={styles.section}>
          <XSkeleton width={120} height={24} style={styles.sectionTitle} />
        </View>

        <XSkeleton width="100%" height={1} style={styles.divider} />

        {/* Work Details Section */}
        <View style={styles.section}>
          <XSkeleton width={100} height={24} style={styles.sectionTitle} />
          
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.row}>
              <XSkeleton width={80} height={16} />
              <XSkeleton width={150} height={16} />
            </View>
          ))}
        </View>

        <XSkeleton width="100%" height={1} style={styles.divider} />

        {/* Face ID Section */}
        <View style={styles.section}>
          <XSkeleton width={150} height={24} style={styles.sectionTitle} />
        </View>

        {/* Logout Button */}
        <XSkeleton width="100%" height={48} style={styles.logoutButton} />
        
        {/* Version */}
        <XSkeleton width={80} height={16} style={styles.version} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  version: {
    alignSelf: 'center',
    marginTop: 16,
  },
}); 