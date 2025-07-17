// XCalendar - Simple Responsive Calendar Component
// -----------------------------------------------
// Author: GalaxyMe Team
//
// Cách sử dụng:
//   <XCalendar
//     onSelect={date => ...}
//     selected={selectedDate}
//     theme={{ primary: '#3B96F6', background: '#fff', text: '#333', today: '#3B96F6' }}
//   />
// Props:
//   - onSelect: (date: Date) => void  // callback khi chọn ngày
//   - selected: Date | undefined      // ngày đang chọn
//   - theme: { primary, background, text, today } // tuỳ chỉnh màu sắc
//
// Ghi chú:
// - Có thể custom style, shadow, font, spacing bằng cách sửa trong file này.
// - Đảm bảo cellSize, margin, padding đồng bộ để các cột luôn thẳng hàng.
// - Để thêm tính năng (ví dụ: disable ngày, highlight range, ...), chỉnh trong renderCell.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { addMonths, subMonths, startOfMonth, endOfMonth,
         getDate, getDay, format } from 'date-fns';
import { useTheme } from '../theme';

// Kiểu props cho XCalendar
// onSelect: callback khi chọn ngày
// selected: ngày đang chọn
// theme: tuỳ chỉnh màu sắc
//
type XCalendarProps = {
  onSelect: (date: Date) => void;
  selected?: Date;
  theme?: {
    primary?: string;
    background?: string;
    text?: string;
    today?: string;
  };
};

export default function XCalendar({
  onSelect,
  selected,
  theme = {},
}: XCalendarProps) {
  // State tháng hiện tại
  const [current, setCurrent] = useState(new Date());
  // Màu sắc
  const primary = theme.primary || '#3B96F6';
  const textColor = theme.text || '#333';
  const xtheme = useTheme();

  // StyleSheet (dùng theme/shadow toàn app)
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      ...xtheme.shadows.md
    },
    header: {
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginBottom: 8
    },
    headerText: { fontSize: 16, fontWeight: 'bold' },
    weekdays: { flexDirection:'row', justifyContent: 'center' },
    weekdayText: { textAlign:'center', fontWeight:'600', fontSize: 13 },
    cell: {
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 36,
      maxWidth: 60,
      backgroundColor: '#fff',
      // width: cellSize // set inline!
    },
    cellText: { fontSize: 15, fontFamily: 'System' }
  });

  // 1. Weekday labels (CN, T2, ...)
  const weekdays = ['CN','T2','T3','T4','T5','T6','T7'];

  // 2. Generate calendar cells (bao gồm cả cell null ở đầu/cuối)
  const days = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const total = getDate(end);
    const offset = getDay(start); // 0=CN,1=T2...
    const cells: (Date | null)[] = [];

    // blank slots trước ngày 1
    for (let i=0; i<offset; i++) cells.push(null);
    // actual days trong tháng
    for (let d=1; d<=total; d++) {
      cells.push(new Date(current.getFullYear(), current.getMonth(), d));
    }
    // blank slots sau ngày cuối tháng (để đủ 6 hàng)
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [current]);

  // 3. Chia days thành các tuần (mỗi tuần 7 ngày)
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // 4. Render một cell ngày (hoặc cell trống)
  const renderCell = ({ item, index }: { item: Date | null, index: number }) => {
    if (!item) return <View style={[styles.cell, { width: cellSize, backgroundColor: 'transparent', marginHorizontal: 2 }]} />;
    const isToday = format(item, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const isSelected = selected && format(item,'yyyy-MM-dd') === format(selected,'yyyy-MM-dd');
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          { width: cellSize, marginHorizontal: 2 },
          isToday && { borderColor: primary, borderWidth: 1 },
          isSelected && { backgroundColor: primary, borderRadius: 999, borderWidth: 0 },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.cellText,
          { color: isSelected ? '#fff' : isToday ? primary : textColor, fontWeight: isToday ? 'bold' : 'normal' }
        ]}>
          {getDate(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  // 5. Responsive cell size
  const numColumns = 7;
  const screenWidth = Math.min(400, Dimensions.get('window').width) - 16 + 4; // bù marginHorizontal
  const cellSize = Math.floor((screenWidth - (numColumns - 1) * 4) / numColumns);

  // 6. Render
  return (
    <View style={[styles.container, { backgroundColor: theme.background || xtheme.colors.white }]}> 
      {/* Header: Month & Nav */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrent(subMonths(current,1))}>
          <Text style={{ color: primary, fontSize: 18 }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: textColor }]}> 
          {format(current, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={() => setCurrent(addMonths(current,1))}>
          <Text style={{ color: primary, fontSize: 18 }}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays row + Dates grid đồng bộ */}
      <View style={{ width: screenWidth, alignSelf: 'center' }}>
        {/* Weekday header dùng map giống grid */}
        <View style={{ flexDirection: 'row' }}>
          {weekdays.map((w, idx) => (
            <View key={w} style={[styles.cell, { width: cellSize, marginHorizontal: 2, backgroundColor: 'transparent' }]}> 
              <Text style={[styles.weekdayText, { color: textColor }]}>{w}</Text>
            </View>
          ))}
        </View>
        {/* Day grid */}
        {weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: 'row' }}>
            {week.map((item, di) => renderCell({ item, index: wi * 7 + di }))}
          </View>
        ))}
      </View>
    </View>
  );
}


