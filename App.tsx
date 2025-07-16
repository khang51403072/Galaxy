/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import AppNavigator from './src/app/AppNavigator';
import { StatusBar, StyleSheet, useColorScheme, View, Alert, Platform } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider } from './src/shared/theme';
import './src/shared/utils/extensions';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import CustomBottomNotification from '@/shared/components/CustomBottomNotification';

function useFirebaseNotification(notify:any, setNotify:any) {
  useEffect(() => {
    // 1. Xin quyền nhận notification
    async function requestPermission() {
      const authStatus = await  messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      ///thông báo user không bật thông báo 
    }
    requestPermission();

    // 3. Lắng nghe notification khi app đang mở (foreground)
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => 
    {
      console.log('FCM foreground:', remoteMessage);
      Alert.alert('Thông báo mới', remoteMessage.notification?.title + '\n' + remoteMessage.notification?.body);
      console.log('FCM foreground:', remoteMessage);
      setNotify({ title: remoteMessage.notification?.title ??"", message: remoteMessage.notification?.body??""});

      
    });

    // 4. Lắng nghe notification khi app ở background/quit (phải đặt ở index.js, nhưng có thể để tạm ở đây nếu app nhỏ)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('FCM background:', remoteMessage);
    });

    // 5. Android 13+ cần xin quyền POST_NOTIFICATIONS
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      import('react-native-permissions').then(({ check, request, PERMISSIONS, RESULTS }) => {
        check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
          if (result !== RESULTS.GRANTED) {
            request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          }
        });
      });
    }

   
  }, []);
}   

function App() {
  const [notify, setNotify] = useState<{title: string, message: string}|null>(null);

  useFirebaseNotification(notify, setNotify);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ActionSheetProvider >
              <AppNavigator/>
            </ActionSheetProvider>
            {notify && (
              <CustomBottomNotification
                title={notify.title}
                message={notify.message}
                onClose={() => setNotify(null)}
                onViewDetails={() => {
                  // Xử lý khi bấm View Details
                  setNotify(null);
                  // ...navigate hoặc mở modal
                }}
              />
            )}
          </View>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
