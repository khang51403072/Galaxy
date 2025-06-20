import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/HomeScreen';
import { useAuthStore } from '../features/auth/stores/authStore';
import shallow from 'zustand/shallow';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, userName, restoreSession } = useAuthStore(
    (s) => ({
      isLoading: s.isLoading,
      userName: s.userName,
      restoreSession: s.restoreSession,
    }),
    shallow,
  );

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return null; // hoặc splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userName ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
