/**
 * appConfig.ts
 *
 * Quản lý các thông tin cấu hình và dữ liệu persistent cho ứng dụng GalaxyMe.
 * Sử dụng keychainHelper để lưu trữ an toàn các thông tin như user, deviceId, trạng thái biometric.
 * Có cache in-memory (singleton) để tối ưu hiệu năng truy xuất và đồng bộ toàn app.
 *
 * Các key sử dụng:
 * - USER_KEY: Lưu thông tin user đăng nhập.
 * - DEVICE_ID_KEY: Lưu deviceId persistent, không đổi kể cả khi gỡ app.
 * - USE_BIOMETRIC_KEY: Lưu trạng thái người dùng có bật xác thực sinh trắc học hay không.
 *
 * Các hàm chính:
 * - saveUser, getUser, clearUser: Quản lý thông tin user.
 * - saveDeviceId, getDeviceId, clearDeviceId: Quản lý deviceId persistent.
 * - getPersistentDeviceId: Lấy deviceId persistent, tự sinh nếu chưa có.
 * - saveUseBiometric, getUseBiometric, clearUseBiometric: Quản lý trạng thái biometric.
 * - clearAllCache: Xoá toàn bộ cache in-memory.
 */
import DeviceInfo from 'react-native-device-info';
import { keychainHelper } from './keychainHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';
const DEVICE_ID_KEY = 'GALAXYME_DEVICE_ID';
const USE_BIOMETRIC_KEY = 'USE_BIOMETRIC';
const AUTO_LOGIN_KEY = 'AUTO_LOGIN';
class AppConfig {
  private static instance: AppConfig;
  private cachedDeviceId: string = '';
  private cachedUser: any = null;

  private constructor() {}

  static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  /**
   * Lưu thông tin user vào AsyncStorage và cache in-memory.
   * @param userObj Thông tin user (object)
   */
  async saveUser(userObj: any) {
    this.cachedUser = userObj;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userObj));
  }

  /**
   * Lấy thông tin user từ cache hoặc AsyncStorage.
   * @returns user object hoặc null nếu chưa có
   */
  async getUser() {
    if (this.cachedUser) return this.cachedUser;
    const userStr = await AsyncStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.cachedUser = user;
        return user;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Xoá thông tin user khỏi cache và AsyncStorage.
   */
  async clearUser() {
    this.cachedUser = null;
    await AsyncStorage.removeItem(USER_KEY);
  }

  /**
   * Lưu deviceId vào keychain.
   * @param deviceId string
   * @example
   *   appConfig.saveDeviceId('abc');
   */
  saveDeviceId(deviceId: string) {
    return keychainHelper.saveObjectWithKey({ deviceId }, DEVICE_ID_KEY);
  }

  /**
   * Lấy deviceId từ keychain.
   * @returns object dạng { deviceId: string } hoặc null
   * @example
   *   const obj = await appConfig.getDeviceId();
   */
  getDeviceId() {
    return keychainHelper.getObjectWithKey(DEVICE_ID_KEY);
  }

  /**
   * Xoá deviceId khỏi keychain.
   * @example
   *   appConfig.clearDeviceId();
   */
  clearDeviceId() {
    return keychainHelper.clearObjectWithKey(DEVICE_ID_KEY);
  }

  /**
   * Lấy deviceId persistent, không đổi kể cả khi gỡ app (dùng keychain, có cache in-memory).
   * Nếu chưa có sẽ tự sinh mới và lưu lại.
   * @returns deviceId dạng string
   * @example
   *   const deviceId = await appConfig.getPersistentDeviceId();
   */
  async getPersistentDeviceId(): Promise<string> {
    if (this.cachedDeviceId) return this.cachedDeviceId;
    const deviceIdObj = await this.getDeviceId();
    if (deviceIdObj && deviceIdObj.deviceId) {
      this.cachedDeviceId = deviceIdObj.deviceId;
      return this.cachedDeviceId;
    }
    const rawId = await DeviceInfo.getUniqueId();
    this.cachedDeviceId = `GALAXYME_${rawId}`;
    await this.saveDeviceId(this.cachedDeviceId);
    return this.cachedDeviceId;
  }

  /**
   * Lưu trạng thái sử dụng biometric vào AsyncStorage.
   * @param useBiometric boolean
   */
  async saveUseBiometric(useBiometric: boolean) {
    await AsyncStorage.setItem(USE_BIOMETRIC_KEY, JSON.stringify({ useBiometric }));
  }

  /**
   * Lấy trạng thái sử dụng biometric từ AsyncStorage.
   * @returns boolean hoặc null nếu chưa lưu
   */
  async getUseBiometric(): Promise<boolean | null> {
    const str = await AsyncStorage.getItem(USE_BIOMETRIC_KEY);
    if (str) {
      try {
        const obj = JSON.parse(str);
        return typeof obj.useBiometric === 'boolean' ? obj.useBiometric : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Xoá trạng thái biometric khỏi AsyncStorage. 
   * Khi login thì cờ này sẽ được set là true, 
   * Khi logout thì cờ này sẽ được set là false
   * Khi ở trang login, nếu có biometric và cờ này true thì sẽ tự động login
   * @returns boolean
   */
  async clearUseBiometric() {
    await AsyncStorage.removeItem(USE_BIOMETRIC_KEY);
  }

  /**
   * Xoá toàn bộ cache in-memory (user, deviceId).
   * Không ảnh hưởng đến dữ liệu trong keychain.
   * @example
   *   appConfig.clearAllCache();
   */
  clearAllCache() {
    this.cachedDeviceId = '';
    this.cachedUser = null;
  }


  /**
   * Lưu trạng thái autologin vào AsyncStorage.
   * @param autoLogin boolean
   */
  async saveAutoLogin(autoLogin: boolean) {
    await AsyncStorage.setItem(AUTO_LOGIN_KEY, JSON.stringify({ autoLogin }));
  }
  /**
   * Thêm cờ autologin vào AsyncStorage.
   * @returns boolean hoặc null nếu chưa lưu
   */
  async getAutoLogin(): Promise<boolean | null> {
    const str = await AsyncStorage.getItem(AUTO_LOGIN_KEY);
    if (str) {
      try {
        const obj = JSON.parse(str);
        return typeof obj.autoLogin === 'boolean' ? obj.autoLogin : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Xoá trạng thái biometric khỏi AsyncStorage.
   */
  async clearAutoLogin() {
    await AsyncStorage.removeItem(AUTO_LOGIN_KEY);
  }
}

export const appConfig = AppConfig.getInstance(); 