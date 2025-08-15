import { checkAndUpdateBundle, getBundlePath } from './otaManager';
import { AppRegistry } from 'react-native';
import RNRestart from 'react-native-restart';

export async function initOTA(appName:string, App:any, currentVersion:string, currentVersionCode:string) {
  await checkAndUpdateBundle(currentVersion, currentVersionCode);
  const bundlePath = await getBundlePath();
  if (bundlePath) {
    RNRestart.Restart(); // restart để RN load bundle mới
  } else {
    AppRegistry.registerComponent(appName, () => App);
  }
}
