/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import AppNavigator from './src/app/AppNavigator';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
