import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/LoginScreen';
import HomeScreen from '../features/home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const userName = null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userName ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
