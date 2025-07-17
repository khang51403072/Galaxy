import * as Keychain from 'react-native-keychain';

export type KeychainObject = Record<string, any>;

export const keychainHelper = {
  /**
   * Lưu object vào keychain với key tuỳ ý (dùng service)
   */
  async saveObjectWithKey(obj: KeychainObject, key: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(key, JSON.stringify(obj), { service: key });
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Lấy object từ keychain với key tuỳ ý (dùng service)
   */
  async getObjectWithKey<T = KeychainObject>(key: string): Promise<T | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as T;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Xoá object khỏi keychain với key tuỳ ý (dùng service)
   */
  async clearObjectWithKey(key: string): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({ service: key });
      return true;
    } catch (e) {
      return false;
    }
  },
};