import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

type XTimePickerProps = {
  hour: number;
  minute: number;
  onTimeChange: (h: number, m: number) => void;
};

const { height: SCREEN_H } = Dimensions.get('window');
const ITEM_HEIGHT = 30;
const VISIBLE_COUNT = 3; // show 3 rows
const HALF = Math.floor(VISIBLE_COUNT / 2);

// Tạo mảng giờ 12 giờ với AM/PM
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const MINS = Array.from({ length: 60 }, (_, i) => i);
const AM_PM = ['AM', 'PM'];

export function XTimePicker({ hour, minute, onTimeChange }: XTimePickerProps) {
  const hourRef = useRef<FlatList<number>>(null);
  const minRef = useRef<FlatList<number>>(null);
  const amPmRef = useRef<FlatList<string>>(null);

  // Chuyển đổi giờ 24h sang 12h để hiển thị
  const getDisplayHour = (hour24: number) => {
    if (hour24 === 0) return 12;
    if (hour24 > 12) return hour24 - 12;
    return hour24;
  };

  // Chuyển đổi giờ 12h sang 24h khi chọn
  const convertTo24Hour = (hour12: number, isPM: boolean) => {
    if (hour12 === 12) {
      return isPM ? 12 : 0;
    }
    return isPM ? hour12 + 12 : hour12;
  };

  // Scroll to center the selected item
  useEffect(() => {
    if (hourRef.current) {
      const displayHour = getDisplayHour(hour);
      hourRef.current.scrollToIndex({ index: displayHour - 1, animated: false, viewPosition: 0 });
    }
    if (minRef.current) {
      minRef.current.scrollToIndex({ index: minute, animated: false, viewPosition: 0 });
    }
    if (amPmRef.current) {
      const amPmIndex = hour >= 12 ? 1 : 0; // PM = 1, AM = 0
      amPmRef.current.scrollToIndex({ index: amPmIndex, animated: false, viewPosition: 0 });
    }
  }, [hour, minute]);

  // Handle scroll end to detect snapped value
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    list: 'hour' | 'min' | 'amPm'
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    
    if (list === 'hour') {
      const hour12 = Math.max(1, Math.min(12, idx + 1));
      // Giữ nguyên AM/PM hiện tại
      const isPM = hour >= 12;
      const newHour24 = convertTo24Hour(hour12, isPM);
      if (newHour24 !== hour) onTimeChange(newHour24, minute);
    } else if (list === 'min') {
      const m = Math.max(0, Math.min(59, idx));
      if (m !== minute) onTimeChange(hour, m);
    } else if (list === 'amPm') {
      const isPM = idx === 1; // 0 = AM, 1 = PM
      const currentHour12 = getDisplayHour(hour);
      const newHour24 = convertTo24Hour(currentHour12, isPM);
      if (newHour24 !== hour) onTimeChange(newHour24, minute);
    }
  };

  const renderWheel = (
    data: (number | string)[],
    selected: number | string,
    onScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void,
    ref: React.RefObject<FlatList<any> | null>,
    type: 'hour' | 'min' | 'amPm' = 'min'
  ) => (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(i) => String(i)}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      snapToAlignment="center"
      decelerationRate="fast"
      onMomentumScrollEnd={onScrollEnd}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      contentContainerStyle={{
        paddingTop: ITEM_HEIGHT * HALF,
        paddingBottom: ITEM_HEIGHT * HALF,
      }}
      style={styles.wheel}
      renderItem={({ item }) => {
        let isSelected = false;
        if (type === 'hour') {
          isSelected = item === getDisplayHour(selected as number);
        } else if (type === 'amPm') {
          const currentAmPm = (selected as number) >= 12 ? 'PM' : 'AM';
          isSelected = item === currentAmPm;
        } else {
          isSelected = item === selected;
        }
        
        return (
          <View style={[styles.item, isSelected && styles.selected]}>
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {String(item).padStart(2, '0')}
            </Text>
          </View>
        );
      }}
    />
  );

  return (
    <View style={styles.container}>
      {renderWheel(HOURS_12, hour, (e) => handleScrollEnd(e, 'hour'), hourRef, 'hour')}
      <View style={styles.colonContainer}>
        <Text style={styles.colon}>:</Text>
      </View>
      {renderWheel(MINS, minute, (e) => handleScrollEnd(e, 'min'), minRef, 'min')}
      <View style={styles.spaceContainer}>
        <Text style={styles.space}> </Text>
      </View>
      {renderWheel(AM_PM, hour, (e) => handleScrollEnd(e, 'amPm'), amPmRef, 'amPm')}
      <View
        style={[
          styles.overlay,
          { top: ITEM_HEIGHT * HALF, height: ITEM_HEIGHT },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * VISIBLE_COUNT,
    alignItems: 'center',
  },
  wheel: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_COUNT,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#3B96F6',
    borderRadius: 8,
    marginHorizontal: 4
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  colonContainer: {
    width: 20,
    alignItems: 'center',
  },
  colon: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  spaceContainer: {
    width: 20,
    alignItems: 'center',
  },
  space: {
    fontSize: 20,
    color: 'transparent',
  },
});