import React from 'react';
import User from '../assets/icons/User.svg';
import PasswordCheck from '../assets/icons/PasswordCheck.svg';
import ShowPassword from '../assets/icons/ShowPassword.svg';
import { StyleProp, ViewStyle } from 'react-native';
import Logo from '../assets/icons/Logo.svg';
export const iconMap = {
  user: User,
  passwordCheck: PasswordCheck,
  showPassword: ShowPassword,
  hidePassword: ShowPassword,
  logo: Logo,
};

 type XIconProps = {
  name: keyof typeof iconMap;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function XIcon({ name, width = 24, height = 24, color = '#000', style }: XIconProps) {
  const Component = iconMap[name];
  return <Component width={width} height={height} fill={color} style={style} />;
}
