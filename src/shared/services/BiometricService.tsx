import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometricAvailable = async () => {
  const { available, biometryType, error } = await rnBiometrics.isSensorAvailable();
  console.log('checkBiometricAvailable', available, biometryType, error);
  ///handle error
  return { available, biometryType, error };
};

export const simpleBiometricAuth = async () => {
  const success  = await rnBiometrics.simplePrompt({ 
    promptMessage: 'Xác thực bằng Face ID/Touch ID', 
    fallbackPromptMessage: 'Xác thực bằng Face ID/Touch ID Thất bại ' });
  return success;
};