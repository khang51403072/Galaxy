

// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import XIcon from '../../../shared/components/XIcon';
import XBottomTabBar from '../../../shared/components/XBottomTabBar';
import HomeScreen from './tabs/HomeScreen';
import ProfileScreen from './tabs/ProfileScreen';
import { useTheme } from '@/shared/theme';
const Tab = createBottomTabNavigator();

export default function MainTabsScreen() {
  const theme = useTheme()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textInputPlaceholder,
        tabBarLabelStyle: { fontSize: 12 },
        
        tabBarIcon: ({ color, size }) => {
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
      })}
      tabBar={(props) => <XBottomTabBar {...props} />}
    >
      <Tab.Screen name="DashBoard" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
