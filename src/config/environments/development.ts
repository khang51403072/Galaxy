import Config from 'react-native-config';

export const production = {
  API_BASE_URL: Config.API_BASE_URL,
  SIGNALR_URL: Config.SIGNALR_URL,
  
  API_TIMEOUT: 20000,
  APP_NAME: 'GalaxyMe2',
  ENVIRONMENT: 'development',
  LOG_LEVEL: 'error',
  ENABLE_CONSOLE_LOG: false,
  
  FEATURES: {
    ANALYTICS: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC: true,
    DEBUG_MENU: false,
    MOCK_DATA: false,
  },
  
};