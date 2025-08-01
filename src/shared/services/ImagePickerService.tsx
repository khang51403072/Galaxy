import {
    launchCamera,
    launchImageLibrary,
    ImageLibraryOptions,
    CameraOptions,
    Asset,
  } from 'react-native-image-picker';
  import {
    check,
    request,
    PERMISSIONS,
    RESULTS,
    openSettings,
  } from 'react-native-permissions';
  import { Platform, Alert } from 'react-native';
  import ImageResizer from 'react-native-image-resizer';
  export const checkPermission = async (type: 'camera' | 'library') => {
    const permission =
      Platform.OS === 'ios'
        ? type === 'camera'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.IOS.PHOTO_LIBRARY
        : type === 'camera'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
  
    const status = await check(permission);
  
    if (status === RESULTS.GRANTED) return true;
  
    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission denied',
        'Please open settings and grant access.',
        [
          { text: 'Cancel' },
          { text: 'Open settings', onPress: () => openSettings() },
        ]
      );
      return false;
    }
  
    const requestResult = await request(permission);
    return requestResult === RESULTS.GRANTED;
  };
  
  
  export const pickImageFromLibrary = (): Promise<Asset | null> => {
    return new Promise((resolve) => {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      };
  
      launchImageLibrary(options, (res) => {
        if (res.didCancel || res.errorCode) return resolve(null);
        resolve(res.assets?.[0] || null);
      });
    });
  };
  
  export const pickImageFromCamera = (): Promise<Asset | null> => {
    return new Promise((resolve) => {
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        
      };
  
      launchCamera(options, async (res) => {
        if (res.didCancel || res.errorCode) return resolve(null);
        const asset = res.assets?.[0];
        if (asset) {
          const fixedAsset = await fixImageOrientation(asset);
          resolve(fixedAsset);
        } else {
          resolve(null);
        }
      });
    });
  };



  const fixImageOrientation = async (asset: Asset) => {
    try {
      const result = await ImageResizer.createResizedImage(
        asset.uri??'',
        1024, // max width
        1024, // max height
        'JPEG',
        90, // quality
        0, // rotation (0 = auto-detect)
        undefined, // output path
        false, // keep metadata
        { mode: 'contain', onlyScaleDown: true }
      );
      
      return {
        ...asset,
        uri: result.uri,
        fileSize: result.size,
      };
    } catch (error) {
      console.error('Failed to fix orientation:', error);
      return asset;
    }
  };