
// src/shared/components/XCalendar.tsx
// Responsive Calendar Component with dynamic cell sizing

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDate,
  getDay,
  format,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { useTheme } from '../theme';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

export type XCalendarProps = {
  onSelect: (date: Date) => void;
  selected?: Date;
  minDate?: Date;
  maxDate?: Date;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NUM_COLUMNS = 7;
const SWIPE_THRESHOLD = 20; // px
const ANIMATION_DURATION = 220;

export default function XCalendar({ onSelect, selected, minDate, maxDate }: XCalendarProps) {
  const [current, setCurrent] = useState(new Date());
  const { width: SCREEN_W } = Dimensions.get('window');
  const theme = useTheme();
  const padding = theme.spacing.md;
  const gap = theme.spacing.xs;
  const calendarWidth = SCREEN_W - padding * 2;
  const cellSize = Math.floor((calendarWidth - gap * (NUM_COLUMNS - 1)) / NUM_COLUMNS);

  // Animation state
  const translateX = useRef(new Animated.Value(0)).current;
  const directionRef = useRef(0); // -1: prev, 1: next
  const [animating, setAnimating] = useState(false);

  // Memoized styles
  const styles = useMemo(() =>
    StyleSheet.create({
      container: {
        padding,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        ...theme.shadows.md,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        alignSelf: 'center',
        width: '60%',
        minWidth: 200,
        maxWidth: 400,
      },
      headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
      },
      navBtn: {
        padding: theme.spacing.xs,
      },
      weekdays: {
        flexDirection: 'row',
        marginBottom: gap,
        width: '100%',
        alignSelf: 'center',
      },
      weekdayText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 12,
        color: theme.colors.textSecondary,
      },
      weekRow: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
      },
      cell: {
        width: cellSize,
        height: cellSize,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: gap / 2,
        marginVertical: gap / 2,
        borderRadius: theme.borderRadius.md,
      },
      dayText: {
        fontSize: 14,
        fontWeight: '400',
      },
    }),
    [theme, calendarWidth, cellSize, gap, padding]
  );

  // Memoized weeks (days split into weeks)
  const weeks = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const total = getDate(end);
    const offset = getDay(start);
    const arr: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(new Date(current.getFullYear(), current.getMonth(), d));
    while (arr.length % NUM_COLUMNS !== 0) arr.push(null);
    const result: (Date | null)[][] = [];
    for (let i = 0; i < arr.length; i += NUM_COLUMNS) {
      result.push(arr.slice(i, i + NUM_COLUMNS));
    }
    return result;
  }, [current]);

  const isDateDisabled = (date: Date) => {
    if (minDate && date < startOfDay(minDate)) return true;
    if (maxDate && date > endOfDay(maxDate)) return true;
    return false;
  };

  // Render cell (memoized)
  const renderCell = useCallback(
    (date: Date | null, index: number) => {
      if (!date) {
        return <View key={index} style={styles.cell} accessibilityElementsHidden />;
      }
      const dateStr = format(date, 'yyyy-MM-dd');
      const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
      const isSelected = selected && dateStr === format(selected, 'yyyy-MM-dd');
      const disabled = isDateDisabled(date);
      return (
        <TouchableOpacity
          key={index}
          onPress={() => !disabled && onSelect(date)}
          style={[
            styles.cell,
            isToday && {
              borderColor: theme.colors.primary,
              borderWidth: 2,
              borderRadius: theme.borderRadius.full,
            },
            isSelected && {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.full,
            },
            disabled && { opacity: 0.3 },
          ]}
          activeOpacity={disabled ? 1 : 0.7}
          accessibilityLabel={
            isToday
              ? isSelected
                ? `Hôm nay, ngày ${getDate(date)} được chọn`
                : `Hôm nay, ngày ${getDate(date)}`
              : isSelected
              ? `Ngày ${getDate(date)} được chọn`
              : `Ngày ${getDate(date)}`
          }
          accessibilityRole="button"
          disabled={disabled}
        >
          <Text
            style={[
              styles.dayText,
              { color: isSelected ? theme.colors.textButton : isToday ? theme.colors.primary : theme.colors.text },
            ]}
          >
            {getDate(date)}
          </Text>
        </TouchableOpacity>
      );
    },
    [selected, onSelect, styles, theme, minDate, maxDate]
  );

  // Render header
  const handleChangeMonth = useCallback((dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    directionRef.current = dir;
    Animated.timing(translateX, {
      toValue: dir * -calendarWidth,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setCurrent((prev) => (dir === 1 ? addMonths(prev, 1) : subMonths(prev, 1)));
      translateX.setValue(dir * calendarWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => setAnimating(false));
    });
  }, [animating, calendarWidth, translateX]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => handleChangeMonth(-1)}
        style={styles.navBtn}
        accessibilityLabel="Chuyển sang tháng trước"
        accessibilityRole="button"
        disabled={animating}
      >
        <Text style={{ color: theme.colors.primary, fontSize: 28 }}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>{format(current, 'MMMM yyyy')}</Text>
      <TouchableOpacity
        onPress={() => handleChangeMonth(1)}
        style={styles.navBtn}
        accessibilityLabel="Chuyển sang tháng sau"
        accessibilityRole="button"
        disabled={animating}
      >
        <Text style={{ color: theme.colors.primary, fontSize: 28 }}>›</Text>
      </TouchableOpacity>
    </View>
  );

  // Render weekday labels
  const renderWeekdays = () => (
    <View style={styles.weekdays}>
      {WEEKDAYS.map((w) => (
        <Text key={w} style={styles.weekdayText} accessibilityElementsHidden>
          {w}
        </Text>
      ))}
    </View>
  );

  // Render weeks grid
  const renderGrid = () => (
    <Animated.View style={{ transform: [{ translateX }] }}>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((date, di) => renderCell(date, wi * NUM_COLUMNS + di))}
        </View>
      ))}
    </Animated.View>
  );

  // Gesture handlers
  const onGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (animating) return;
    translateX.setValue(event.nativeEvent.translationX);
  }, [animating, translateX]);

  const onHandlerStateChange = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (animating) return;
    const { translationX, state } = event.nativeEvent;
    if (state === State.END) {
      if (translationX < -SWIPE_THRESHOLD) {
        handleChangeMonth(1);
      } else if (translationX > SWIPE_THRESHOLD) {
        handleChangeMonth(-1);
      } else {
        // Snap back if not enough swipe
        Animated.timing(translateX, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [animating, handleChangeMonth, translateX]);

  // Render component
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-5, 5]}
      failOffsetY={[-20, 20]}
      enabled={!animating}
    >
      <View style={styles.container}>
        {renderHeader()}
        {renderWeekdays()}
        {renderGrid()}
      </View>
    </PanGestureHandler>
  );
}
