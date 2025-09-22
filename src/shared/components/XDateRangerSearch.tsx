import React, { memo, useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import { XDatePicker } from './XDatePicker';
import XIcon from './XIcon';
import { useTheme } from '../theme';
import { XRow } from './XRow';
import XText from './XText';
import { XColumn } from './XColumn';

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

const XDateRangerSearch = memo(({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  onSearch,
  labelFrom = 'From',
  labelTo = 'To',
  style
}: Props) => {
  const theme = useTheme();
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'stretch', 
    },
    datePicker: {
      flex: 1,
    },
    searchBtn: {
      borderRadius: theme.spacing.sm,
      backgroundColor: theme.colors.primaryMain,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }), [theme]);

  const handleButtonLayout =  useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && buttonWidth !== height) {
      setButtonWidth(height);
    }
  }, [buttonWidth]);
  return (
    <XColumn>
        <XRow>
        <XText style={{flex: 1}}>{labelFrom}</XText>
        <XText style={{flex: 1}}>{labelTo}</XText>
        <XText style={{width: buttonWidth}}></XText>
        </XRow>
        <XRow style={[styles.container, style]}>
          <XDatePicker
            value={fromDate}
            onChange={onFromChange}
            style={styles.datePicker}
            maxDate={toDate}
          />
          <XDatePicker
            value={toDate}
            onChange={onToChange}
            style={[styles.datePicker]}
            minDate={fromDate}
          />
          <TouchableOpacity
            onPress={onSearch}
            activeOpacity={0.7}
            onLayout={handleButtonLayout}
            style={[styles.searchBtn, { width: buttonWidth }]}
          >
            <XIcon name="search" width={24} height={24} color={theme.colors.white} />
          </TouchableOpacity>
        </XRow>
    </XColumn>
    
  );
});



export default XDateRangerSearch; 