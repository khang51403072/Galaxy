import { Pressable, StyleSheet, View } from "react-native"
import { StyleProps } from "react-native-reanimated"
import XText from "../XText"
import dayjs from 'dayjs';
import { memo } from "react";
import { useCalendarContext } from "./calendarContext";
import { XRow } from "../XRow";

const header = () => {
    const { 
      displayDate: displayMonth, yearMatrix, currentView, theme, styles,
      handlePrev, handleNext, handleDayHeaderPress,  
      handleMonthHeaderPress, handleYearHeaderPress, handleTimeHeaderPress, 
    } = useCalendarContext()
    
    return <XRow align="center" justify="space-between" gap={theme.spacing.sm} style={styles.calendarHeader}>
        <Pressable onPress={handlePrev}>
            <XText variant="headingMedium" color={theme.colors.white}>{'<'}</XText>
        </Pressable>

        <XRow align="center" justify="center" gap={theme.spacing.sm}>
        {currentView === 'day' && (
          <>
            <Pressable onPress={handleMonthHeaderPress}>
              <XText variant="titleMedium" color={theme.colors.white}>
                {displayMonth.format('MMMM')}
              </XText>
            </Pressable>
            <Pressable onPress={handleYearHeaderPress}>
              <XText variant="titleMedium" color={theme.colors.white}>
                {displayMonth.format('YYYY')}
              </XText>
            </Pressable>
            {/* New: Time display and press */}
            <Pressable onPress={handleTimeHeaderPress}>
              <XText variant="titleMedium" color={theme.colors.white}>
                {displayMonth.format('hh:mm A')}
              </XText>
            </Pressable>
          </>
        )}
        {currentView === 'month' && (
          <Pressable onPress={handleDayHeaderPress}>
            <XText variant="titleMedium" color={theme.colors.white}>
              {displayMonth.format('YYYY')}
            </XText>
          </Pressable>
        )}
        {currentView === 'year' && (
            <Pressable onPress={handleDayHeaderPress}>
            <XText variant="titleMedium" color={theme.colors.white}>
                {`${yearMatrix[0][0]} - ${yearMatrix[yearMatrix.length - 1][yearMatrix[yearMatrix.length-1].length-1] }`}
            </XText>
          </Pressable>
          
        )}
        {currentView === 'time' && (
            <Pressable onPress={handleDayHeaderPress}>
            <XText variant="titleMedium" color={theme.colors.white}>
                {`${displayMonth.format("ddd, DD/MM/YYYY    hh:mm:ss A")}`}
            </XText>
          </Pressable>
          
        )}
      </XRow>

        <Pressable onPress={handleNext}>
            <XText variant="headingMedium" color={theme.colors.white}>{'>'}</XText>
        </Pressable>
    </XRow>
}

export const CalendarHeader = memo(header)