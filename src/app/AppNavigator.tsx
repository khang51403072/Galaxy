import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import MainTabsScreen from '../features/home/screens/MainTabsScreen';
import { ROUTES, RootStackParamList } from './routes';
import UpdateProfileScreen from '../features/home/screens/subScreen/UpdateProfileScreen';
import ChangePasswordScreen from '../features/home/screens/subScreen/ChangePasswordScreen';
import TicketScreen from '../features/ticket/screens/TicketScreen';
import PayrollScreen from '../features/payroll/screens/PayrollScreen';
import ReportScreen from '../features/report/screens/ReportScreen';
import AppointmentScreen from '../features/appointment/screens/AppointmentScreen';
import CreateAppointmentScreen from '@/features/appointment/screens/CreateAppointmentScreen';
import SelectCustomerScreen from '@/features/appointment/components/SelectCustomerScreen';
import SplashScreen from '../shared/components/SplashScreen';
import { navigationRef } from './NavigationService';
import NotificationListScreen from '@/features/home/screens/subScreen/NotificationListScreen';
import SelectServiceScreen from '@/features/appointment/components/SelectServiceScreen';
import AddCustomerScreen from '@/features/appointment/components/AddCustomerScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.HOME} component={MainTabsScreen} />
        <Stack.Screen name={ROUTES.UPDATE_PROFILE} component={UpdateProfileScreen} />
        <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePasswordScreen} /> 
        <Stack.Screen name={ROUTES.TICKET} component={TicketScreen} /> 
        <Stack.Screen name={ROUTES.PAYROLL} component={PayrollScreen} /> 
        <Stack.Screen name={ROUTES.REPORT} component={ReportScreen} /> 
        <Stack.Screen name={ROUTES.APPOINTMENT} component={AppointmentScreen} /> 
        <Stack.Screen name={ROUTES.CREATE_APPOINTMENT} component={CreateAppointmentScreen} /> 
        <Stack.Screen name={ROUTES.SELECT_CUSTOMER} component={SelectCustomerScreen} /> 
        <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationListScreen} />
        <Stack.Screen name={ROUTES.SELECT_SERVICE} component={SelectServiceScreen} />
        <Stack.Screen name={ROUTES.CREATE_CUSTOMER} component={AddCustomerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
