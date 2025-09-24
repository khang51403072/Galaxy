// src/components/WheelPicker.tsx

import React, { useRef, memo, useMemo, useCallback } from 'react';
import { View, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCalendarContext } from './calendarContext';
import WheelPickerItem from './WheelPickerItem';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export type PickerItemType = string | number | ("AM"|"PM")

export interface PickerItem {
  value: PickerItemType;
  label: string;
}

interface WheelPickerProps {
  items: PickerItem[];
  selectedValue: PickerItemType;
  onValueChange: (value: PickerItemType) => void;
  itemHeight?: number;
  visibleItems?: number;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<PickerItem | null>);

const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  itemHeight = ITEM_HEIGHT,
  visibleItems = VISIBLE_ITEMS,
}) => {
  const { styles: calendarStyles, theme } = useCalendarContext();

  const containerHeight = itemHeight * visibleItems;
  const halfVisible = Math.floor(visibleItems / 2);
  const listRef = useRef<FlatList<PickerItem | null>>(null);
  const scrollY = useSharedValue(0);
  const isSnapping = useRef(false); // Thêm cờ để tránh snap chồng chéo

  // Padding for short lists
  const paddedItems = useMemo(() => {
    const empty = { value: '', label: '' } as PickerItem | null;
    const padding = Array(halfVisible).fill(empty);
    return [...padding, ...items, ...padding];
  }, [items, halfVisible]);

  const initialIndex = useMemo(() => halfVisible + items.findIndex(item => item.value === selectedValue), [items, selectedValue, halfVisible]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  // --- BẮT ĐẦU SỬA LỖI ---
  const snapToIndex = useCallback((y: number) => {
    if (isSnapping.current) return;

    // 1. TÍNH TOÁN INDEX GẦN NHẤT
    const closestItemIndex = Math.round(y / itemHeight);
    
    // 2. TÍNH TOÁN OFFSET CHÍNH XÁC ĐỂ CUỘN TỚI
    const targetOffset = closestItemIndex * itemHeight;

    isSnapping.current = true;
    listRef.current?.scrollToOffset({ offset: targetOffset, animated: true });

    // 3. TÍNH TOÁN LẠI INDEX TRONG MẢNG GỐC `items`
    const finalIndexInPadded = Math.round(targetOffset / itemHeight);
    const finalIndexInOriginal = finalIndexInPadded - halfVisible;

    // 4. ĐẢM BẢO INDEX NẰM TRONG RANH GIỚI CỦA MẢNG GỐC
    if (finalIndexInOriginal >= 0 && finalIndexInOriginal < items.length) {
      const selectedItem = items[finalIndexInOriginal];
      if (selectedItem && selectedItem.value !== selectedValue) {
        onValueChange(selectedItem.value);
      }
    }

    setTimeout(() => {
        isSnapping.current = false;
    }, 500); // Thời gian chờ phải lớn hơn thời gian animation của scrollToOffset

  }, [itemHeight, halfVisible, items, onValueChange, selectedValue]);
  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    snapToIndex(event.nativeEvent.contentOffset.y);
  }, [snapToIndex]);



  React.useEffect(() => {
    listRef.current?.scrollToOffset({ offset: initialIndex * itemHeight, animated: false });
  }, [initialIndex, itemHeight]);

  const renderItem = useCallback(({ item, index }: { item: PickerItem | null, index: number }) => {
    if (!item?.value && item?.value!=0) return <View style={{ height: itemHeight }} />;
    return <WheelPickerItem 
              item={item} 
              index={index} 
              scrollY={scrollY} // Truyền scrollY xuống
              itemHeight={itemHeight} 
            />;
  }, [scrollY, itemHeight, visibleItems]);


  const getItemLayout = useCallback((_: ArrayLike<PickerItem | null> | null | undefined, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  }), [itemHeight]);

  return (
    <View style={[calendarStyles.wheelContainer, { height: containerHeight }]}>
      <View style={[calendarStyles.wheelIndicator, { top: (containerHeight - itemHeight) / 2, height: itemHeight }]} />
      
      <AnimatedFlatList
        ref={listRef}
        data={paddedItems}
        keyExtractor={(_, index) => `item-${index}`}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        snapToInterval={itemHeight}
        decelerationRate={0.9}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={renderItem}
        extraData={selectedValue}
        windowSize={visibleItems + 2} // Tight virtualization
        maxToRenderPerBatch={2} // Batch small
        initialNumToRender={visibleItems + 2}
      />
    </View>
  );
};

export default memo(WheelPicker);