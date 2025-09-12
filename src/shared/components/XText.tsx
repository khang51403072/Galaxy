import React from 'react';
import { Text, TextLayoutEvent, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';

type Props = TextProps & {
  variant?: keyof typeof typography;
  color?: string;
  maxLines?: number;
  truncate?: 'tail' | 'head' | 'middle' | 'clip';
  onTextLayout?: (event: TextLayoutEvent) => void
};

export default function XText({ variant = 'bodyRegular', style, color, maxLines,truncate='tail', onTextLayout, ...rest }: Props) {
  const theme = useTheme();
  const textStyle = theme.typography[variant];
  const textColor = color || theme.colors.gray700;
  
  return <Text onTextLayout={onTextLayout} numberOfLines={maxLines} ellipsizeMode={truncate} style={[textStyle, { color: textColor }, style]} {...rest} />;
}
