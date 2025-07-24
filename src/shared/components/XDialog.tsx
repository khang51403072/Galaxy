import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../theme';
import XButton from './XButton';

interface XDialogProps {
  visible: boolean;
  title?: string;
  content: React.ReactNode;
  textConfirm?: string;
  textCancel?: string;
  colorConfirm?: string;
  colorCancel?: string;
  onConfirm?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
}

export default function XDialog({
  visible,
  title = 'Notification',
  content,
  textConfirm = 'OK',
  textCancel = 'Cancel',
  colorConfirm,
  colorCancel,
  onConfirm = () => {},
  onCancel = () => {},
}: XDialogProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView} pointerEvents="box-none">
        <View style={[styles.dialog, { backgroundColor: theme.colors.white }]}> 
          <Text style={[styles.title, ]}>{title}</Text>
          <View style={styles.content}>{typeof content === 'string' ? <Text style={{ color: theme.colors.text }}>{content}</Text> : content}</View>
          <View style={styles.actions}>
            <XButton
              title={textCancel}
              onPress={onCancel}
              backgroundColor={colorCancel || theme.colors.gray200}
              style={styles.button}
              defaultTextColor={theme.colors.gray700}
              useGradient={false}
            />
            <XButton
              title={textConfirm}
              onPress={onConfirm}
              backgroundColor={colorConfirm || theme.colors.primary}
              style={styles.button}
              useGradient={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginHorizontal: 16,
  },
  dialog: {
    minWidth: 280,
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 