import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { XDatePicker } from './XDatePicker';
import XIcon from './XIcon';
import { useTheme } from '../theme';

interface Props {
  fromDate: Date;
  toDate: Date;
  onFromChange: (date: Date) => void;
  onToChange: (date: Date) => void;
  onSearch: () => void;
  labelFrom?: string;
  labelTo?: string;
  style?: ViewStyle;
}

const XDateRangerSearch: React.FC<Props> = ({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  onSearch,
  labelFrom = 'From Date',
  labelTo = 'To Date',
  style
}) => {
  const theme = useTheme();
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'flex-end',
    },
    datePicker: {
      flex: 1,
    },
    searchBtn: {
      height: 40,
      width: 40,
      borderRadius: theme.spacing.sm,
      backgroundColor: theme.colors.primaryMain,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }), [theme.spacing.sm, theme.colors.primaryMain]);
  return (
    <View style={[styles.container, style]}>
      <XDatePicker
        label={labelFrom}
        value={fromDate}
        onChange={onFromChange}
        style={styles.datePicker}
        maxDate={toDate}
      />
      <XDatePicker
        label={labelTo}
        value={toDate}
        onChange={onToChange}
        style={[styles.datePicker, { width: '40%' }]}
        minDate={fromDate}
      />
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={onSearch}
        activeOpacity={0.7}
      >
        <XIcon name="search" width={24} height={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};



export default XDateRangerSearch; 