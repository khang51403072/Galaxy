import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';

interface XAlertProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const typeColors = {
  success: '#4BB543',
  error: '#FF3B30',
  info: '#007AFF',
};

const typeTitles = {
  success: 'Thành công',
  error: 'Lỗi',
  info: 'Thông báo',
};

export default function XAlert({
  
  title,
  message,
  type = 'info',
  onClose,
}: XAlertProps) {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(message!=null);
  if (!visible) return null;
  const handleClose = () => {
    setVisible(false);
    onClose?.();
  }
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.alert, { backgroundColor: typeColors[type] || theme.colors.primary }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title || typeTitles[type]}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  alert: {
    minWidth: 220,
    maxWidth: 320,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  message: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 2,
  },
  closeBtn: {
    marginLeft: 12,
    padding: 4,
    alignSelf: 'flex-start',
  },
  closeText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});