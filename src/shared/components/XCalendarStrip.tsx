import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, StyleProp, ViewStyle, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import XText from './XText';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SCREEN_WIDTH = Dimensions.get('window').width;

interface XCalendarStripProps {
  value: Date;
  onChange: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getMonthName(date: Date) {
  return date.toLocaleString('default', { month: 'long' });
}

export const XCalendarStrip: React.FC<XCalendarStripProps> = ({ value, onChange, style }) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [displayMonth, setDisplayMonth] = useState(getStartOfWeek(value));

  // Tìm tuần chứa ngày đang chọn
  const startOfWeek = getStartOfWeek(value);

  // Tạo mảng các tuần để scroll (hiển thị 5 tuần quanh ngày đang chọn)
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let w = -2; w <= 2; w++) {
      const weekStart = addDays(startOfWeek, w * 7);
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(addDays(weekStart, i));
      }
      result.push(week);
    }
    return result;
  }, [startOfWeek]);

  const currentWeekIndex = 2;

  // Scroll đến tuần hiện tại khi mount hoặc khi tuần thay đổi
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: currentWeekIndex * SCREEN_WIDTH, animated: false });
    }
    setDisplayMonth(getStartOfWeek(value));
  }, [currentWeekIndex, weeks.length, value]);

  // Khi chọn ngày, nếu tháng khác thì cập nhật displayMonth
  const handleSelectDay = (d: Date) => {
    if (d.getMonth() !== displayMonth.getMonth() || d.getFullYear() !== displayMonth.getFullYear()) {
      setDisplayMonth(getStartOfWeek(d));
    }
    onChange(d);
  };

  // Khi scroll sang tuần mới, nếu tháng khác thì cập nhật displayMonth
  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const week = weeks[page];
    if (week && (week[0].getMonth() !== displayMonth.getMonth() || week[0].getFullYear() !== displayMonth.getFullYear())) {
      setDisplayMonth(week[0]);
    }
  };

  // Tính width cho mỗi cột để vừa khít SCREEN_WIDTH
  const colWidth = Math.floor(SCREEN_WIDTH / 7);

  return (
    <View style={[styles.container, style]}>
      {/* Month cố định */}
      <XText variant="dateSelectorMonth" style={[{ color: theme.colors.primary, marginBottom: 8 }]}> 
        {getMonthName(displayMonth)}
      </XText>
      {/* Weekday cố định */}
      <View style={[styles.weekRow, { width: SCREEN_WIDTH }]}> 
        {WEEK_DAYS.map((wd, idx) => (
          <XText
            variant="dateSelectorWeekDay"
            key={wd}
            style={[styles.weekDay, { width: colWidth }]}
          >
            {wd}
          </XText>
        ))}
      </View>
      {/* Hàng ngày scroll ngang */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ width: SCREEN_WIDTH }}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {weeks.map((week, wIdx) => (
          <View key={wIdx} style={[styles.weekRow, { width: SCREEN_WIDTH }]}> 
            {week.map((d, idx) => {
              const isSelected =
                value.getFullYear() === d.getFullYear() &&
                value.getMonth() === d.getMonth() &&
                value.getDate() === d.getDate();
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dayCell, { width: colWidth }, ]}
                  onPress={() => handleSelectDay(d)}
                  activeOpacity={0.7}
                >
                  <View style={{ alignItems: 'center', justifyContent: 'center', width: colWidth*0.6, height: colWidth*0.6, backgroundColor: isSelected ? theme.colors.primary : 'transparent', borderRadius: colWidth }}>
                    <XText variant="dateSelectorDay"
                      style={[
                        styles.dayText,
                        isSelected && { color: '#fff', },
                      ]}
                    >
                      {d.getDate()}
                    </XText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 0,
    paddingVertical: 8,
  },
  weekRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4,
  },
  weekDay: {
    textAlign: 'center',
    color: '#6C6C6C',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    // width set inline
    // height set by aspectRatio of parent row
  },
  dayText: {
    color: '#464646',
  },
});

export default XCalendarStrip; 