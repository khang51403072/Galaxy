import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import XIcon from './XIcon';
import XText from './XText';

interface XAlertProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}



const typeTitles = {
  success: 
  
  'Success',
  error: 'Error',
  info: 'Info',
};

export default function XAlert({
  
  title,
  message,
  type = 'info',
  onClose,
}: XAlertProps) {
  const theme = useTheme();
  const typeColors = {
    success: {main: theme.colors.successMain, light: theme.colors.successLight},
    error: {main: theme.colors.errorMain, light: theme.colors.errorLight},
    info: {main: theme.colors.infoMain, light: theme.colors.infoLight},
  };
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
    alert: {
      minWidth: 320,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
      flexDirection: 'row',
    },
    title: {
      color: theme.colors.gray800,
    },
    message: {
      color: theme.colors.gray800,
    },
    closeBtn: {
      position: 'absolute',
      right: 8,
      top: 8,
      padding: 8,
      borderRadius: 100,
      alignSelf: 'flex-start',
      backgroundColor: '#0000001A',
    },
   
  });
  
  const [visible, setVisible] = React.useState(message!=null);
  if (!visible) return null;
  const handleClose = () => {
    setVisible(false);
    onClose?.();
  }
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.alert, { backgroundColor: typeColors[type].light  }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'flex-start', 
              justifyContent: 'flex-start',
              gap: 8 }}>
              <XIcon name="exclamationMark" height={24} width={24} color={typeColors[type].main} />
              <XText variant="h4" style={styles.title}>{title || typeTitles[type]}</XText>
            </View>
            
            <XText variant="content300" style={styles.message}>{message}</XText>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <XIcon name="x" height={10} width={10} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

