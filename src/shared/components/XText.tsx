import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { TextStyles } from '../constants/textStyles';

type Props = TextProps & {
  variant?: keyof typeof TextStyles;
};

export default function AppText({ variant = 'h1', style, ...rest }: Props) {
  return <Text style={[TextStyles[variant], style]} {...rest} />;
}
