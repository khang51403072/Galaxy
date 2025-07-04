import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometricAvailable = async () => {
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  return { available, biometryType };
};

export const simpleBiometricAuth = async () => {
  const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Xác thực bằng Face ID/Touch ID' });
  return success;
};