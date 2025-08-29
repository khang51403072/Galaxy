import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';

// --- Định nghĩa các type cho props ---
// Dùng chung cho cả Row và Column
type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

/**
 * Props cho component Row.
 * Kế thừa tất cả props của View gốc.
 */
interface RowProps extends ViewProps {
  /**
   * Căn chỉnh các phần tử con theo chiều ngang (trục chính).
   * Tương đương `justifyContent`.
   */
  justify?: FlexJustify;
  /**
   * Căn chỉnh các phần tử con theo chiều dọc (trục phụ).
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
 * Một component View được cấu hình sẵn với `flexDirection: 'row'`.
 * Cung cấp các props tiện ích để dễ dàng điều khiển layout Flexbox.
 */
export const XRow = ({
  justify,
  align,
  gap,
  style,
  children,
  ...rest
}: RowProps) => {
  // Tạo style object động dựa trên các props
  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: justify,
    alignItems: align,
    gap: gap,
  };

  return (
    <View style={[rowStyle, style]} {...rest}>
      {children}
    </View>
  );
};