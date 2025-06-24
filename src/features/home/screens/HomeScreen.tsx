import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { getProfile } from '../usecase/HomeUseCase';
import { XColors } from '../../../shared/constants/colors';
import XIcon from '../../../shared/components/XIcon';
import XText from '../../../shared/components/XText';
import TitleGroup from '../components/TitleGroup';
import RowInfo from '../components/RowInfo';
import XButton from '../../../shared/components/XButton';

export default function HomeScreen() {
  
  return (
    <View style={{ flex: 1,  alignItems: 'center' } }>
      <View style={{width: '100%', height: '25%', backgroundColor: XColors.primary}}>
        
      </View>
      <View style={{width: '100%', paddingHorizontal: 16}}>
        <TitleGroup titleIcon='Edit' title="Information" icon="pen" onPress={() => {}} />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        //===============================================
        <TitleGroup titleIcon='Change' title="Password" icon="pen" onPress={() => {}} />
        //===============================================
        <TitleGroup  onPress={() => { } } title={"Work Details"} />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <RowInfo titleLeft='Name' titleRight='John Doe' />
        <TitleGroup  onPress={() => { } } title={"Sign In With Face ID"} />
        <XButton title='Log out' onPress={() => {}} useGradient={false} backgroundColor={XColors.primary} style={{borderRadius: 8}}/>
        <XText variant='content300' style={{textAlign: 'center', marginTop: 16}}>Version 1.0.0</XText>
      </View>
      
    </View>
  );
}
