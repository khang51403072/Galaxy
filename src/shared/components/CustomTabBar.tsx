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

  const renderItem = ({ item: route, index }: { item: T; index: number }) => {
    const focused = index === activeIndex;
    if (renderTabBarItem) {
      return renderTabBarItem({
        route,
        focused,
        ...rest,
        jumpTo: (key: string) => rest.jumpTo?.(key),
      });
    }
    // Default fallback: just render title, 1 line only
    return (
      <TouchableOpacity
        key={route.key}
        style={[styles.defaultTab, tabStyle]}
        onPress={() => rest.jumpTo?.(route.key)}
        activeOpacity={0.8}
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

  return (
    <View style={[styles.tabBar, style]}>
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
        scrollEnabled={scrollEnabled}
        extraData={activeIndex}
      />
      {/* Indicator */}
      <View
        style={[
          styles.indicator,
          indicatorStyle,
          {
            left: `${(100 / routes.length) * activeIndex}%`,
            width: `${100 / routes.length}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    elevation: 4,
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between', // bỏ để FlatList tự xử lý
  },
  defaultTab: {
    minWidth: 80,
    paddingHorizontal: 16,
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