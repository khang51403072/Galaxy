// src/components/calendar/DayView.tsx
import React, { memo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useCalendarContext } from './calendarContext';
import { getMonthMatrix } from './util';
import XText from "../XText";
import { XRow } from "../XRow";
import DayCell from "./DayCell";
import SwipeableGridView from './SwipeableGridView';
import dayjs from "dayjs"
import { useTheme } from '@/shared/theme';
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


const MonthGrid = memo(({date}:{date: dayjs.Dayjs}) => {
  const matrix = getMonthMatrix(date);
  const {selectedDate, styles} = useCalendarContext();
  const theme = useTheme()
  
  return (
    <>
      <XRow>
        {weekdays.map(day => <XText variant='titleMedium' color={theme.colors.primaryMain} key={day} style={styles.weekDayText}>{day}</XText>)}
      </XRow>
      <View>
        {matrix.map((week, weekIndex) => (
          <XRow key={weekIndex}>
            {week.map((day, dayIndex) => {
              const dayKey = day ? day.format('YYYY-MM-DD') : `empty-${weekIndex}-${dayIndex}`;
              const isSelected = day?.isSame(selectedDate, 'day') ?? false;
              return <DayCell key={dayKey} day={day} isSelected={isSelected} />;
            })}
          </XRow>
        ))}
      </View>
    </>
  );
});

const DayView = () => {
  const { displayDate, styles, setDisplayDate } = useCalendarContext();
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - 30;
  
  return (
    <View style={[styles.dayViewContainer, { width: containerWidth }]}>
      <SwipeableGridView
        displayDate={displayDate}
        setDisplayDate={setDisplayDate}
        containerWidth={containerWidth}
        renderGrid={(date)=><MonthGrid date={date}/>}
        unit="month"
      />
    </View>
  );
};

export default memo(DayView);