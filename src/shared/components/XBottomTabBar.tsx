// src/shared/components/XTabBar.tsx
import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import XIcon from './XIcon';
import XText from './XText';
import { useTheme } from '../theme';

const XBottomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useTheme();
  
  return (
    <View style={styles.shadowContainer }>
      <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel ??
            options.title ??
            route.name;

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = getIcon(route.name) as any;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <XIcon name={iconName} width={24} height={24} color={isFocused ? theme.colors.primary : theme.colors.textTertiary} />
              <XText variant='tabBar' style={[styles.label, { color: isFocused ? theme.colors.primary : theme.colors.textTertiary }]}>
                {label as string}
              </XText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const getIcon = (routeName: string): string => {
  switch (routeName) {
    case 'DashBoard':
      return 'home';
    case 'Profile':
      return 'profile';
    default:
      return 'home';
  }
};

const styles = StyleSheet.create({
  shadowContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Shadow styles
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 16,
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    marginTop: 4,
  },
});

export default XBottomTabBar;
