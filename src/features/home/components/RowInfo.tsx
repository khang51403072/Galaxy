import React from 'react';
import XText from '../../../shared/components/XText';
import { View } from 'react-native';

type TitleGroupProps = {
  titleLeft: string;
  titleRight: string;
};

export default function RowInfo({ titleLeft, titleRight }: TitleGroupProps) {
  return (
    <View style={{flexDirection: 'row', width: '100%'}}>
      <XText style={{flex: 1}} variant='content300'>{titleLeft}</XText>
      <XText style={{flex: 3}} variant='content400'>{titleRight}</XText>
    </View>
  );
}
