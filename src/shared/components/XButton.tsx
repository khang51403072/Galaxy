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

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  loading?: boolean;
  useGradient?: boolean;
};

export default function XButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  backgroundColor,
  loading = false,
  useGradient = true,
}: Props) {
  const theme = useTheme();
  
  // Use theme colors if backgroundColor not provided
  const buttonBackgroundColor = backgroundColor || theme.colors.primary;
  const gradientColors = theme.colors.primaryGradient;
  const textColor = theme.colors.textButton;

  const content = loading ? (
    <ActivityIndicator color={textColor} />
  ) : (
    <Text style={[styles.text, { color: textColor }, textStyle]}>{title.toUpperCase()}</Text>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.wrapper,
        { 
          backgroundColor: (!useGradient || disabled) ? buttonBackgroundColor : 'transparent',
          borderRadius: theme.borderRadius.xl,
        },
        style,
      ]}
    >
      {(useGradient && !disabled) ? (
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
  disabledWrapper: {
    opacity: 0.5,
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
