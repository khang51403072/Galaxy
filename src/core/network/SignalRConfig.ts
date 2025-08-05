// Import polyfill for React Native URL compatibility - must be imported first
import 'react-native-url-polyfill/auto';
import { ENV } from '../../config/environment';

export interface SignalRConfig {
  url: string;
  autoReconnect?: boolean;
  logLevel?: any;
  transportType?: any;
}

export const DEFAULT_SIGNALR_CONFIG: SignalRConfig = {
  url: ENV.SIGNALR_URL, // Add hub name
  autoReconnect: true,
  logLevel: 'Information',
  transportType: 'LongPolling',
}; 