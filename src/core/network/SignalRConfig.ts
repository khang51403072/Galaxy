// Import polyfill for React Native URL compatibility - must be imported first
import 'react-native-url-polyfill/auto';

export interface SignalRConfig {
  url: string;
  autoReconnect?: boolean;
  logLevel?: any;
  transportType?: any;
}

export const DEFAULT_SIGNALR_CONFIG: SignalRConfig = {
  url: 'https://xsalonapi.prod.galaxyaccess.us/hubs/', // Add hub name
  autoReconnect: true,
  logLevel: 'Information',
  transportType: 'LongPolling',
}; 