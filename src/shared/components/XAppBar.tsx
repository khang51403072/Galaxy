import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import XIcon from './XIcon';
import { XColors } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack } from '@/app/NavigationService';
import { useTheme } from '../theme/ThemeProvider';
import XText from './XText';

interface XAppBarProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
  safeArea?: boolean;
}

export default function XAppBar({ title, showBack = true, onBackPress, rightIcon, safeArea = true }: XAppBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.white,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backBtn: {
      width: theme.spacing.md,
      height:theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      textAlign: 'center',
    },
    rightIcon: {
      width: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightIconPlaceholder: {
      width: theme.spacing.lg,
      height: theme.spacing.lg,
    },
  });
  
  
  
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
      <XText variant="title" style={styles.title} numberOfLines={1}>{title}</XText>
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

