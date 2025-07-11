import DeviceInfo from 'react-native-device-info';
import { keychainHelper } from './keychainHelper';

const DEVICE_ID_KEY = 'GALAXYME_DEVICE_ID';
let cachedDeviceId: string | null = null;

/**
 * Lấy deviceId persistent, không đổi kể cả khi gỡ app (dùng keychainHelper, key riêng).
 * Có cache in-memory để tối ưu hiệu năng.
 */
export const getPersistentDeviceId = async (): Promise<string> => {
  if (cachedDeviceId) return cachedDeviceId;

  // Lấy từ keychain với key riêng
  const deviceIdObj = await keychainHelper.getObjectWithKey<{ deviceId: string }>(DEVICE_ID_KEY);
  if (deviceIdObj && deviceIdObj.deviceId) {
    cachedDeviceId = deviceIdObj.deviceId;
    return cachedDeviceId;
  }

  // Nếu chưa có, sinh mới và lưu lại
  const rawId = await DeviceInfo.getUniqueId();
  cachedDeviceId = `GALAXYME_${rawId}`;
  await keychainHelper.saveObjectWithKey({ deviceId: cachedDeviceId }, DEVICE_ID_KEY);
  return cachedDeviceId;
}; 