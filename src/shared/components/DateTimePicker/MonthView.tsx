// src/components/calendar/MonthView.tsx
import React, { memo } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { months, useCalendarContext } from './calendarContext';
import SwipeableGridView from './SwipeableGridView';
import XText from '../XText';
import { XRow } from '../XRow';

const MonthGrid = () => {
  const { displayDate: displayMonth, handleSelectMonth, styles, theme } = useCalendarContext();
  const currentMonthIndex = displayMonth.month();
  
  return (
    <XRow gap={theme.spacing.sm} align='center' justify='center' style={styles.monthViewContainer}>
      {months.map((month, index) => {
        const isSelected = index === currentMonthIndex;
        return (
          <Pressable
            key={month}
            style={[styles.monthCellContainer, isSelected && styles.selectedMonth]}
            onPress={() => handleSelectMonth(index)}
          >
            <XText variant='bodyMedium' color={isSelected ? theme.colors.white : theme.colors.gray800}>
              {month}
            </XText>
          </Pressable>
        );
      })}
    </XRow>
  );
};

const MonthView = () => {
  const { displayDate, setDisplayDate } = useCalendarContext();
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - 30;

  return (
    <SwipeableGridView
      displayDate={displayDate}
      setDisplayDate={setDisplayDate}
      containerWidth={containerWidth}
      renderGrid={(date) => <MonthGrid />}
      unit="year" // Swipe theo năm
    />
  );
};

export default memo(MonthView);