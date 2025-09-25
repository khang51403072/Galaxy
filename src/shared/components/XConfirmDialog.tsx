// src/shared/components/XConfirmDialog.tsx
import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import XText from './XText';
import XButton from './XButton'; // Giả sử bạn có component XButton
import { XRow } from './XRow';

// Định nghĩa props cho component
export interface XConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  childrenTop?: React.ReactNode;
  childrenBottom?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function XConfirmDialog({
  visible,
  title,
  message,
  childrenBottom: childrenBottom,
  childrenTop,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: XConfirmDialogProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dialog: {
      width: '85%',
      maxWidth: 400,
      backgroundColor: theme.colors.white,
      borderRadius: 16,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...theme.shadows.lg,
    },
    buttonContainer: {
      marginTop: theme.spacing.sm,
    }
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {childrenTop}
          <XText style={{justifyContent:'center', textAlign:'center' }} variant="titleMedium">{title}</XText>
          <XText variant="bodyLight" style={{ color: theme.colors.gray700, justifyContent:'center', textAlign:'center' }}>{message}</XText>
          {childrenBottom}
          <XRow justify="flex-end" gap={theme.spacing.sm} style={styles.buttonContainer}>
            <XButton textStyle={{color: theme.colors.gray700}} title={cancelText} onPress={onCancel} backgroundColor={theme.colors.gray200} style={{flex:1}}/>
            <XButton title={confirmText} onPress={onConfirm} backgroundColor={theme.colors.primaryMain} style={{flex:1}}/>
          </XRow>
        </View>
      </View>
    </Modal>
  );
}