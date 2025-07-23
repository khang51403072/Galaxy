import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';

type XSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  trackColorOn?: string;
  trackColorOff?: string;
  thumbColorOn?: string;
  thumbColorOff?: string;
};

const SWITCH_WIDTH = 44;
const SWITCH_HEIGHT = 26;
const THUMB_SIZE = 22;
const PADDING = 2;

export default function XSwitch({
  value,
  onValueChange,
  disabled = false,
  style,
  trackColorOn,
  trackColorOff,
  thumbColorOn,
  thumbColorOff,
}: XSwitchProps) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackColor = value
    ? trackColorOn || theme.colors.primary
    : trackColorOff || '#ccc';
  const thumbColor = value
    ? thumbColorOn || theme.colors.white
    : thumbColorOff || '#f4f3f4';

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, SWITCH_WIDTH - THUMB_SIZE - PADDING],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[styles.container, style, disabled && { opacity: 0.5 }]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <View
        style={[
          styles.track,
          { backgroundColor: trackColor },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    backgroundColor: '#ccc',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    top: PADDING,
    left: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
});