import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import XIcon, { iconMap } from './XIcon';
import XText from './XText';
import { useTheme } from '../theme';

interface XNoDataViewProps {
  message?: string;
  iconName?: keyof typeof iconMap;
  iconSize?: number;
  style?: ViewStyle;
}

const XNoDataView: React.FC<XNoDataViewProps> = ({
  message = 'No data',
  iconName = 'noData',
  iconSize = 48,
  style,
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { paddingTop: theme.spacing.xxxl }, style]}>
      <XIcon name={iconName} width={iconSize} height={iconSize} />
      <XText variant="headingRegular" style={styles.text}>{message}</XText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    textAlign: 'center',
  },
});

export default XNoDataView; 