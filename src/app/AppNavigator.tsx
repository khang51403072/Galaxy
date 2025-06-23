import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/HomeScreen';
import { useAuthStore } from '../features/auth/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import { XColors } from '../shared/constants/colors';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, userName, restoreSession } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      userName: state.userName,
      restoreSession: state.restoreSession,
    })),
  );

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return null; // 👈 có thể đổi thành splash screen sau
  }

  return (
    <NavigationContainer>      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {1!=1 ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
