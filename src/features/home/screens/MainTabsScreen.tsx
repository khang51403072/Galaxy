

// src/features/home/screens/MainTabsScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { useTheme } from '@/shared/theme';
import XIcon from '../../../shared/components/XIcon';
import HomeScreen from './tabs/HomeScreen';
import ProfileScreen from './tabs/ProfileScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MainTabsScreen() {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  
  // Animation values for tab bar
  const slideAnim = useSharedValue(0);
  const indicatorAnim = useSharedValue(0);

  const routes = [
    {
      name: 'Dashboard',
      component: HomeScreen,
      icon: 'home',
      label: 'Dashboard',
    },
    {
      name: 'Profile',
      component: ProfileScreen,
      icon: 'profile',
      label: 'Profile',
    },
  ];

  // Initialize entrance animation
  useEffect(() => {
    slideAnim.value = withSpring(1, { damping: 8, stiffness: 120 });
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((index: number) => {
    if (index === activeIndex) return;
    
    setActiveIndex(index);
    indicatorAnim.value = withSpring(index, { damping: 8, stiffness: 150 });
    
    // Animate pager view
    pagerRef.current?.setPage(index);
  }, [activeIndex]);

  // Handle page change from swipe
  const handlePageChange = useCallback((event: any) => {
    const newIndex = event.nativeEvent.position;
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      indicatorAnim.value = withSpring(newIndex, { damping: 8, stiffness: 150 });
    }
  }, [activeIndex]);

  // Custom Tab Bar Component
  const CustomTabBar = () => (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          ...theme.shadows.md,
        },
        useAnimatedStyle(() => ({
          transform: [
            {
              translateY: interpolate(
                slideAnim.value,
                [0, 1],
                [50, 0],
                Extrapolate.CLAMP
              ),
            },
          ],
          opacity: slideAnim.value,
        }))
      ]}
    >
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route.name}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
          }}
          onPress={() => handleTabChange(index)}
        >
          <XIcon
            name={activeIndex === index ? route.icon+"Filled" as any : route.icon+"Outline" as any}
            width={24}
            height={24}
            color={activeIndex === index ? theme.colors.primary : theme.colors.textInputPlaceholder}
          />
          <Animated.Text
            style={{
              ...theme.typography.captionRegular,
              marginTop: 4,
              color: activeIndex === index ? theme.colors.primary : theme.colors.gray700 ,
            }}
          >
            {route.label}
          </Animated.Text>
        </TouchableOpacity>
      ))}
      
      {/* Animated indicator */}
      
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        initialPage={0}
        onPageSelected={handlePageChange}
        pageMargin={0}
        overdrag={false}
        overScrollMode="never"

      >
        {routes.map((route, index) => (
          <View key={route.name} style={{ flex: 1 }}>
            <route.component />
          </View>
        ))}
      </PagerView>
      
      {/* Custom Tab Bar */}
      <CustomTabBar />
    </View>
  );
}
