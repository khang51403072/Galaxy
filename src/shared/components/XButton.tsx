import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
};

export default function XButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  backgroundColor = '#4A90E2', // default màu xanh
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.wrapper,
        { backgroundColor },
        disabled && styles.disabledWrapper,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 16, // height/2 = 48/2
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  disabledWrapper: {
    opacity: 0.6,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
