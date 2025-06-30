/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppNavigator from './src/app/AppNavigator';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider } from './src/shared/theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ActionSheetProvider >
          <AppNavigator/>
        </ActionSheetProvider>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
