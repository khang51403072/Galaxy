export const development = {
  // API Configuration
  API_BASE_URL: 'https://dev-api.galaxyme.com',
  API_TIMEOUT: 10000,
  
  // App Configuration
  APP_NAME: 'GalaxyMe2 Dev',
  APP_VERSION: '1.1.5-dev',
  ENVIRONMENT: 'development',
  
  // Logging
  LOG_LEVEL: 'debug',
  ENABLE_CONSOLE_LOG: true,
  
  // Features
  FEATURES: {
    ANALYTICS: false,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC: true,
    DEBUG_MENU: true,
    MOCK_DATA: true,
  },
  
  // SignalR Configuration
  SIGNALR_URL: 'https://dev-signalr.galaxyme.com',
  
  // Firebase Configuration
  FIREBASE_CONFIG: {
    projectId: 'galaxyme-dev',
    messagingSenderId: '123456789',
  },
  
  // Other Configs
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
}; 