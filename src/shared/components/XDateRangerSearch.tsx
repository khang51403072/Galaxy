import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { XDatePicker } from './XDatePicker';
import XIcon from './XIcon';

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
  return (
    <View style={[styles.container, style]}>
      <XDatePicker
        label={labelFrom}
        value={fromDate}
        onChange={onFromChange}
        style={styles.datePicker}
      />
      <XDatePicker
        label={labelTo}
        value={toDate}
        onChange={onToChange}
        style={[styles.datePicker, { width: '40%' }]}
      />
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={onSearch}
        activeOpacity={0.7}
      >
        <XIcon name="search" width={24} height={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  datePicker: {
    flex: 1,
  },
  searchBtn: {
    height: 40,
    width: 40,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default XDateRangerSearch; 