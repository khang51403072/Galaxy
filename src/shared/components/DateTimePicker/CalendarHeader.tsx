import { Pressable, StyleSheet, View } from "react-native"
import { StyleProps } from "react-native-reanimated"
import XText from "../XText"
import dayjs from 'dayjs';
import { memo, useMemo } from "react";
import { useCalendarContext } from "./calendarContext";
import { useTheme } from "@/shared/theme";
import { XRow } from "../XRow";

const header = () => {
  const {
    displayDate: displayMonth, currentView, yearMatrix, styles, theme,
    handlePrev, handleNext, handleDayHeaderPress, handleMonthHeaderPress, handleYearHeaderPress
  } = useCalendarContext()

  
  return <XRow justify="space-between" align="center" style={styles.calendarHeader}>
    <Pressable onPress={handlePrev}>
      <XText variant="headingMedium" color={theme.colors.primaryMain}>{'<'}</XText>
    </Pressable>

    <XRow align="center" justify="center" gap={theme.spacing.sm}>
      {currentView === 'day' && (
        <>
          <Pressable onPress={handleMonthHeaderPress}>
            <XText variant="titleMedium" color={theme.colors.primaryMain}>
              {displayMonth.format('MMMM')}
            </XText>
          </Pressable>
          <Pressable onPress={handleYearHeaderPress}>
            <XText variant="titleMedium" color={theme.colors.primaryMain}>
              {displayMonth.format('YYYY')}
            </XText>
          </Pressable>
        </>
      )}
      {currentView === 'month' && (
        <Pressable  onPress={handleDayHeaderPress}>
          <XText color={theme.colors.primaryMain} variant="titleMedium">
            {displayMonth.format('YYYY')}
          </XText>
        </Pressable>
      )}
      {currentView === 'year' && (
        <Pressable onPress={handleDayHeaderPress}>
          <XText color={theme.colors.primaryMain} variant="titleMedium">
            {`${yearMatrix[0][0]} - ${yearMatrix[yearMatrix.length - 1][yearMatrix[yearMatrix.length - 1].length - 1]}`}
          </XText>
        </Pressable>

      )}
    </XRow>

    <Pressable onPress={handleNext}>
      <XText variant="headingMedium" color={theme.colors.primaryMain}>{'>'}</XText>
    </Pressable>
  </XRow>
}

export const CalendarHeader = memo(header)


