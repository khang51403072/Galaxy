import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';

// --- Định nghĩa các type cho props ---
// (Bạn có thể tách các type này ra một file riêng nếu muốn)
type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

/**
 * Props cho component Column.
 * Kế thừa tất cả props của View gốc.
 */
interface ColumnProps extends ViewProps {
  /**
   * Căn chỉnh các phần tử con theo chiều dọc (trục chính).
   * Tương đương `justifyContent`.
   */
  justify?: FlexJustify;
  /**
   * Căn chỉnh các phần tử con theo chiều ngang (trục phụ).
   * Tương đương `alignItems`.
   */
  align?: FlexAlign;
  /**
   * Khoảng cách giữa các phần tử con.
   * Yêu cầu React Native 0.71+.
   */
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Một component View được cấu hình sẵn với `flexDirection: 'column'`.
 * Cung cấp các props tiện ích để dễ dàng điều khiển layout Flexbox.
 */
export const XColumn = ({
  justify,
  align,
  gap,
  style,
  children,
  ...rest
}: ColumnProps) => {
  // Tạo style object động dựa trên các props
  const columnStyle: ViewStyle = {
    flexDirection: 'column',
    justifyContent: justify,
    alignItems: align,
    gap: gap,
  };

  return (
    <View style={[columnStyle, style]} {...rest}>
      {children}
    </View>
  );
};