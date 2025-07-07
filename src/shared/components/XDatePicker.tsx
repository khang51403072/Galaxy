import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StyleProp, ViewStyle, LayoutChangeEvent, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import XIcon from './XIcon';
import { useTheme } from '../theme/ThemeProvider';
const SCREEN_WIDTH = Dimensions.get('window').width;

interface XDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  format?: (date: Date) => string;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

function formatDateToString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const XDatePicker: React.FC<XDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  minimumDate,
  maximumDate,
  format,
  label,
  style,
}) => {
  const [pickerPosition, setPickerPosition] = useState<'left' | 'right'>('left');

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    // Nếu picker nằm ở nửa phải màn hình, canh phải
    if (x + width / 2 > SCREEN_WIDTH / 2) {
      setPickerPosition('right');
    } else {
      setPickerPosition('left');
    }
  };
    const theme = useTheme();
    const styles = StyleSheet.create({
        input: {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#fff',
        },
        calendarContainer: {
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#eee',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          alignItems: 'center',
          paddingHorizontal: 0,
          minWidth: 300,
        },
        label: {
          fontSize: 14,
          color: '#222',
          marginBottom: 4,
          fontWeight: '500',
        },
      });


  const [showPicker, setShowPicker] = useState(false);

  const displayValue = value
    ? format
      ? format(value)
      : value.toLocaleDateString()
    : placeholder;
  return (
    <View style={style} onLayout={onLayout}   >
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{ color: value ? '#222' : '#888' }}>{displayValue}</Text>
          <XIcon name="downArrow" width={20} height={20} color="#222" />
        </View>
      </TouchableOpacity>
      {showPicker && (
        <View style={[styles.calendarContainer, { left: pickerPosition === 'left' ? 0 : undefined, right: pickerPosition === 'right' ? 0 : undefined }]}>
          <Calendar
            current={value ? formatDateToString(value) : undefined}
            minDate={minimumDate ? formatDateToString(minimumDate) : undefined}
            maxDate={maximumDate ? formatDateToString(maximumDate) : undefined}
            onDayPress={(day: { year: number; month: number; day: number }) => {
              const selected = new Date(day.year, day.month - 1, day.day);
              onChange(selected);
              setShowPicker(false);
            }}
            markedDates={
              value
                ? {
                    [formatDateToString(value)]: {
                      selected: true,
                      selectedColor: '#2563eb',
                    },
                  }
                : undefined
            }
            theme={{
              selectedDayBackgroundColor: '#2563eb',
              todayTextColor: '#2563eb',
              arrowColor: '#2563eb',
              textDayFontWeight: '500',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>
      )}
    </View>
  );
};



export default XDatePicker; 