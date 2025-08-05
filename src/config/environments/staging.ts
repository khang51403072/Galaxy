export const staging = {
  // API Configuration
  API_BASE_URL: 'https://staging-api.galaxyme.com',
  API_TIMEOUT: 15000,
  
  // App Configuration
  APP_NAME: 'GalaxyMe2 Staging',
  APP_VERSION: '1.1.5-staging',
  ENVIRONMENT: 'staging',
  
  // Logging
  LOG_LEVEL: 'info',
  ENABLE_CONSOLE_LOG: true,
  
  // Features
  FEATURES: {
    ANALYTICS: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC: true,
    DEBUG_MENU: true,
    MOCK_DATA: false,
  },
  
  // SignalR Configuration
  SIGNALR_URL: 'https://staging-signalr.galaxyme.com',
  
  // Firebase Configuration
  FIREBASE_CONFIG: {
    projectId: 'galaxyme-staging',
    messagingSenderId: '987654321',
  },
  
  // Other Configs
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
  MAX_RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
}; 