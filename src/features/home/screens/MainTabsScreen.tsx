

// src/navigation/MainTabs.tsx
import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Animated, Dimensions } from 'react-native';
import XIcon from '../../../shared/components/XIcon';
import XBottomTabBar from '../../../shared/components/XBottomTabBar';
import HomeScreen from './tabs/HomeScreen';
import ProfileScreen from './tabs/ProfileScreen';
import { useTheme } from '@/shared/theme';

const Tab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MainTabsScreen() {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

 

  const handleTabChange = (index: number) => {
    if (index === activeIndex) return;
    
    const direction = index > activeIndex ? -1 : 1;
    const targetValue = direction * SCREEN_WIDTH;
    
    // Animate to target position
    Animated.timing(translateX, {
      toValue: targetValue,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Update active index
      setActiveIndex(index);
      // Reset position
      translateX.setValue(0);
    });
  };
  
  const route = [
    {
      name: 'DashBoard',
      component: HomeScreen,
    },
    {
      name: 'Profile',
      component: ProfileScreen,
    },
  ]
  const screenOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textInputPlaceholder,
    tabBarLabelStyle: { fontSize: 12 },
    tabBarIcon: ({ color, size, route }: any) => {
      let iconName = 'home';
      switch (route.name) {
        case 'DashBoard':
          iconName = 'home';
          break;
        case 'Profile':
          iconName = 'profile';
          break;
      }
      return <XIcon name={iconName as any} width={size} height={size} color={color} />;
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={(props) => <XBottomTabBar {...props} />}
        screenListeners={{
          tabPress: (e) => {            
            const routeName = e.target?.split('-')[0];
            if (routeName) {
              const index = route.findIndex(tab => tab.name === routeName);
              if (index !== -1) {
                handleTabChange(index);
              }
            }
          },
        }}
      >
        <Tab.Screen name="DashBoard">
          {() => <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
        >
          <HomeScreen />
      </Animated.View>}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
        >
          <ProfileScreen />
      </Animated.View>}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
