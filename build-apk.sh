#!/bin/bash

# GalaxyMe Multi-Environment Build Script
# Usage: ./build-apk.sh [environment] [build_type]
# Example: ./build-apk.sh development release
# Example: ./build-apk.sh production release

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="GalaxyMe"
DEFAULT_ENVIRONMENT="production"
DEFAULT_BUILD_TYPE="release"

# Parse arguments
ENVIRONMENT=${1:-$DEFAULT_ENVIRONMENT}
BUILD_TYPE=${2:-$DEFAULT_BUILD_TYPE}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Use: development, staging, or production${NC}"
    exit 1
fi

# Validate build type
if [[ ! "$BUILD_TYPE" =~ ^(debug|release)$ ]]; then
    echo -e "${RED}Error: Invalid build type. Use: debug or release${NC}"
    exit 1
fi

# Print info function
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Android directory exists
if [ ! -d "android" ]; then
    print_error "Android directory not found."
    exit 1
fi

print_info "Building ${PROJECT_NAME} for ${ENVIRONMENT} environment (${BUILD_TYPE})"

# Step 1: Copy environment configuration
print_info "Step 1: Setting up environment configuration..."
ENV_SOURCE="src/config/environments/${ENVIRONMENT}.ts"
ENV_TARGET="src/config/environment.ts"

if [ ! -f "$ENV_SOURCE" ]; then
    print_error "Environment configuration file not found: $ENV_SOURCE"
    exit 1
fi

# Backup current environment file if it exists
if [ -f "$ENV_TARGET" ]; then
    cp "$ENV_TARGET" "${ENV_TARGET}.backup"
    print_info "Backed up current environment configuration"
fi

# Copy new environment configuration
cp "$ENV_SOURCE" "$ENV_TARGET"
print_success "Environment configuration updated to: $ENVIRONMENT"

# Step 2: Clean previous builds
print_info "Step 2: Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Step 3: Install dependencies (if needed)
print_info "Step 3: Installing dependencies..."
npm install

# Step 4: Build Android APK
print_info "Step 4: Building Android APK..."
cd android

# Determine the variant name
VARIANT_NAME="${ENVIRONMENT}${BUILD_TYPE}"  # Capitalize first letter
TASK_NAME="assemble${VARIANT_NAME}"

print_info "Building variant: $VARIANT_NAME"

# Build the APK
if ./gradlew "$TASK_NAME"; then
    print_success "Android build completed successfully!"
else
    print_error "Android build failed!"
    cd ..
    # Restore environment configuration
    if [ -f "${ENV_TARGET}.backup" ]; then
        mv "${ENV_TARGET}.backup" "$ENV_TARGET"
        print_info "Environment configuration restored"
    fi
    exit 1
fi

cd ..

# Step 5: Locate the built APK
print_info "Step 5: Locating built APK..."
APK_PATH="android/app/build/outputs/apk/${ENVIRONMENT}/${BUILD_TYPE}/app-${ENVIRONMENT}-${BUILD_TYPE}.apk"

if [ -f "$APK_PATH" ]; then
    # Copy APK to project root with descriptive name
    OUTPUT_NAME="${PROJECT_NAME}-${ENVIRONMENT}-${BUILD_TYPE}.apk"
    cp "$APK_PATH" "$OUTPUT_NAME"
    print_success "APK copied to: $OUTPUT_NAME"
    
    # Show APK info
    APK_SIZE=$(du -h "$OUTPUT_NAME" | cut -f1)
    print_info "APK Size: $APK_SIZE"
    
    print_success "Build completed successfully!"
    print_info "You can find your APK at: ./$OUTPUT_NAME"
else
    print_error "APK not found at expected location: $APK_PATH"
    print_info "Please check the build output for the correct path."
fi

# Step 6: Restore environment configuration
print_info "Step 6: Restoring environment configuration..."
if [ -f "${ENV_TARGET}.backup" ]; then
    mv "${ENV_TARGET}.backup" "$ENV_TARGET"
    print_success "Environment configuration restored"
else
    # If no backup, copy production as default
    cp "src/config/environments/production.ts" "$ENV_TARGET"
    print_info "Environment configuration set to production (default)"
fi

print_success "Build process completed!"
print_info "Environment: $ENVIRONMENT"
print_info "Build Type: $BUILD_TYPE"
print_info "Output: $OUTPUT_NAME" 