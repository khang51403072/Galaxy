// src/components/WheelPicker.tsx

import React, { useRef, useCallback, memo, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, runOnJS } from 'react-native-reanimated';

// --- ĐỊNH NGHĨA CÁC HẰNG SỐ VÀ KIỂU DỮ LIỆU ---

const ITEM_HEIGHT = 50; // Chiều cao của mỗi item
const VISIBLE_ITEMS = 5; // Số item hiển thị cùng lúc (luôn là số lẻ)
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // Chiều cao tổng của picker

// Kiểu dữ liệu cho mỗi item trong danh sách

export type PickerItemType = string | number| ("AM"|"PM")

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

// Tạo một Animated.FlatList để có thể sử dụng reanimated
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<PickerItem | null>);

// --- COMPONENT CHÍNH ---

const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  itemHeight = ITEM_HEIGHT,
  visibleItems = VISIBLE_ITEMS,
}) => {

  const containerHeight = itemHeight * visibleItems;
  const listRef = useRef<FlatList<PickerItem | null>>(null);
  
  // Thêm các item rỗng vào đầu và cuối để item đầu/cuối có thể cuộn vào giữa
  const extendedItems = useMemo(() => {
    const emptyItemsCount = Math.floor(visibleItems / 2);
    const emptyItem = { value: `empty-${Math.random()}`, label: '' };
    return [
      ...Array(emptyItemsCount).fill(emptyItem),
      ...items,
      ...Array(emptyItemsCount).fill(emptyItem),
    ];
  }, [items, visibleItems]);

  const scrollY = useSharedValue(0);

  // --- LOGIC ANIMATION "BẮT DÍNH" ---

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    // Tính toán index của item gần giữa nhất
    const closestIndex = Math.round(y / itemHeight);
    
    // Animate cuộn đến đúng vị trí của item đó
    if (listRef.current) {
      listRef.current.scrollToOffset({
        offset: closestIndex * itemHeight,
        animated: true,
      });
      
      // Cập nhật giá trị đã chọn
      // Lấy item từ mảng gốc `items`, không phải mảng đã mở rộng
      const selectedItem = items[closestIndex];
      if (selectedItem && selectedItem.value !== selectedValue) {
        onValueChange(selectedItem.value);
      }
    }
  };
  
  // Hàm render mỗi item
  const renderItem = useCallback(({ item }: { item: PickerItem | null }) => (
    <View style={[styles.itemContainer, { height: itemHeight }]}>
      <Text style={styles.itemText}>{item?.label}</Text>
    </View>
  ), [itemHeight]);

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      
      {/* Vạch chỉ thị nằm cố định ở giữa */}
      <View style={[styles.indicator, { top: (containerHeight - itemHeight) / 2, height: itemHeight }]} />
      
      <AnimatedFlatList
        ref={listRef}
        data={extendedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item?.value?.toString()??""}
        showsVerticalScrollIndicator={false}
        // Quan trọng: Bật tính năng "bắt dính" của FlatList
        snapToInterval={itemHeight}
        decelerationRate="fast"
        // Tìm vị trí ban đầu
        initialScrollIndex={items.findIndex(item => item.value === selectedValue)}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        // Xử lý khi người dùng thả tay
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    width: "30%", // Chiều rộng có thể tùy chỉnh
    alignItems: "center"
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 255, 0.1)', // Màu highlight
    borderRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 255, 0.2)',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 24,
    color: '#333',
  },
});

export default memo(WheelPicker);