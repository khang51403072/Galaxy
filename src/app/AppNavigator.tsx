import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import MainTabsScreen from '../features/home/screens/MainTabsScreen';
import { ROUTES, RootStackParamList } from './routes';
import UpdateProfileScreen from '../features/home/screens/subScreen/UpdateProfileScreen';
import ChangePasswordScreen from '../features/home/screens/subScreen/ChangePasswordScreen';
import TicketScreen from '../features/ticket/screens/TicketScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
      <NavigationContainer>      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.HOME} component={MainTabsScreen} />
        <Stack.Screen name={ROUTES.UPDATE_PROFILE} component={UpdateProfileScreen} />
        <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePasswordScreen} /> 
        <Stack.Screen name={ROUTES.TICKET} component={TicketScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
