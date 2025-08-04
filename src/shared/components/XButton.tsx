import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';
import XText from './XText';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  defaultTextColor?: string;
  loading?: boolean;
  useGradient?: boolean;
  radius?: number | keyof ReturnType<typeof useTheme>['borderRadius'];
};

export default function XButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  backgroundColor,
  defaultTextColor,
  loading = false,
  useGradient = false,
  radius,
}: Props) {
  const theme = useTheme();

  // Determine borderRadius
  let borderRadius: number = Number(theme.borderRadius.md);
  if (typeof radius === 'number') borderRadius = radius;
  else if (radius && theme.borderRadius[radius]) borderRadius = Number(theme.borderRadius[radius]);

  // Use theme colors if backgroundColor not provided
  const buttonBackgroundColor = backgroundColor || theme.colors.primary;
  const inactiveColor = theme.colors.buttonInactive;
  const gradientColors = theme.colors.primaryGradient;
  const textColor = defaultTextColor || theme.colors.textButton;

  const isDisabled = disabled || loading;
  const showGradient = useGradient && !isDisabled;

  const content = loading ? (
    <ActivityIndicator color={textColor} />
  ) : (
    <XText variant='titleMedium' style={[styles.text, { color: textColor }, textStyle]}>{title.toUpperCase()}</XText>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.wrapper,
        {
          backgroundColor: isDisabled
            ? inactiveColor
            : showGradient
            ? 'transparent'
            : buttonBackgroundColor,
          borderRadius: Number(borderRadius),
        },
        style,
      ]}
    >
      {showGradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={[styles.content, { backgroundColor: 'transparent' }]}> 
        {content}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
