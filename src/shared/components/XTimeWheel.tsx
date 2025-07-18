import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import XText from './XText';

type XTimeWheelProps = {
  value: Date;
  onChange: (value: Date) => void;
  minuteStep?: number;
  style?: ViewStyle;
  disabledHours?: number[];
  disabledMinutes?: number[];
  mode?: '24h' | '12h';
};

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function XTimeWheel({
  value,
  onChange,
  minuteStep = 5,
  style,
  disabledHours = [],
  disabledMinutes = [],
  mode = '24h',
}: XTimeWheelProps) {
  const theme = useTheme();

  // Lấy giờ và phút từ value
  let [selectedHour, setSelectedHour] = useState(value.getHours());
  let [selectedMinute, setSelectedMinute] = useState(value.getMinutes());

  // Hàm chuyển đổi label sang giờ 24h
  const getHourFromLabel = (label: string): number => {
    const [hourStr, period] = label.split(' ');
    let hour = parseInt(hourStr);
    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return hour;
  };

  // Tạo danh sách giờ
  const hoursData = useMemo(() => {
    if (mode === '24h') {
      return Array.from({ length: 24 }, (_, i) => ({ value: i, label: pad(i) }));
    } else {
      return Array.from({ length: 24 }, (_, i) => {
        const hour12 = i % 12 || 12;
        const period = i < 12 ? 'AM' : 'PM';
        return { value: i, label: `${hour12} ${period}` };
      });
    }
  }, [mode]);

  // Tạo danh sách phút
  const minutesData = useMemo(
    () => Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep),
    [minuteStep]
  );

  // Tạo danh sách disabled labels cho mode='12h'
  const disabledLabels = useMemo(() => {
    if (mode === '12h')
      return disabledHours.map(h => {
        const hour12 = h % 12 || 12;
        const period = h < 12 ? 'AM' : 'PM';
        return `${hour12} ${period}`;
      });
    
    return [];
  }, [mode, disabledHours]);

  // Refs cho FlatList
  const hoursFlatListRef = useRef<FlatList>(null);
  const minutesFlatListRef = useRef<FlatList>(null);

  // Cấu hình chiều cao và scrolling
  const itemHeight = 40;
  const containerHeight = 120; // Hiển thị 3 item để giá trị được chọn nằm chính giữa

  // Cuộn để căn giữa giá trị được chọn
  useEffect(() => {
    if (hoursFlatListRef.current) {
      let index = hoursData.findIndex(h => h.value == selectedHour);
      if(index<0) index = 0;
      console.log('hour index', index, 'hourData', hoursData.length);

      hoursFlatListRef.current.scrollToIndex({ index, animated: false, viewPosition: 0 });
    }
  }, [selectedHour, hoursData]);

  useEffect(() => {
    if (minutesFlatListRef.current) {
        let tempMinute = selectedMinute;
        if(selectedMinute%minuteStep!=0)
        {
            tempMinute = selectedMinute-(selectedMinute%minuteStep)
            setSelectedMinute(tempMinute)
        }
        let index = minutesData.indexOf(tempMinute);
        minutesFlatListRef.current.scrollToIndex({ index, animated: false, viewPosition: 0 });
    }
  }, [selectedMinute, minutesData]);

  // Xử lý sự kiện khi giá trị được snap
  const onHourViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
      if (viewableItems && viewableItems.length > 0) {
        const index = viewableItems[0].index;
        if (typeof index === 'number' && hoursData[index]) {
          const newHour = hoursData[index].value;
        if (newHour !== selectedHour) {
          const newDate = new Date(value);
          newDate.setHours(newHour);
          setSelectedHour(newHour)
          onChange(newDate);
        }
      }
    }
  }).current;

  const onMinuteViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== undefined) {
        const newMinute = minutesData[index];
        if (newMinute !== selectedMinute) {
          const newDate = new Date(value);
          newDate.setMinutes(newMinute);
          setSelectedMinute(newMinute)
          onChange(newDate);
        }
      }
    }
  }).current;

  // Styles
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      padding: 8,
      ...theme.shadows.sm,
      ...style,
    },
    wheel: {
      flex: 1,
      alignItems: 'center',
      height: containerHeight,
      overflow: 'hidden',
    },
    item: {
      height: itemHeight,
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      borderRadius: 8,
    },
    selected: {
      backgroundColor: theme.colors.primary,
    },
    disabled: {
      opacity: 0.3,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      fontFamily: theme.typography.body.fontFamily,
    },
    selectedLabel: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    separator: {
      width: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    highlightOverlayLeft: {
      position: 'absolute',
      top: containerHeight / 2 - itemHeight / 2,
      height: itemHeight,
      width: '100%',
      borderBottomLeftRadius: theme.spacing.sm,
      borderTopLeftRadius: theme.spacing.sm,
      backgroundColor: theme.colors.primary, // Màu nền mờ để highlight
    },
    highlightOverlayRight: {
        position: 'absolute',
        top: containerHeight / 2 - itemHeight / 2,
        height: itemHeight,
        width: '100%',
        borderBottomRightRadius: theme.spacing.sm,
        borderTopRightRadius: theme.spacing.sm,
        backgroundColor: theme.colors.primary, // Màu nền mờ để highlight
      },
  });

  // Render giờ
  const renderHour = ({ item }: { item: { value: number; label: string } }) => {
    const isSelected = item.value === selectedHour;
    const isDisabled = mode === '24h' ? disabledHours.includes(item.value) : disabledLabels.includes(item.label);
    return (
      <TouchableOpacity
        style={[styles.item, ]}
        disabled={isDisabled}
        onPress={() => {
          const newDate = new Date(value);
          newDate.setHours(item.value);
          onChange(newDate);
        }}
        activeOpacity={0.7}
      >
        <XText style={[styles.label, isSelected && styles.selectedLabel]}>{item.label}</XText>
      </TouchableOpacity>
    );
  };

  // Render phút
  const renderMinute = ({ item }: { item: number }) => {

    const isSelected = item === selectedMinute;
    const isDisabled = disabledMinutes.includes(item);
    return (
      <TouchableOpacity
        style={[styles.item, ]}
        disabled={isDisabled}
        onPress={() => {
          const newDate = new Date(value);
          newDate.setMinutes(item);
          onChange(newDate);
        }}
        activeOpacity={0.7}
      >
        <XText style={[styles.label, isSelected && styles.selectedLabel]}>{pad(item)}</XText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Hour wheel */}
      <View style={styles.wheel}>
        <View style={styles.highlightOverlayLeft} />
        <FlatList
          ref={hoursFlatListRef}
          data={hoursData}
          keyExtractor={item => item.value.toString()}
          renderItem={renderHour}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          snapToAlignment="center"
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 100,
          }}
          contentContainerStyle={{
            paddingTop: (containerHeight - itemHeight) / 2,
            paddingBottom: (containerHeight - itemHeight) / 2,
          }}
          onViewableItemsChanged={onHourViewableItemsChanged as any}
        />
      </View>
      {/* Separator */}
      <View style={styles.separator}>
      <View style={{position: 'absolute',
      height: itemHeight,
      width: '100%',
      backgroundColor: theme.colors.primary,}} />
        <XText style={{ fontSize: 18, color: theme.colors.white }}>:</XText>
      </View>
      {/* Minute wheel */}
      <View style={styles.wheel}>
        <View style={styles.highlightOverlayRight} />
        <FlatList
          ref={minutesFlatListRef}
          data={minutesData}
          keyExtractor={item => item.toString()}
          renderItem={renderMinute}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          snapToAlignment="center"
          contentContainerStyle={{
            paddingTop: (containerHeight - itemHeight) / 2,
            paddingBottom: (containerHeight - itemHeight) / 2,
          }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 100,
          }}
          onViewableItemsChanged={onMinuteViewableItemsChanged as any}
        />
      </View>
    </View>
  );
}