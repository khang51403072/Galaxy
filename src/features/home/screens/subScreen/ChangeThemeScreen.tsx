import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getNotifications, markAllNotificationAsRead, markNotificationAsRead, NotificationItem } from '@/shared/services/FirebaseNotificationService';
import XScreen from '@/shared/components/XScreen';
import { useTheme } from '@/shared/theme';
import XIcon from '@/shared/components/XIcon';
import XAlert from '@/shared/components/XAlert';
import XDialog from '@/shared/components/XDialog';
import XNoDataView from '@/shared/components/XNoDataView';
import { useHomeStore } from '../../stores/homeStore';
import { ROUTES } from '@/app/routes';
import { navigate } from '@/app/NavigationService';
import XAvatar from '@/shared/components/XAvatar';
import XText from '@/shared/components/XText';
import ThemeSelector from '@/shared/components/ThemeSelector';


 export type StoreEntity = {
  url: string;
  name: string;
  address: string;
  
 }


const ChangeThemeScreen = () => {
  const theme =  useTheme() ;
  

  

    return (
      <XScreen title='Change Theme'>
        <ThemeSelector 
          onThemeChange={(themeId) => {
            console.log('Theme changed to:', themeId);
          }}
        />
      </XScreen>)
};



export default ChangeThemeScreen; 