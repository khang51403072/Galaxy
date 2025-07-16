import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Bell from '../assets/icons/Bell.svg'; // Đổi path nếu icon khác
import X from '../assets/icons/X.svg'; // Đổi path nếu icon khác

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
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Bell width={20} height={20} style={styles.icon} />
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 9999,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { marginRight: 8 },
  title: { fontWeight: 'bold', fontSize: 16, flex: 1, color: '#222' },
  closeBtn: { padding: 4 },
  message: { color: '#444', marginBottom: 8, textDecorationLine: 'underline', fontSize: 14 },
  link: { color: '#1976D2', fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 14 },
});

export default CustomBottomNotification; 