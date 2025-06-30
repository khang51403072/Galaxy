import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import XIcon from './XIcon';
import { useNavigation, useTheme } from '@react-navigation/native';
import { XColors } from '../constants/colors';
import { TextStyles } from '../constants/textStyles';
interface XAppBarProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

export default function XAppBar({ title, showBack = true, onBackPress }: XAppBarProps) {
  const navigation = useNavigation();
  const theme = useTheme(); 
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity   onPress={handleBack} style={styles.backBtn} >
          <XIcon name="backArrow"  color={XColors.gray800} width={20} height={20} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={[,{alignItems: 'center', textAlign: 'center', flex:1},TextStyles.title, ]} numberOfLines={1}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  backBtn: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
}); 