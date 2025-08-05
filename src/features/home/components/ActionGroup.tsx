import React from 'react';
import XText from '../../../shared/components/XText';
import XIcon, { iconMap } from '../../../shared/components/XIcon';
import { TouchableOpacity, View } from 'react-native';
import { Fonts } from '../../../shared/constants/fonts';
import { useTheme } from '@/shared/theme';

type TitleGroupProps = {
  
  title: string;
  icon: keyof typeof iconMap;
  onPress: () => void;
};

export default function ActionGroup({ title, icon = "pen", onPress }: TitleGroupProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={onPress}>
        <XIcon name={icon} color={theme.colors.primaryMain} width={14} height={14} />
        <XText variant='titleRegular' style={{color: theme.colors.primaryDark, marginLeft: 4, fontFamily: Fonts.Outfit400}}>{title}</XText>
      </TouchableOpacity>
  );
}
