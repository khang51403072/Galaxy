#!/bin/bash

# Simple React Native APK Build Script
# Usage: ./build-simple.sh [debug|release]

BUILD_TYPE=${1:-release}

echo "Building $BUILD_TYPE APK..."

# Clean and build
cd android
./gradlew clean
./gradlew assemble$BUILD_TYPE
cd ..

echo "APK built successfully!"
echo "Location: android/app/build/outputs/apk/$BUILD_TYPE/app-$BUILD_TYPE.apk" 