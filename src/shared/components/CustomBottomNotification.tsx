import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Bell from '../assets/icons/Bell.svg'; // Đổi path nếu icon khác
import X from '../assets/icons/X.svg'; // Đổi path nếu icon khác
import { useTheme } from '../theme';

export type CustomBottomNotificationProps = {
  title: string;
  message: string;
  onClose: () => void;
  onViewDetails?: () => void;
};

const CustomBottomNotification: React.FC<CustomBottomNotificationProps> = ({
  title,
  message,
  onClose,
  onViewDetails,
}) =>{ 
const theme = useTheme()  
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 120,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    
    zIndex: 9999,
    ...theme.shadows.sm
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { marginRight: 8 },
  title: {...theme.typography.headingMedium, color: theme.colors.gray800 },
  closeBtn: { padding: 4 ,position: 'absolute',
    right: 2,
    top: 0,
  },
  message: { ...theme.typography.bodyLight, color: theme.colors.gray800},
  link: { color: theme.colors.primaryMain, ...theme.typography.captionRegular },
});
  
  return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Bell width={20} height={20} color={theme.colors.primaryMain} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{top:8,bottom:8,left:8,right:8}}>
        <X width={18} height={18} />
      </TouchableOpacity>
    </View>
    <Text style={styles.message}>{message}</Text>
    {onViewDetails && (
      <TouchableOpacity onPress={onViewDetails}>
        <Text style={styles.link}>View Details</Text>
      </TouchableOpacity>
    )}
  </View>
);
}

export default CustomBottomNotification; 