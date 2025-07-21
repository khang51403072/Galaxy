// CustomTabBar: Copy of TabBar from react-native-tab-view, cho phép custom toàn bộ tab item qua renderTabBarItem
// Sử dụng như TabBar, nhưng có thể truyền prop renderTabBarItem để custom toàn bộ tab

import * as React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  FlatList,
  TouchableOpacity,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import type {
  Route,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';

export type CustomTabBarProps<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  renderTabBarItem?: (props: any) => React.ReactNode;
  activeColor?: string;
  inactiveColor?: string;
  indicatorStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  distributeEvenly?: boolean; // Thêm prop để chọn behavior
};

function CustomTabBar<T extends Route>({
  navigationState,
  renderTabBarItem,
  activeColor = '#2563eb',
  inactiveColor = '#222',
  indicatorStyle,
  style,
  tabStyle,
  scrollEnabled = true,
  ...rest
}: CustomTabBarProps<T>) {
  const { routes, index: activeIndex } = navigationState;
  const tabRefs = React.useRef<{ [key: string]: any }>({});
  const flatListRef = React.useRef<FlatList>(null);

  // Xác định behavior dựa vào indicatorStyle
  const showIndicator = indicatorStyle !== null && indicatorStyle !== undefined;
  const shouldDistributeEvenly = showIndicator; // Chỉ chia đều khi có indicator

  const renderItem = ({ item: route, index }: { item: T; index: number }): React.ReactElement => {
    const focused = index === activeIndex;    
    // Tạo onLayout handler chỉ khi cần indicator
    const handleLayout = (event: any) => {
      const { x, width } = event.nativeEvent.layout;
      tabRefs.current[route.key] = { x, width };
    };
    
    if (renderTabBarItem) {
      const result = renderTabBarItem({
        route,
        focused,
        ...rest,
        jumpTo: (key: string) => rest.jumpTo?.(key),
        onLayout: showIndicator ? handleLayout : undefined,
        ref: showIndicator ? (ref: any) => {
          if (ref) {
            tabRefs.current[route.key] = ref;
          }
        } : undefined
      });
      
      // Không wrap với flex: 1 nữa, để tabs có width tự nhiên
      return result as React.ReactElement;
    }
    
    // Default fallback: just render title, 1 line only
    return (
      <TouchableOpacity
        key={route.key}
        ref={showIndicator ? (ref) => {
          if (ref) {
            tabRefs.current[route.key] = ref;
          }
        } : undefined}
        style={[
          styles.defaultTab, 
          tabStyle,
          // Không apply flex: 1 nữa
        ]}
        onPress={() => rest.jumpTo?.(route.key)}
        activeOpacity={0.8}
        onLayout={showIndicator ? handleLayout : undefined}
      >
        <Animated.Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: focused ? activeColor : inactiveColor,
            fontWeight: focused ? 'bold' : 'normal',
            fontSize: 14,
          }}
        >
          {route.title}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  // Tạo render function cho View
  const renderTabForView = (route: T, index: number) => {
    return renderItem({ item: route, index });
  };

  // Tính toán position và width của indicator
  let indicatorLeft: number | string = 0;
  let indicatorWidth: number | string = 0;
  
  if (showIndicator) {
    if (shouldDistributeEvenly) {
      // Khi tabs chia đều, sử dụng percentage
      indicatorLeft = `${(100 / routes.length) * activeIndex}%`;
      indicatorWidth = `${100 / routes.length}%`;
    } else {
      // Sử dụng measure để có position chính xác cho scrollable tabs
      const activeTabRef = tabRefs.current[routes[activeIndex]?.key];
      if (activeTabRef && activeTabRef.measure) {
        activeTabRef.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          indicatorLeft = pageX;
          indicatorWidth = width;
        });
      } else {
        // Fallback: sử dụng layout data
        const activeTabLayout = tabRefs.current[routes[activeIndex]?.key];
        if (activeTabLayout && activeTabLayout.x !== undefined) {
          indicatorLeft = activeTabLayout.x;
          indicatorWidth = activeTabLayout.width;
        } else {
          // Fallback: tính toán dựa trên index và width trung bình
          const allWidths = Object.values(tabRefs.current).map(layout => layout.width).filter(w => w);
          const avgWidth = allWidths.length > 0 ? allWidths.reduce((a, b) => a + b, 0) / allWidths.length : 80;
          indicatorLeft = activeIndex * avgWidth;
          indicatorWidth = avgWidth;
        }
      }
    }
  } else {
    // Không hiển thị indicator, sử dụng percentage cho scrollable tabs
    indicatorLeft = `${(100 / routes.length) * activeIndex}%`;
    indicatorWidth = `${100 / routes.length}%`;
  }

  // Tính toán getItemLayout cho FlatList
  const getItemLayout = (data: any, index: number) => {
    if (shouldDistributeEvenly) {
      const allWidths = Object.values(tabRefs.current).map(layout => layout.width).filter(w => w);
      const avgWidth = allWidths.length > 0 ? allWidths.reduce((a, b) => a + b, 0) / allWidths.length : 80;
      return {
        length: avgWidth,
        offset: avgWidth * index,
        index,
      };
    }
    return {
      length: 80,
      offset: 80 * index,
      index,
    };
  };

  return (
    <View style={[styles.tabBar, style]}>
      {shouldDistributeEvenly ? (
        // Sử dụng View khi cần chia đều - giờ chia đều full màn hình
        <View style={{ position: 'relative' }}>
          <View style={[styles.tabContent, { 
            flexDirection: 'row',
            backgroundColor: 'transparent', // Bỏ màu xám
            paddingHorizontal: 0,
            minHeight: 50,
            justifyContent: 'space-between', // Chia đều full màn hình
          }]}>
            {routes.map((route, index) => {
              return (
                <View key={route.key} style={{ flex: 1 }}>
                  {renderTabForView(route, index)}
                </View>
              );
            })}
          </View>
          
          {/* Indicator cho View layout */}
          {showIndicator && (
            <View
              style={[
                styles.indicator,
                indicatorStyle,
                {
                  left: indicatorLeft as any,
                  width: indicatorWidth as any,
                  bottom: 0,
                },
              ]}
            />
          )}
        </View>
      ) : (
        // Sử dụng FlatList khi cần scroll
        <FlatList
          ref={flatListRef}
          data={routes}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
          scrollEnabled={scrollEnabled}
          extraData={activeIndex}
        />
      )}
      
      {/* Indicator cho FlatList layout */}
      {showIndicator && !shouldDistributeEvenly && (
        <View
          style={[
            styles.indicator,
            indicatorStyle,
            {
              left: indicatorLeft as any,
              width: indicatorWidth as any,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // Không có justifyContent mặc định để cho phép scroll
  },
  defaultTab: {
    minWidth: 80,
    
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#2563eb',
  },
});

export default CustomTabBar; 