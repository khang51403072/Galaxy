
// src/shared/components/XCalendar.tsx
// Responsive Calendar Component with dynamic cell sizing

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDate,
  getDay,
  format,
} from 'date-fns';
import { useTheme } from '../theme';

export type XCalendarProps = {
  onSelect: (date: Date) => void;
  selected?: Date;
  theme?: {
    primary?: string;
    background?: string;
    text?: string;
    today?: string;
  };
};

export default function XCalendar({ onSelect, selected, theme = {} }: XCalendarProps) {
  const [current, setCurrent] = useState(new Date());
  const { width: SCREEN_W } = Dimensions.get('window');
  const padding = 16;
  const gap = 4;
  const numColumns = 7;

  // Theme defaults
  const primary = theme.primary || '#3B96F6';
  const textColor = theme.text || '#333';
  const bgColor = theme.background || '#fff';
  const todayBorder = theme.today || primary;

  // Responsive cell size
  const calendarWidth = SCREEN_W - padding * 2;
  const cellSize = Math.floor((calendarWidth - gap * (numColumns - 1)) / numColumns);

  // Styles
  const styles = StyleSheet.create({
    container: {
      padding,
      backgroundColor: bgColor,
      borderRadius: 12,
      ...useTheme().shadows.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    headerText: { fontSize: 16, fontWeight: '600', color: textColor },
    weekdays: { flexDirection: 'row', marginBottom: gap },
    weekdayText: { flex: 1, textAlign: 'center', fontWeight: '600', fontSize: 12, color: textColor },
    weekRow: { flexDirection: 'row' },
    cell: {
      width: cellSize,
      height: cellSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: gap / 2,
      marginVertical: gap / 2,
    },
    dayText: { fontSize: 14, fontWeight: '400' },
  });

  // Weekday labels
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Generate days array with null placeholders
  const days = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const total = getDate(end);
    const offset = getDay(start);
    const arr: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(new Date(current.getFullYear(), current.getMonth(), d));
    while (arr.length % numColumns !== 0) arr.push(null);
    return arr;
  }, [current]);

  // Split into weeks
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += numColumns) {
    weeks.push(days.slice(i, i + numColumns));
  }

  // Render a single cell
  const renderCell = (date: Date | null, index: number) => {
    if (!date) {
      return <View key={index} style={styles.cell} />;
    }
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = dateStr == format(new Date(), 'yyyy-MM-dd');
    const isSelected = selected && dateStr == format(selected, 'yyyy-MM-dd');

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onSelect(date)}
        style={[
          styles.cell,
          isToday && { borderColor: primary, borderWidth: 2, borderRadius: 6 },
          isSelected && { backgroundColor: primary, borderRadius: 6 },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            { color: isSelected ? '#fff' : isToday ? primary : textColor },
          ]}
        >
          {getDate(date)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render component
  return (
    <View style={[styles.container, { alignItems: 'center' }]}>
      <View style={{ width: calendarWidth/2, alignSelf: 'center' }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrent(subMonths(current, 1))}>
            <Text style={{ color: primary, fontSize: 28 }}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{format(current, 'MMMM yyyy')}</Text>
          <TouchableOpacity onPress={() => setCurrent(addMonths(current, 1))}>
            <Text style={{ color: primary, fontSize: 28 }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Weekday Labels */}
        <View style={[styles.weekdays, { width: calendarWidth, alignSelf: 'center' }]}>
          {weekdays.map((w) => (
            <Text key={w} style={styles.weekdayText}>
              {w}
            </Text>
          ))}
        </View>

        {/* Day Grid */}
        {weeks.map((week, wi) => (
          <View key={wi} style={[styles.weekRow, { width: calendarWidth, alignSelf: 'center' }]}>
            {week.map((date, di) => renderCell(date, wi * numColumns + di))}
          </View>
        ))}
      </View>
    </View>
  );
}
