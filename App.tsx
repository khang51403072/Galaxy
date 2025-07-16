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
import { initFirebaseNotificationService, removeFirebaseNotificationListener } from './src/shared/services/FirebaseNotificationService';


function App() {
  const [notify, setNotify] = useState<{title: string, message: string}|null>(null);
  useEffect(() => {
    initFirebaseNotificationService(setNotify);
    return () => {
      removeFirebaseNotificationListener();
    };
  }, []);

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
