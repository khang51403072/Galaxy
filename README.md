# GalaxyMe

A React Native application with multi-environment support for development, staging, and production.

## 🚀 Multi-Environment Support

This project supports multiple environments with separate configurations for development, staging, and production. Each environment has its own:

- **API endpoints**
- **App names and bundle IDs**
- **Feature flags**
- **Logging levels**
- **Firebase configurations**

### 📱 Available Environments

| Environment | App Name | Bundle ID | API URL |
|-------------|----------|-----------|---------|
| **Development** | GalaxyMe2 Dev | `com.galaxyaccess.me.dev` | `https://dev-api.galaxyme.com` |
| **Staging** | GalaxyMe2 Staging | `com.galaxyaccess.me.staging` | `https://staging-api.galaxyme.com` |
| **Production** | GalaxyMe2 | `com.galaxyaccess.me` | `https://api.galaxyme.com` |

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

## 🏃‍♂️ Running the App

### Development Mode

```bash
# Start Metro bundler
npm start

# Run on Android (Development environment)
npm run android:dev

# Run on Android (Staging environment)
npm run android:staging

# Run on Android (Production environment)
npm run android:prod

# Run on iOS (default)
npm run ios
```

### Environment Configuration

You can manually switch environment configurations:

```bash
# Switch to development environment
npm run env:dev

# Switch to staging environment
npm run env:staging

# Switch to production environment
npm run env:prod
```

## 🏗️ Building the App

### Android APK Builds

```bash
# Build Development APK
npm run build:dev

# Build Staging APK
npm run build:staging

# Build Production APK
npm run build:prod

# Build Debug versions
npm run build:dev:debug
npm run build:staging:debug
npm run build:prod:debug

# Build all environments at once
npm run build:all
```

### Manual Build Script

You can also use the build script directly:

```bash
# Syntax: ./build-apk.sh [environment] [build_type]
./build-apk.sh development release
./build-apk.sh staging debug
./build-apk.sh production release
```

### Build Output

Built APKs will be available in the project root:
- `GalaxyMe2-development-release.apk`
- `GalaxyMe2-staging-release.apk`
- `GalaxyMe2-production-release.apk`

## 📁 Project Structure

```
src/
├── app/                    # App navigation and routing
├── config/                 # Environment configurations
│   ├── environments/       # Environment-specific configs
│   │   ├── development.ts
│   │   ├── staging.ts
│   │   └── production.ts
│   └── environment.ts      # Active environment config
├── core/                   # Core utilities, network, firebase
├── features/               # Feature modules (auth, home, etc.)
├── navigation/             # Navigation configuration
├── shared/                 # Shared components, constants, assets
└── types/                  # TypeScript type definitions
```

## ⚙️ Environment Configuration

### Using Environment Variables in Code

```typescript
import { ENV } from '../config/environment';

// Access environment-specific values
const apiUrl = ENV.API_BASE_URL;
const isDev = ENV.ENVIRONMENT === 'development';
const features = ENV.FEATURES;

// Conditional features
if (ENV.FEATURES.ANALYTICS) {
  // Initialize analytics
}

// Environment-specific logging
if (ENV.LOG_LEVEL === 'debug') {
  console.log('Debug info');
}
```

### Environment Configuration Structure

Each environment file contains:

```typescript
export const environment = {
  // API Configuration
  API_BASE_URL: 'https://api.example.com',
  API_TIMEOUT: 10000,
  
  // App Configuration
  APP_NAME: 'GalaxyMe',
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
  SIGNALR_URL: 'https://signalr.example.com',
  
  // Firebase Configuration
  FIREBASE_CONFIG: {
    projectId: 'project-id',
    messagingSenderId: '123456789',
  },
};
```

## 🎯 Features

- **Multi-Environment Support**: Separate configs for dev/staging/prod
- **Authentication**: Login/logout functionality
- **Home Dashboard**: Main app interface
- **TypeScript**: Full type safety
- **Zustand**: State management
- **React Navigation**: Navigation handling
- **Feature Flags**: Environment-specific feature toggles
- **Conditional Logging**: Different log levels per environment

## 🔧 Development

### Adding New Components

1. Create your component in `src/shared/components/`
2. Import and use in your features

### State Management

The app uses Zustand for state management. Store files are located in `src/features/*/stores/`.

### API Integration

API services are located in `src/features/*/services/` and use a centralized HTTP client with interceptors for authentication and logging.

### Adding New Environment Variables

1. Add the variable to all environment files in `src/config/environments/`
2. Use it in your code by importing from `src/config/environment`

### Environment-Specific Features

Use feature flags to enable/disable functionality per environment:

```typescript
if (ENV.FEATURES.DEBUG_MENU) {
  // Show debug menu only in dev/staging
}

if (ENV.FEATURES.ANALYTICS) {
  // Enable analytics only in staging/prod
}
```

## 📋 Troubleshooting

### Common Issues

1. **Build fails with environment error**: Make sure the environment file exists in `src/config/environments/`
2. **Wrong API endpoint**: Check that the correct environment is selected
3. **App not installing**: Ensure different bundle IDs for each environment

### Build Script Issues

- **Permission denied**: Run `chmod +x build-apk.sh`
- **Gradle errors**: Clean the project with `cd android && ./gradlew clean`
- **Environment not found**: Verify environment name (development/staging/production)
