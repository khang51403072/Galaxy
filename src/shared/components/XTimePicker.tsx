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
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINS = Array.from({ length: 60 }, (_, i) => i);

export function XTimePicker({ hour, minute, onTimeChange }: XTimePickerProps) {
  const hourRef = useRef<FlatList<number>>(null);
  const minRef = useRef<FlatList<number>>(null);

  // Scroll to center the selected item
  useEffect(() => {
    if (hourRef.current) {
      hourRef.current.scrollToIndex({ index: hour, animated: false, viewPosition: 0 });
    }
    if (minRef.current) {
      minRef.current.scrollToIndex({ index: minute, animated: false, viewPosition: 0 });
    }
  }, [hour, minute]);

  // Handle scroll end to detect snapped value
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    list: 'hour' | 'min'
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    // Nếu có padding đầu/cuối, trừ đi padding ở đây
    const idx = Math.round(y / ITEM_HEIGHT);
    if (list === 'hour') {
      const h = Math.max(0, Math.min(23, idx));
      if (h !== hour) onTimeChange(h, minute);
    } else {
      const m = Math.max(0, Math.min(59, idx));
      if (m !== minute) onTimeChange(hour, m);
    }
  };

  const renderWheel = (
    data: number[],
    selected: number,
    onScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void,
    ref: React.RefObject<FlatList<number> | null>
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
        const isSelected = item === selected;
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
      {renderWheel(HOURS, hour, (e) => handleScrollEnd(e, 'hour'), hourRef)}
      <View style={styles.colonContainer}>
        <Text style={styles.colon}>:</Text>
      </View>
      {renderWheel(MINS, minute, (e) => handleScrollEnd(e, 'min'), minRef)}
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
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#3B96F6',
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
});