#!/bin/bash

# React Native AAB Build Script
# Usage: ./build-aab.sh [debug|release]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

BUILD_TYPE=${1:-release}
PROJECT_NAME="GalaxyMe"

echo -e "${BLUE}Building $BUILD_TYPE AAB...${NC}"

# Check if Android directory exists
if [ ! -d "./android" ]; then
    echo -e "${RED}Android directory not found!${NC}"
    exit 1
fi

# Clean and build
cd android
./gradlew clean

if [ "$BUILD_TYPE" = "debug" ]; then
    ./gradlew bundleDebug
    AAB_PATH="app/build/outputs/bundle/debug/app-debug.aab"
else
    ./gradlew bundleRelease
    AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
fi

cd ..

# Check if AAB was created
if [ -f "android/$AAB_PATH" ]; then
    AAB_SIZE=$(du -h "android/$AAB_PATH" | cut -f1)
    echo -e "${GREEN}AAB built successfully!${NC}"
    echo "Location: android/$AAB_PATH"
    echo "Size: $AAB_SIZE"
    
    # Copy AAB to project root
    cp "android/$AAB_PATH" "./${PROJECT_NAME}-${BUILD_TYPE}.aab"
    echo -e "${GREEN}AAB copied to: ./${PROJECT_NAME}-${BUILD_TYPE}.aab${NC}"
else
    echo -e "${RED}AAB build failed!${NC}"
    exit 1
fi 