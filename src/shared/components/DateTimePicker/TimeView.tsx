// src/components/calendar/timeView.tsx

import React, { memo, useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useCalendarContext } from './calendarContext';
import { getHourOptions, getMinuteOptions, getPeriodOptions } from './util';
import WheelPicker, { PickerItemType } from './WheelPicker'; // Import component mới

// ...

const TimeView = () => {
  const { selectedDate, handleSelectTime, theme } = useCalendarContext();

  const initialHour = selectedDate.hour() % 12 || 12;
  const initialMinute = selectedDate.minute();
  const initialPeriod = selectedDate.hour() >= 12 ? 'PM' : 'AM';

  // --- DÙNG useCallback ĐỂ ỔN ĐỊNH CÁC HÀM HANDLER ---
  const handleHourChange = useCallback((newHour: PickerItemType) => {
    // Lấy minute và period hiện tại từ selectedDate để đảm bảo tính nhất quán
    const currentMinute = selectedDate.minute();
    const currentPeriod = selectedDate.hour() >= 12 ? 'PM' : 'AM';
    handleSelectTime(parseInt(newHour.toString()) , currentMinute, currentPeriod);
  }, [handleSelectTime, selectedDate]);

  const handleMinuteChange = useCallback((newMinute: PickerItemType) => {
    const currentHour = selectedDate.hour() % 12 || 12;
    const currentPeriod = selectedDate.hour() >= 12 ? 'PM' : 'AM';
    handleSelectTime(currentHour, parseInt(newMinute.toString()), currentPeriod);
  }, [handleSelectTime, selectedDate]);

  const handlePeriodChange = useCallback((newPeriod: PickerItemType) => {
    const currentHour = selectedDate.hour() % 12 || 12;
    const currentMinute = selectedDate.minute();
    handleSelectTime(currentHour, currentMinute, newPeriod as ("AM"|"PM"));
  }, [handleSelectTime, selectedDate]);

  return (
    <View style={styles.container}>
      <WheelPicker
        items={getHourOptions()}
        selectedValue={initialHour}
        onValueChange={handleHourChange}
      />
      <Text style={styles.separator}>:</Text>
      <WheelPicker
        items={getMinuteOptions()}
        selectedValue={initialMinute}
        onValueChange={handleMinuteChange}
      />
      <Text style={styles.separator}>:</Text>
      <WheelPicker
        items={getPeriodOptions()}
        selectedValue={initialPeriod}
        onValueChange={handlePeriodChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

export default memo(TimeView);