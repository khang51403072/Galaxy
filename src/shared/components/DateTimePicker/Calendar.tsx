import React, { memo, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import MonthView from './MonthView';
import DayView from './DayView';
import { CalendarProvider, useCalendarContext } from './calendarContext';
import YearView from './YearView';
import { useTheme } from '@/shared/theme';

interface MySimpleCalendarProps {
  initialDate?: Date;
}

const CalendarInternal: React.FC<MySimpleCalendarProps> = () => {
  const {
    currentView,
    styles
  } = useCalendarContext()
  
  const map = useMemo(
    () => ({
      "day": <DayView />,
      "month": <MonthView />,
      "year": <YearView />
    }
    ), [])
  return (
    
    <View style={styles.calendarContainer}>
      {/* 3. DỰA VÀO `currentView` ĐỂ RENDER GIAO DIỆN PHÙ HỢP */}
      <CalendarHeader />
      {map[currentView]}
    </View>
  );
};



export const XCalendar = () => <CalendarProvider>
  <CalendarInternal/>
</CalendarProvider>