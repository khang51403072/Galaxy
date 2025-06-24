// core/network/AuthInterceptor.ts
import * as Keychain from 'react-native-keychain';

export async function getToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const data = JSON.parse(credentials.password);
      return data.token;
    }
  } catch (err) {
    console.error('Failed to get token', err);
  }
  return null;
}


export async function clearToken(): Promise<string | null> {
  try {
    await Keychain.resetGenericPassword();
  } catch (err) {
    console.error('Failed to get token', err);
  }
  return null;
}