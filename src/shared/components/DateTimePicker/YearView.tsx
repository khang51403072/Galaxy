// src/components/calendar/YearView.tsx
import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useCalendarContext } from './calendarContext';
import { getYearMatrix } from './util';
import SwipeableGridView from './SwipeableGridView';
import dayjs from "dayjs"
import XText from '../XText';
import { useTheme } from '@/shared/theme';
import { XRow } from '../XRow';

const YearGrid = ({ date }: { date: dayjs.Dayjs }) => {
  const { displayDate: displayMonth, handleSelectYear,styles } = useCalendarContext();
  const yearMatrix = getYearMatrix(date);
  const currentYear = displayMonth.year();
  const theme = useTheme()
  
  return (
    <XRow align='center' justify='center' style={styles.yearViewContainer}>
      {yearMatrix.map((row, rowIndex) => (
        <XRow gap={theme.spacing.sm} key={rowIndex}>
          {row.map(year => {
            const isSelected = year === currentYear;
            return (
              <Pressable
                key={year}
                style={[styles.yearCellContainer, isSelected && styles.selectedYearContainer]}
                onPress={() => handleSelectYear(year)}
              >
                <XText variant='bodyMedium' color={isSelected ? theme.colors.white : theme.colors.gray800}>
                  {year}
                </XText>
              </Pressable>
            );
          })}
        </XRow>
      ))}
    </XRow>
  );
};

const YearView = () => {
  const { displayDate, setDisplayDate } = useCalendarContext();
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - 30;

  return (
    <SwipeableGridView
      displayDate={displayDate}
      setDisplayDate={setDisplayDate}
      containerWidth={containerWidth}
      renderGrid={(date) => <YearGrid date={date} />}
      unit="yearGroup"
      step={12} // Swipe theo nhóm 12 năm
    />
  );
};

export default memo(YearView);