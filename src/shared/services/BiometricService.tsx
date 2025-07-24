import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert, Linking, Platform } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();


//hàm kiểm tra trạng thái biometric có đang sẵn sàng để sử dụng không (Bị block hay là thiết bị không hỗ trợ gì không)
//case 1: available == true, biometric đang sẵn sàng để sử dụng => return true
//case 2: available == false, biometric đang bị block hoặc không hỗ trợ => return false
//show alert với message là "Biometric đang bị block hoặc không hỗ trợ", 
//'Bạn vui lòng kiểm tra thiết bị có hỗ trợ biometric không, nếu có thì bật lại biometric'
// nếu user click vào ok thì sẽ được chuyển sang trang cài đặt hệ thống để bật biometric
// case 3: thiết bị có hỗ trợ, nhưng người dùng chưa thiết lập biometric trên thiết bị thì sao???

export const checkBiometricAvailable = async () => {
  try {
    const { available, biometryType, error } = await rnBiometrics.isSensorAvailable();
    console.log('checkBiometricAvailable', available, biometryType, error);
    if (available) return true;
    // available === false
    
    const errMsg = (error || '').toLowerCase();
    if (errMsg.includes('not enrolled') || errMsg.includes('not set up')) {
      // User chưa thiết lập biometric
      Alert.alert(
        'Thông báo',
        'Bạn cần thiết lập FaceID/TouchID trên thiết bị trước khi sử dụng. Nhấn OK để vào Cài đặt.',
        [
          { text: 'Để sau', style: 'cancel' },
          { text: 'OK', onPress: () => Platform.OS === 'ios' ? Linking.openURL('App-Prefs:') : Linking.openSettings() }
        ]
      );
      return false;
    }
    if (errMsg.includes('denied') || errMsg.includes('block') || errMsg.includes('disabled')) {
      // User đã tắt quyền hoặc bị block
      Alert.alert(
        'Thông báo',
        'Biometric đang bị block hoặc không hỗ trợ. Bạn vui lòng kiểm tra thiết bị có hỗ trợ biometric không, nếu có thì bật lại biometric.',
        [
          { text: 'Để sau', style: 'cancel' },
          { text: 'OK', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      );
      return false;
    }

    if (!biometryType) {
      // Thiết bị không hỗ trợ
      Alert.alert('Thông báo', 'Thiết bị của bạn không hỗ trợ FaceID/TouchID.');
      return false;
    }
    // Các lỗi khác
    Alert.alert(
      'Thông báo',
      'Không thể sử dụng FaceID/TouchID. Vui lòng kiểm tra lại cài đặt thiết bị.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'OK', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
      ]
    );
    return false;
  } catch (e: any) {
    Alert.alert('Lỗi', 'Không thể kiểm tra trạng thái biometric.');
    return false;
  }
};

export const simpleBiometricAuth = async () => {
  const {success}  = await rnBiometrics.simplePrompt({ 
    promptMessage: 'Xác thực bằng Face ID/Touch ID', 
    fallbackPromptMessage: 'Xác thực bằng Face ID/Touch ID Thất bại ' });
  return success;
};