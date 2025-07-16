import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import XIcon from './XIcon';
import { XColors } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack } from '@/app/NavigationService';

interface XAppBarProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
  safeArea?: boolean;
}

export default function XAppBar({ title, showBack = true, onBackPress, rightIcon, safeArea = true }: XAppBarProps) {
  const insets = useSafeAreaInsets();
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      goBack();
    }
  };
  return (
    <View style={[
      styles.container,
      safeArea && { paddingTop: insets.top }
    ]}>
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <XIcon name="backArrow" color={XColors.gray800} width={20} height={20} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightIcon ? (
        <View style={styles.rightIcon}>
          {rightIcon}
        </View>
      ) : (
        <View style={styles.rightIconPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
    width: 20,
    height:20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  rightIcon: {
    padding: 8,
    marginLeft: 8,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconPlaceholder: {
    width: 32,
    height: 32,
  },
});

