import React from 'react';
import XText from '../../../shared/components/XText';
import XIcon, { iconMap } from '../../../shared/components/XIcon';
import { XColors } from '../../../shared/constants/colors';
import { View } from 'react-native';
import ActionGroup from './ActionGroup';

type TitleGroupProps = {
  title: string;
  titleIcon?: string;
  icon?: keyof typeof iconMap;
  onPress: () => void;
};

export default function TitleGroup({ title, titleIcon, icon = "pen", onPress }: TitleGroupProps) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 8}}>
      <XText variant='contentTitle'>{title}</XText>
      {titleIcon && <ActionGroup title={titleIcon} icon={icon} onPress={onPress} />}
    </View>
  );
}
