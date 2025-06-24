// src/shared/components/FormBase.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import XButton from './XButton';
import XText from './XText';
import { TextStyles } from '../constants/textStyles';

type FormBaseProps = {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
  style?: object;
};

export default function FormBase({
  onConfirm,
  onCancel,
  confirmTitle = 'Xác nhận',
  cancelTitle = 'Huỷ',
  confirmLoading = false,
  confirmDisabled = false,
  errorMessage,
  children,
  style,
}: FormBaseProps) {
  return (
    <View style={[styles.container, style]}>
      {children}

      {errorMessage ? (
        <XText style={styles.error}>{errorMessage}</XText>
      ) : null}

      <View style={styles.buttonRow}>
        {onCancel && (
          <XButton
            title={cancelTitle}
            onPress={onCancel}
            backgroundColor="#ccc"
            style={styles.button}
          />
        )}
        {onConfirm && (
          <XButton
            title={confirmTitle}
            onPress={onConfirm}
            backgroundColor={confirmDisabled ? '#1D62D840' : '#007AFF'}
            loading={confirmLoading}
            disabled={confirmDisabled}
            style={styles.button}
            textStyle={TextStyles.buttonText}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
});