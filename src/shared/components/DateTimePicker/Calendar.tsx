import React from 'react';
import { View } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import MonthView from './MonthView';
import DayView from './DayView';
import { CalendarProvider, CalendarViews, useCalendarContext } from './calendarContext';
import YearView from './YearView';
import TimeView from './TimeView'; // New import
import dayjs from 'dayjs'
interface MySimpleCalendarProps {
  initialDate?: Date;
  onDateChange: (date: dayjs.Dayjs) => void;
  initCalendarView: CalendarViews
}
const CalendarView : Record<CalendarViews, React.ReactNode> =  {
  day: <DayView/>,
  month: <MonthView/>,
  year: <YearView/>,
  time: <TimeView/>
} 
const MySimpleCalendar: React.FC = () => {
  const {
    currentView,
    styles
  } = useCalendarContext()

  return (
    <View style={styles.calendarContainer}>
      <CalendarHeader/>
      {CalendarView[currentView]}
    </View>
  );
};
export const XCalendar = ({onDateChange, initCalendarView}:MySimpleCalendarProps) => <CalendarProvider mode={initCalendarView} onDateChange={onDateChange}>
  <MySimpleCalendar/>
</CalendarProvider>