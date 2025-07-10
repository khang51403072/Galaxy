import React, { useState, useRef, useEffect, RefObject } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StyleProp, ViewStyle, LayoutChangeEvent, Dimensions, ScrollView, Modal, UIManager, findNodeHandle } from 'react-native';
import { Calendar } from 'react-native-calendars';
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
  mode?: 'date' | 'datetime' | 'time';
  pickerRef?: RefObject<View | null>;
}

function formatDateToString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTime12h(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`;
  return strTime;
}

const hoursArr = Array.from({ length: 12 }, (_, i) => i + 1);
const minutesArr = Array.from({ length: 60 }, (_, i) => i);
const ampmArr = ['AM', 'PM'];

interface TimePickerPopupProps {
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
  onChange: (hour: number, minute: number, ampm: 'AM' | 'PM') => void;
  onClose: () => void;
}

const TimePickerPopup: React.FC<TimePickerPopupProps> = ({ hour, minute, ampm, onChange, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);
  const [selectedAMPM, setSelectedAMPM] = useState(ampm);

  const getItemStyle = (selected: boolean) => ({
    fontSize: 22,
    color: selected ? '#222' : '#bbb',
    fontWeight: selected ? 'bold' as const : 'normal' as const,
    textAlign: 'center' as const,
    backgroundColor: selected ? '#f3f7fd' : 'transparent',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 48,
    marginVertical: 1,
  });

  const ITEM_HEIGHT = 36;
  const VISIBLE_ITEMS = 5;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
  const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

  const hourRef = React.useRef<ScrollView>(null);
  const minuteRef = React.useRef<ScrollView>(null);
  const ampmRef = React.useRef<ScrollView>(null);

  const didMountHour = React.useRef(false);
  const didMountMinute = React.useRef(false);
  const didMountAMPM = React.useRef(false);

  React.useEffect(() => {
    setTimeout(() => {
      hourRef.current?.scrollTo({ y: (hoursArr.indexOf(selectedHour)) * ITEM_HEIGHT, animated: false });
      minuteRef.current?.scrollTo({ y: (minutesArr.indexOf(selectedMinute)) * ITEM_HEIGHT, animated: false });
      ampmRef.current?.scrollTo({ y: (ampmArr.indexOf(selectedAMPM)) * ITEM_HEIGHT, animated: false });
    }, 10);
  }, []);

  const handleScrollEnd = (type: 'hour' | 'minute' | 'ampm', y: number) => {
    const idx = Math.round(y / ITEM_HEIGHT);
    if (type === 'hour') {
      if (!didMountHour.current) {
        didMountHour.current = true;
        return;
      }
      const h = hoursArr[idx] || hoursArr[0];
      setSelectedHour(h);
      onChange(h, selectedMinute, selectedAMPM);
    } else if (type === 'minute') {
      if (!didMountMinute.current) {
        didMountMinute.current = true;
        return;
      }
      const m = minutesArr[idx] || minutesArr[0];
      setSelectedMinute(m);
      onChange(selectedHour, m, selectedAMPM);
    } else {
      if (!didMountAMPM.current) {
        didMountAMPM.current = true;
        return;
      }
      const ap = ampmArr[idx] as 'AM' | 'PM' || 'AM';
      setSelectedAMPM(ap);
      onChange(selectedHour, selectedMinute, ap);
    }
  };

  const handleTapSelected = (type: 'hour' | 'minute' | 'ampm') => {
    onClose();
  };

  const renderWheel = (data: any[], selectedValue: any, type: 'hour' | 'minute' | 'ampm', ref: any) => (
    <ScrollView
      ref={ref}
      style={{ height: CONTAINER_HEIGHT, width: 60 }}
      contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={e => handleScrollEnd(type, e.nativeEvent.contentOffset.y)}
    >
      <View style={{ height: ITEM_HEIGHT * CENTER_INDEX }} />
      {data.map((item, idx) => {
        const selected = item === selectedValue;
        return (
          <TouchableOpacity
            key={item}
            activeOpacity={selected ? 0.5 : 1}
            onPress={() => selected && handleTapSelected(type)}
            style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={getItemStyle(selected)}>{type === 'minute' ? item.toString().padStart(2, '0') : item}</Text>
          </TouchableOpacity>
        );
      })}
      <View style={{ height: ITEM_HEIGHT * CENTER_INDEX }} />
    </ScrollView>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 16,
        paddingVertical: 18,
        marginTop: 0,
        alignSelf: 'center',
        zIndex: 20,
        width: 260,
        minWidth: 220,
        maxWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: CONTAINER_HEIGHT,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {renderWheel(hoursArr, selectedHour, 'hour', hourRef)}
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginHorizontal: 2 }}>:</Text>
      {renderWheel(minutesArr, selectedMinute, 'minute', minuteRef)}
      {renderWheel(ampmArr, selectedAMPM, 'ampm', ampmRef)}
    </View>
  );
};

const XDatePickerEventBus = (() => {
  let listeners: ((id: string) => void)[] = [];
  return {
    subscribe: (cb: (id: string) => void) => {
      listeners.push(cb);
      return () => {
        listeners = listeners.filter(l => l !== cb);
      };
    },
    emit: (id: string) => {
      listeners.forEach(cb => cb(id));
    },
  };
})();

const XDatePicker: React.FC<XDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  minimumDate,
  maximumDate,
  format,
  label,
  style,
  mode = 'date',
  pickerRef: externalRef,
}) => {
  const [pickerPosition, setPickerPosition] = useState<'left' | 'right'>('left');
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const internalRef = useRef<View | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number, showAbove: boolean}>({top: 0, left: 0, width: 0, showAbove: false});
  const idRef = useRef<string>(Math.random().toString(36).slice(2));

  useEffect(() => {
    const unsub = XDatePickerEventBus.subscribe((id) => {
      if (id !== idRef.current) {
        setShowPicker(false);
        setShowTimePicker(false);
        setTempDate(null);
      }
    });
    return () => unsub();
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
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
      minWidth: 320,
      maxWidth: 400,
    },
    label: {
      fontSize: 14,
      color: '#222',
      marginBottom: 4,
      fontWeight: '500',
    },
  });

  let displayValue = placeholder;
  if (value) {
    if (format) {
      displayValue = format(value);
    } else if (mode === 'datetime' || mode === 'time') {
      const dateStr = mode === 'datetime' ? value.toLocaleDateString() : '';
      displayValue = `${dateStr}${dateStr ? ', ' : ''}${formatTime12h(value)}`;
    } else {
      displayValue = value.toLocaleDateString();
    }
  }

  const getTimeParts = (date: Date | null) => {
    const d = date || new Date();
    let hour = d.getHours();
    const minute = d.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return { hour, minute, ampm };
  };

  const handleTimePicked = (hour: number, minute: number, ampm: 'AM' | 'PM') => {
    let baseDate = tempDate || value || new Date();
    let newDate = new Date(baseDate);
    let h = hour % 12;
    if (ampm === 'PM') h += 12;
    if (ampm === 'AM' && hour === 12) h = 0;
    newDate.setHours(h, minute, 0, 0);
    onChange(newDate);
  };

  const handleDayPress = (day: { year: number; month: number; day: number }) => {
    const selected = new Date(day.year, day.month - 1, day.day);
    if (mode === 'datetime') {
      setTempDate(selected);
      setShowPicker(false);
      const refToUse = externalRef || internalRef;
      if (refToUse.current) {
        const node = findNodeHandle(refToUse.current);
        if (node) {
          UIManager.measureInWindow(node, (x, y, width, height) => {
            const screenHeight = Dimensions.get('window').height;
            const screenWidth = Dimensions.get('window').width;
            const margin = 8;
            let showAbove = false;
            let top = y + height;
            const popupHeight = 360;
            if (y + height + popupHeight > screenHeight - margin) {
              showAbove = true;
              top = Math.max(margin, y - popupHeight);
            }
            const popupWidth = 260;
            let desiredLeft;
            if (pickerPosition === 'left') {
              desiredLeft = x;
            } else {
              desiredLeft = x + width - popupWidth;
            }
            let left = desiredLeft;
            if (left < margin) {
              left = margin;
            } else if (left + popupWidth > screenWidth - margin) {
              left = screenWidth - margin - popupWidth;
            }
            setDropdownPos({ top, left, width: popupWidth, showAbove });
          });
        }
      }
      setShowTimePicker(true);
    } else {
      onChange(selected);
      setShowPicker(false);
    }
  };

  const handleOpen = () => {
    const refToUse = externalRef || internalRef;
    if (refToUse.current) {
      setTimeout(() => {
        const node = findNodeHandle(refToUse.current);
        if (node) {
          UIManager.measureInWindow(node, (x, y, width, height) => {
            const screenHeight = Dimensions.get('window').height;
            const screenWidth = Dimensions.get('window').width;
            const margin = 8;
            let showAbove = false;
            let top = y + height;
            const popupHeight = 360;
            if (y + height + popupHeight > screenHeight - margin) {
              showAbove = true;
              top = Math.max(margin, y - popupHeight);
            }
            let popupWidth;
            if (mode === 'time') {
              popupWidth = 260;
            } else {
              popupWidth = 320;
            }
            let desiredLeft;
            if (pickerPosition === 'left') {
              desiredLeft = x;
            } else {
              desiredLeft = x + width - popupWidth;
            }
            let left = desiredLeft;
            if (left < margin) {
              left = margin;
            } else if (left + popupWidth > screenWidth - margin) {
              left = screenWidth - margin - popupWidth;
            }
            setDropdownPos({ top, left, width: popupWidth, showAbove });
          });
        }
      }, 10);
    }
    if (mode === 'time') {
      setShowTimePicker(true);
    } else {
      setShowPicker(true);
    }
  };

  return (
    <View style={style} onLayout={onLayout} ref={externalRef || internalRef}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.input}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: value ? '#222' : '#888' }}>{displayValue}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={showPicker && mode !== 'time'}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 1 }}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        />
        <View style={{ position: 'absolute', top: dropdownPos.top, left: dropdownPos.left, zIndex: 2 }}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={value ? formatDateToString(value) : undefined}
              minDate={minimumDate ? formatDateToString(minimumDate) : undefined}
              maxDate={maximumDate ? formatDateToString(maximumDate) : undefined}
              onDayPress={handleDayPress}
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
        </View>
      </Modal>
      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowTimePicker(false);
          setTempDate(null);
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 1 }}
          activeOpacity={1}
          onPress={() => {
            setShowTimePicker(false);
            setTempDate(null);
          }}
        />
        <View style={{ position: 'absolute', top: dropdownPos.top, left: dropdownPos.left, zIndex: 2 }}>
          <TimePickerPopup
            hour={getTimeParts(mode === 'datetime' ? tempDate : value ?? null).hour}
            minute={getTimeParts(mode === 'datetime' ? tempDate : value ?? null).minute}
            ampm={getTimeParts(mode === 'datetime' ? tempDate : value ?? null).ampm as 'AM' | 'PM'}
            onChange={handleTimePicked}
            onClose={() => {
              setShowTimePicker(false);
              setTempDate(null);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default XDatePicker;