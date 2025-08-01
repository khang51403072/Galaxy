# Build Scripts for GalaxyMe

## Các script build có sẵn:

### 1. `build-apk.sh` - Script build APK đầy đủ tính năng
```bash
# Build release APK
./build-apk.sh release

# Build debug APK
./build-apk.sh debug

# Build với clean
./build-apk.sh release clean
./build-apk.sh debug clean
```

**Tính năng:**
- ✅ Kiểm tra requirements
- ✅ Tự động install dependencies
- ✅ Clean project (tùy chọn)
- ✅ Copy APK về project root
- ✅ Hiển thị thông tin chi tiết
- ✅ Color output

### 2. `build-simple.sh` - Script build APK đơn giản
```bash
# Build release APK
./build-simple.sh release

# Build debug APK
./build-simple.sh debug
```

**Tính năng:**
- ✅ Build nhanh
- ✅ Ít dependencies
- ✅ Phù hợp cho development

### 3. `build-aab.sh` - Script build AAB (Android App Bundle)
```bash
# Build release AAB
./build-aab.sh release

# Build debug AAB
./build-aab.sh debug
```

**Tính năng:**
- ✅ Build AAB cho Google Play Store
- ✅ Copy AAB về project root
- ✅ Hiển thị kích thước file

## Cách sử dụng:

### Bước 1: Cấp quyền thực thi
```bash
chmod +x build-apk.sh
chmod +x build-simple.sh
chmod +x build-aab.sh
```

### Bước 2: Build APK
```bash
# Build release APK (khuyến nghị cho production)
./build-apk.sh release

# Build debug APK (cho testing)
./build-apk.sh debug
```

### Bước 3: Tìm file APK
Sau khi build thành công, APK sẽ được copy về:
- `./GalaxyMe-release.apk` (release)
- `./GalaxyMe-debug.apk` (debug)

## Troubleshooting:

### Lỗi "Permission denied"
```bash
chmod +x *.sh
```

### Lỗi "Gradle wrapper not found"
```bash
cd android
./gradlew wrapper
cd ..
```

### Lỗi "Android SDK not found"
Đảm bảo đã cài đặt Android SDK và set ANDROID_HOME

### Lỗi "Java not found"
Đảm bảo đã cài đặt Java JDK 11 hoặc 17

## Build thủ công:

### APK
```bash
cd android
./gradlew clean
./gradlew assembleRelease  # hoặc assembleDebug
cd ..
```

### AAB
```bash
cd android
./gradlew clean
./gradlew bundleRelease    # hoặc bundleDebug
cd ..
```

## Lưu ý:

1. **Release build** cần keystore và signing config
2. **Debug build** không cần signing
3. **AAB** chỉ dùng cho Google Play Store
4. **APK** có thể install trực tiếp trên device

## File locations:

### APK
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### AAB
- Debug: `android/app/build/outputs/bundle/debug/app-debug.aab`
- Release: `android/app/build/outputs/bundle/release/app-release.aab` 