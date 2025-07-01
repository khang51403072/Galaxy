import * as Keychain from 'react-native-keychain';

export type KeychainObject = Record<string, any>;

export const keychainHelper = {
  /**
   * Lưu object vào keychain (Generic Credentials)
   */
  async saveObject(obj: KeychainObject): Promise<boolean> {
    try {
      await Keychain.setGenericPassword('user', JSON.stringify(obj));
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Lấy object từ keychain (Generic Credentials)
   */
  async getObject<T = KeychainObject>(): Promise<T | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as T;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Xoá dữ liệu khỏi keychain (Generic Credentials)
   */
  async reset(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword();
      return true;
    } catch (e) {
      return false;
    }
  },
};