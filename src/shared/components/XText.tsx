import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';

type Props = TextProps & {
  variant?: keyof typeof typography;
  color?: string;
};

export default function XText({ variant = 'body', style, color, ...rest }: Props) {
  const theme = useTheme();
  const textStyle = theme.typography[variant];
  const textColor = color || theme.colors.gray700;
  
  return <Text style={[textStyle, { color: textColor }, style]} {...rest} />;
}
