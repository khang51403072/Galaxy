/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Import polyfill for React Native URL compatibility - must be imported first
import 'react-native-url-polyfill/auto';
import { AppState, AppStateStatus } from 'react-native';

import React, { useEffect, useState,useRef } from 'react';
import AppNavigator from './src/app/AppNavigator';
import { StatusBar, StyleSheet, useColorScheme, View, Alert, Platform } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { pinkTheme, ThemeProvider } from './src/shared/theme';
import './src/shared/utils/extensions';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomBottomNotification from '@/shared/components/CustomBottomNotification';
import { initFirebaseNotificationService, removeFirebaseNotificationListener } from './src/shared/services/FirebaseNotificationService';
import { navigate } from '@/app/NavigationService';
import { ROUTES } from '@/app/routes';
import { XAlertProvider } from '@/shared/components/XAlertContext';
import { SignalRService } from '@/core/network';
import useSignalRStore from '@/shared/stores/signalRStore';
import { initOTA } from '@kang/kota';


function App() {
  const [notify, setNotify] = useState<{title: string, message: string}|null>(null);
  const { initialize: initializeSignalR } = useSignalRStore();
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    initFirebaseNotificationService(setNotify);
    
    // Initialize SignalR connection
    initializeSignalR().catch(error => {
      console.error('Failed to initialize SignalR:', error);
    });
    
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      // Khi app chuyển từ background -> active
      if (appState.current.match(/inactive|background|stop/) && nextAppState === 'active') {
        console.log("🔄 App resumed - checking for OTA update...");
        if(Platform.OS=='android')
        await initOTA('GalaxyMe', App, '1.0.0', '100');
      }
      appState.current = nextAppState;
    });

    return () => {
      removeFirebaseNotificationListener();
      subscription.remove();
    };
  }, [initializeSignalR]);

  const isDarkMode = useColorScheme() === 'dark';
  

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <XAlertProvider>
            <View style={styles.container}>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <ActionSheetProvider>
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
                    navigate(ROUTES.NOTIFICATIONS);
                    // ...navigate hoặc mở modal
                  }}
                />
              )}
            </View>
          </XAlertProvider>
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
