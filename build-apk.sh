#!/bin/bash

# React Native APK Build Script
# Usage: ./build-apk.sh [debug|release] [clean]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="GalaxyMe"
BUILD_TYPE=${1:-release}  # Default to release
CLEAN_BUILD=${2:-false}   # Default to false

# Paths
ANDROID_DIR="./android"
BUILD_DIR="$ANDROID_DIR/app/build/outputs/apk"
GRADLE_WRAPPER="$ANDROID_DIR/gradlew"

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_info "Checking build requirements..."
    
    # Check if Android directory exists
    if [ ! -d "$ANDROID_DIR" ]; then
        print_error "Android directory not found: $ANDROID_DIR"
        exit 1
    fi
    
    # Check if gradlew exists
    if [ ! -f "$GRADLE_WRAPPER" ]; then
        print_error "Gradle wrapper not found: $GRADLE_WRAPPER"
        exit 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Installing dependencies..."
        npm install
    fi
    
    print_success "Requirements check passed"
}

clean_project() {
    print_info "Cleaning project..."
    
    # Clean React Native
    npx react-native clean
    
    # Clean Android
    cd "$ANDROID_DIR"
    ./gradlew clean
    cd ..
    
    # Remove build directories
    rm -rf "$ANDROID_DIR/app/build"
    rm -rf "$ANDROID_DIR/build"
    
    print_success "Project cleaned"
}

build_apk() {
    print_info "Building APK ($BUILD_TYPE)..."
    
    # Navigate to Android directory
    cd "$ANDROID_DIR"
    
    # Build APK
    if [ "$BUILD_TYPE" = "debug" ]; then
        print_info "Building debug APK..."
        ./gradlew assembleDebug
        APK_PATH="$BUILD_DIR/debug/app-debug.apk"
    else
        print_info "Building release APK..."
        ./gradlew assembleRelease
        APK_PATH="$BUILD_DIR/release/app-release.apk"
    fi
    
    # Go back to project root
    cd ..
    
    # Check if APK was created
    if [ -f "$APK_PATH" ]; then
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        print_success "APK built successfully!"
        print_info "APK location: $APK_PATH"
        print_info "APK size: $APK_SIZE"
        
        # Copy APK to project root for easy access
        cp "$APK_PATH" "./${PROJECT_NAME}-${BUILD_TYPE}.apk"
        print_success "APK copied to: ./${PROJECT_NAME}-${BUILD_TYPE}.apk"
    else
        print_error "APK build failed!"
        exit 1
    fi
}

install_dependencies() {
    print_info "Installing dependencies..."
    
    # Install npm dependencies
    npm install
    
    # Install Android dependencies
    cd "$ANDROID_DIR"
    ./gradlew --refresh-dependencies
    cd ..
    
    print_success "Dependencies installed"
}

# Main execution
main() {
    print_info "Starting APK build process..."
    print_info "Build type: $BUILD_TYPE"
    print_info "Clean build: $CLEAN_BUILD"
    
    # Check requirements
    check_requirements
    
    # Install dependencies if needed
    install_dependencies
    
    # Clean if requested
    if [ "$CLEAN_BUILD" = "clean" ]; then
        clean_project
    fi
    
    # Build APK
    build_apk
    
    print_success "Build process completed!"
    print_info "You can find your APK at: ./${PROJECT_NAME}-${BUILD_TYPE}.apk"
}

# Handle script arguments
case "$BUILD_TYPE" in
    "debug"|"release")
        ;;
    *)
        print_error "Invalid build type. Use 'debug' or 'release'"
        echo "Usage: $0 [debug|release] [clean]"
        exit 1
        ;;
esac

# Run main function
main 