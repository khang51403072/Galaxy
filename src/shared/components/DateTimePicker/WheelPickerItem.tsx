import React, { memo } from 'react';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import XText from '../XText';
import { useCalendarContext } from './calendarContext';
import { PickerItem } from './WheelPicker';
import { StyleSheet } from 'react-native';

interface WheelPickerItemProps {
  item: PickerItem;
  index: number;
  scrollY: Animated.SharedValue<number>;
  itemHeight: number;
}

const WheelPickerItem: React.FC<WheelPickerItemProps> = ({ item, index, scrollY, itemHeight }) => {
  const { styles: calendarStyles, theme } = useCalendarContext();

  const animatedTextStyle = useAnimatedStyle(() => {
    // Vị trí tương đối của item này so với item ở trung tâm của vùng cuộn
    // Ví dụ: 0 = ở giữa, 1 = cách 1 item, -1 = cách 1 item (hướng ngược lại)
    const relativePosition = (index * itemHeight - scrollY.value) / itemHeight ;

    const color = interpolateColor(
      // Chúng ta chỉ quan tâm đến khoảng cách, không quan tâm đến hướng
      Math.abs(relativePosition),
      // Input Range: [Ở trung tâm, Cách 1 item, Cách 2 item]
      [0,1,2,3,4],
      // Output Range: [Trắng, Gray 800, Gray 600]
      [theme.colors.gray300,theme.colors.gray600,theme.colors.white, theme.colors.gray600, theme.colors.gray300]
    );

    return { color };
  }, [itemHeight, theme]);

  return (
    <Animated.View style={[styles.itemContainer, { height: itemHeight }]}>
      <Animated.Text style={[calendarStyles.wheelText, animatedTextStyle]}>
        {item.label}
      </Animated.Text>
    </Animated.View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})


// --- CUSTOM COMPARATOR ---
const areEqual = (prevProps: WheelPickerItemProps, nextProps: WheelPickerItemProps) => {
    return (
        prevProps.item.value === nextProps.item.value &&
        prevProps.index === nextProps.index &&
        prevProps.itemHeight === nextProps.itemHeight
    );
};

export default memo(WheelPickerItem, areEqual);