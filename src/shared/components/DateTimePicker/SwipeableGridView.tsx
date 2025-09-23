// src/components/calendar/SwipeableGridView.tsx
import React, { memo, useCallback, useRef, useEffect } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import dayjs, { Dayjs } from 'dayjs';

const OFFSET = 5000; // Center cho infinite
const ITEM_COUNT = OFFSET * 2;
const data = Array.from({ length: ITEM_COUNT }, (_, index) => index); // Type-safe data (numbers) để tránh warning

interface SwipeableGridViewProps {
  displayDate: Dayjs;
  setDisplayDate: (date: Dayjs) => void;
  containerWidth: number;
  renderGrid: (date: Dayjs) => React.ReactNode; // Hàm render content cho mỗi page (e.g., MonthGrid)
  unit: 'month' | 'year' | 'yearGroup'; // Đơn vị swipe: month (cho day), year (cho month), yearGroup (12 years cho year)
  step?: number; // Step cho yearGroup (default 12)
}

const SwipeableGridView = memo(
  ({ displayDate, setDisplayDate, containerWidth, renderGrid, unit, step = 1 }: SwipeableGridViewProps) => {
    const flatListRef = useRef<FlatList>(null);

    // Reset to center khi displayDate thay đổi (fix bug swipe nhanh không sync hướng)
    useEffect(() => {
      flatListRef.current?.scrollToIndex({ index: OFFSET, animated: false });
    }, [displayDate]);

    const renderItem = useCallback(
      ({ item: index }: { item: number }) => { // Sử dụng item=index từ data
        let offset = index - OFFSET;
        let pageDate = displayDate;
        if (unit === 'month') {
          pageDate = pageDate.add(offset, 'month');
        } else if (unit === 'year') {
          pageDate = pageDate.add(offset, 'year');
        } else if (unit === 'yearGroup') {
          pageDate = pageDate.add(offset * (step || 12), 'year');
        }
        return (
          <View style={{ width: containerWidth }}>
            {renderGrid(pageDate)}
          </View>
        );
      },
      [displayDate, containerWidth, renderGrid, unit, step]
    );

    const keyExtractor = useCallback((item: number) => `${unit}-${item}`, [unit]);

    const handleMomentumScrollEnd = useCallback(
      (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / containerWidth);
        const offset = newIndex - OFFSET;
        let newDate = displayDate;
        if (unit === 'month') {
          newDate = newDate.add(offset, 'month');
        } else if (unit === 'year') {
          newDate = newDate.add(offset, 'year');
        } else if (unit === 'yearGroup') {
          newDate = newDate.add(offset * (step || 12), 'year');
        }
        if (!newDate.isSame(displayDate, unit === 'yearGroup' ? 'year' : unit)) {
          setDisplayDate(newDate);
        }
      },
      [displayDate, containerWidth, unit, step, setDisplayDate]
    );

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: containerWidth,
        offset: containerWidth * index,
        index,
      }),
      [containerWidth]
    );

    return (
      <FlatList
        ref={flatListRef}
        data={data} // Sử dụng data fixed
        horizontal
        pagingEnabled
        snapToInterval={containerWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={OFFSET}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        windowSize={5} // Preload 2 left/right + current
        maxToRenderPerBatch={3}
      />
    );
  }
);

export default SwipeableGridView;