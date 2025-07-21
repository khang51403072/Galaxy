// core/network/AuthInterceptor.ts
import { appConfig } from '@/shared/utils/appConfig';
import * as Keychain from 'react-native-keychain';

export async function getToken(): Promise<string | null> {
  try {
    const data = await appConfig.getUser();
    return data?.token??"";
  } catch (err) {
    console.error('Failed to get token', err);
  }
  return null;
}


