/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-reanimated';

// Import date extensions trước khi app khởi động
import './src/shared/utils/extensions/dateExtension';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
