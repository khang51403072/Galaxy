# GalaxyMe

A React Native application.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
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

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── app/                 # App navigation and routing
├── core/               # Core utilities, network, firebase
├── features/           # Feature modules (auth, home, etc.)
├── navigation/         # Navigation configuration
├── shared/            # Shared components, constants, assets
└── types/             # TypeScript type definitions
```

## Features

- **Authentication**: Login/logout functionality
- **Home Dashboard**: Main app interface
- **TypeScript**: Full type safety
- **Zustand**: State management
- **React Navigation**: Navigation handling

## Development

### Adding New Components

1. Create your component in `src/shared/components/`
2. Import and use in your features

### State Management

The app uses Zustand for state management. Store files are located in `src/features/*/stores/`.

### API Integration

API services are located in `src/features/*/services/` and use a centralized HTTP client with interceptors for authentication and logging.
