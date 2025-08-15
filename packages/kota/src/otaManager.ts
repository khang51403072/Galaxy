import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const WORKER_URL = 'https://galaxyme-worker.khang51403072.workers.dev';
const BUNDLE_FILE = `${RNFS.DocumentDirectoryPath}/index.ota.bundle`;

/**
 * Kiểm tra OTA và tải bundle mới nếu cần
 */
export async function checkAndUpdateBundle(currentVersion:string, currentVersionCode:string) {
  try {
    const res = await fetch(`${WORKER_URL}/check-version`);
    const latest = await res.json();

    const platformKey = Platform.OS; // "android" hoặc "ios"
    const latestInfo = latest[platformKey];

    if (!latestInfo) return false;

    const isNewVersion =
      latestInfo.version > currentVersion ||
      (latestInfo.version === currentVersion &&
        parseInt(latestInfo.versionCode) > parseInt(currentVersionCode));

     

    console.log("isNewVersion",isNewVersion, parseInt(latestInfo.versionCode) ,parseInt(currentVersionCode))
    if (isNewVersion && latestInfo.type === 'bundle') {
      console.log('[OTA] Found new bundle:', latestInfo);

      const success = await downloadFile(latestInfo.bundleLink, BUNDLE_FILE);
      if (success) {
        console.log('[OTA] Bundle updated successfully:', BUNDLE_FILE);
        return true;
      }
    }

    return false;
  } catch (err) {
    console.error('[OTA] Error checking bundle:', err);
    return false;
  }
}

/**
 * Download file từ URL và lưu vào path local
 */
async function downloadFile(url:string, destPath:string) {
  try {
    const download = RNFS.downloadFile({
      fromUrl: url.replace('?dl=0', '?dl=1'), // Dropbox direct download
      toFile: destPath,
    });

    const result = await download.promise;
    return result.statusCode === 200;
  } catch (err) {
    console.error('[OTA] Download error:', err);
    return false;
  }
}

/**
 * Lấy path bundle hiện tại để load
 */
export function getBundlePath() {
  return RNFS.exists(BUNDLE_FILE).then((exists) => {
    if (exists) {
      console.log('[OTA] Loading local bundle:', BUNDLE_FILE);
      return BUNDLE_FILE;
    }
    console.log('[OTA] Loading default bundle from app package');
    return null;
  });
}
