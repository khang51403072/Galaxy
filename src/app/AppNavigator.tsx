import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import { useAuthStore } from '../features/auth/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import { XColors } from '../shared/constants/colors';
import { StatusBar } from 'react-native';
import { ROUTES, RootStackParamList } from './routes';
import UpdateInfoForm from '../features/home/components/UpdateInfoForm';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.UPDATE_PROFILE} component={UpdateInfoForm} />
        {/* <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePasswordScreen} /> */}
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
