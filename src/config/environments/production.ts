export const production = {
  // API Configuration
  API_BASE_URL: 'https://xsalonapi.prod.galaxyaccess.us/',
  API_TIMEOUT: 20000,
  
  // App Configuration
  APP_NAME: 'GalaxyMe2',
  APP_VERSION: '1.1.5',
  ENVIRONMENT: 'production',
  
  // Logging
  LOG_LEVEL: 'error',
  ENABLE_CONSOLE_LOG: false,
  
  // Features
  FEATURES: {
    ANALYTICS: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC: true,
    DEBUG_MENU: false,
    MOCK_DATA: false,
  },
  
  // SignalR Configuration
  SIGNALR_URL: 'https://xsalonapi.prod.galaxyaccess.us/hubs/',
  
  // Firebase Configuration
  FIREBASE_CONFIG: {
    projectId: 'galaxyme-prod',
    messagingSenderId: '555666777',
  },
  
  // Other Configs
  SESSION_TIMEOUT: 120 * 60 * 1000, // 2 hours
  MAX_RETRY_ATTEMPTS: 2,
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
}; 