import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import XIcon from './XIcon';
import { XColors } from '../constants/colors';
import { TextStyles } from '../constants/textStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';

interface XAppBarProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  safeArea?: boolean
}

export default function XAppBar({ title, showBack = true, onBackPress, safeArea = true}: XAppBarProps) {
  const navigation = useNavigation();
  const theme = useTheme(); 
  const insets = useSafeAreaInsets();
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      backgroundColor: '#fff',
      paddingTop: safeArea? insets.top : 0,
      paddingHorizontal: theme.spacing.lg, 
      paddingBottom: theme.spacing.md,
    },
    backBtn: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  }); 
  return (
    <View style={[styles.container]}>
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

