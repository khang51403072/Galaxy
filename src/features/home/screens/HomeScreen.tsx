

// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DashBoardScreen from './DashBoardScreen';
import XIcon from '../../../shared/components/XIcon';
import { XColors } from '../../../shared/constants/colors';
import XTabBar from '../../../shared/components/XTabBar';
import ProfileScreen  from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: XColors.primary,
        tabBarInactiveTintColor: XColors.textInputText,
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
      tabBar={(props) => <XTabBar {...props} />}
    >
      <Tab.Screen name="DashBoard" component={DashBoardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
