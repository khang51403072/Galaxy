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

const USER_KEY = 'user';
const DEVICE_ID_KEY = 'GALAXYME_DEVICE_ID';
const USE_BIOMETRIC_KEY = 'USE_BIOMETRIC';

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
   * Lưu thông tin user vào keychain và cache in-memory.
   * @param userObj Thông tin user (object)
   * @example
   *   await appConfig.saveUser(userObj);
   */
  async saveUser(userObj: any) {
    this.cachedUser = userObj;
    return keychainHelper.saveObjectWithKey(userObj, USER_KEY);
  }

  /**
   * Lấy thông tin user từ cache hoặc keychain.
   * @returns user object hoặc null nếu chưa có
   * @example
   *   const user = await appConfig.getUser();
   */
  async getUser() {
    if (this.cachedUser) return this.cachedUser;
    const user = await keychainHelper.getObjectWithKey(USER_KEY);
    if (user) this.cachedUser = user;
    return user;
  }

  /**
   * Xoá thông tin user khỏi cache và keychain.
   * @example
   *   await appConfig.clearUser();
   */
  async clearUser() {
    this.cachedUser = null;
    return keychainHelper.clearObjectWithKey(USER_KEY);
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
   * Lưu trạng thái sử dụng biometric vào keychain.
   * @param useBiometric boolean
   * @example
   *   appConfig.saveUseBiometric(true);
   */
  saveUseBiometric(useBiometric: boolean) {
    return keychainHelper.saveObjectWithKey({ useBiometric }, USE_BIOMETRIC_KEY);
  }

  /**
   * Lấy trạng thái sử dụng biometric từ keychain.
   * @returns boolean hoặc null nếu chưa lưu
   * @example
   *   const enabled = await appConfig.getUseBiometric();
   */
  async getUseBiometric(): Promise<boolean | null> {
    const obj = await keychainHelper.getObjectWithKey(USE_BIOMETRIC_KEY);
    return obj && typeof obj.useBiometric === 'boolean' ? obj.useBiometric : null;
  }

  /**
   * Xoá trạng thái biometric khỏi keychain.
   * @example
   *   appConfig.clearUseBiometric();
   */
  clearUseBiometric() {
    return keychainHelper.clearObjectWithKey(USE_BIOMETRIC_KEY);
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
}

export const appConfig = AppConfig.getInstance(); 