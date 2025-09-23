import React, { memo, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import MonthView from './MonthView';
import DayView from './DayView';
import { CalendarProvider, useCalendarContext } from './calendarContext';
import YearView from './YearView';
import TimeView from './TimeView'; // New import
import dayjs from 'dayjs'
import { XRow } from '../XRow';
interface MySimpleCalendarProps {
  initialDate?: Date;
  onDateChange: (date: dayjs.Dayjs) => void;
}

const MySimpleCalendar: React.FC = () => {
  const {
    currentView,
    styles
  } = useCalendarContext()

   
  const map = useMemo(
    () => ({
      "day": <DayView/>,
      "month": <MonthView/>,
      "year": <YearView/>,
      "time": <TimeView/>
    }
  ),[])

  const calendarView = useMemo(
    () => {
      switch(currentView){
        case "day": return <DayView/>;
        case "month": return <MonthView/>;
        case "year": return <YearView/>;
        case "time": return <TimeView/>;
        default: return <TimeView/>;
      }
    },[currentView]
  ) 
  return (
    
    <View style={styles.calendarContainer}>
      {/* 3. DỰA VÀO `currentView` ĐỂ RENDER GIAO DIỆN PHÙ HỢP */}
      <CalendarHeader/>
      <XRow align='center' justify='center'>{calendarView}</XRow>
    </View>
  );
};




export const XCalendar = ({onDateChange}:MySimpleCalendarProps) => <CalendarProvider onDateChange={onDateChange}>
  <MySimpleCalendar/>
</CalendarProvider>