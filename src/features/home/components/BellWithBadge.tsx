import XIcon from '@/shared/components/XIcon';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';
import XText from '@/shared/components/XText';

export default function BellWithBadge({ count = 0 }) {
    const theme = useTheme();
    return (
        <View style={{ width: 24, height: 24 }}>
        <XIcon name='bell' width={24} height={24} color={theme.colors.gray700} />
        {count > 0 && (
            <View style={styles.badge}>
            <XText variant='captionLight' style={styles.badgeText}>{count > 99 ? '99+' : count}</XText>
            </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});