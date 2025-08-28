const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const FormData = require('form-data');
const plist = require('plist');
const qrcode = require('qrcode-terminal');

const { runCommandSilent } = require('../src/utils/gitHelpers'); // Giả định bạn có hàm này

const rootDir = process.cwd();
const androidDir = path.join(rootDir, 'android');
const iosDir = path.join(rootDir, 'ios');

// --- CÁC HÀM HELPER ---

function logStep(step, message) {
  console.log(chalk.cyan(`\n${step}️⃣  ${message}`));
}

function printErrorLog(logFilePath) {
  const logLines = fs.readFileSync(logFilePath, 'utf-8').trim().split('\n');
  const tail = logLines.slice(-10).join('\n');
  console.error(chalk.red(`\n❌ Build failed! See ${logFilePath} for full log.\n`));
  console.error(chalk.gray('--- Last 10 log lines ---'));
  console.error(chalk.yellow(tail));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDirectDropboxLink(url) {
    if (!url) return '';
    // Bước 1: Loại bỏ tham số dl=0 nếu có
    const urlWithoutDl = url.replace(/(&|\?)dl=0$/, '');
    
    // Bước 2: Thêm tham số dl=1
    // Kiểm tra xem URL đã có dấu ? chưa
    if (urlWithoutDl.includes('?')) {
        return `${urlWithoutDl}&dl=1`;
    } else {
        return `${urlWithoutDl}?dl=1`;
    }
}
function updateManifest(manifestPath, newIpaUrl) {
  console.log(`📝 Reading manifest file at: ${manifestPath}`);
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifestJson = plist.parse(manifestContent);
    if (manifestJson.items?.[0]?.assets?.[0]) {
      manifestJson.items[0].assets[0].url = newIpaUrl;
      const updatedManifestContent = plist.build(manifestJson);
      fs.writeFileSync(manifestPath, updatedManifestContent);
      console.log(chalk.green('✅ Manifest file updated successfully!'));
    } else {
      throw new Error("Manifest file has an unexpected structure.");
    }
  } catch (error) {
    console.error(chalk.red(`❌ Failed to update manifest file: ${error.message}`));
    throw error;
  }
}

async function uploadToWorker(filePath, workerUrl, uploadData) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  for (const key in uploadData) {
    form.append(key, uploadData[key]);
  }

  try {
    const response = await axios.post(`${workerUrl}/upload`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    const result = response.data;
    console.log(chalk.green(`✅ Upload ${uploadData.type} completed: ${JSON.stringify(result)}`));
    return result.url;
  } catch (error) {
    if (error.response) {
      throw new Error(`Upload ${uploadData.type} failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      throw new Error(`Upload ${uploadData.type} failed: No response received. Error: ${error.message}`);
    } else {
      throw new Error(`Upload ${uploadData.type} failed with error: ${error.message}`);
    }
  }
}

// --- CÁC HÀM XỬ LÝ RIÊNG ---

async function handleIOSPublish(otaDir, workerUrl, config) {
  const { version, buildNumber } = config;
  const buildDir = path.join(iosDir, 'build');
  const archivePath = path.join(buildDir, 'GalaxyMe.xcarchive');
  const exportDir = path.join(buildDir, 'export');
  const scheme = 'GalaxyMe';

  logStep('1a', 'Archiving iOS app...');
  await runCommandSilent('xcodebuild', ['archive', '-workspace', `${iosDir}/${scheme}.xcworkspace`, '-scheme', scheme, '-sdk', 'iphoneos', '-configuration', 'Release', '-archivePath', archivePath], iosDir, 'build.log');

  logStep('1b', 'Exporting .ipa from archive...');
  const exportOptionsPath = path.join(iosDir, 'ExportOptions.plist');
  await runCommandSilent('xcodebuild', ['-exportArchive', '-archivePath', archivePath, '-exportPath', exportDir, '-exportOptionsPlist', exportOptionsPath], iosDir, 'export.log');
  
  logStep(2, 'Uploading build artifacts...');
  fs.mkdirSync(otaDir, { recursive: true });

  const ipaFileName = fs.readdirSync(exportDir).find(file => file.endsWith('.ipa'));
  if (!ipaFileName) throw new Error('Could not find .ipa file in export directory.');

  const ipaSrcPath = path.join(exportDir, ipaFileName);
  const manifestSrcPath = path.join(exportDir, 'manifest.plist');

  const ipaUrl = await uploadToWorker(ipaSrcPath, workerUrl, { platform: 'ios', version, versionCode: buildNumber, type: 'ipa' });
  const directIpaUrl = getDirectDropboxLink(ipaUrl);

  updateManifest(manifestSrcPath, directIpaUrl);

  const manifestUrl = await uploadToWorker(manifestSrcPath, workerUrl, { platform: 'ios', version, versionCode: buildNumber, type: 'manifest' });
  const directManifestUrl = getDirectDropboxLink(manifestUrl);

  // const installUrl = `itms-services://?action=download-manifest&url=${directManifestUrl}`;
  
  const installUrl = `itms-services://?action=download-manifest&url=https://galaxyme-worker.khang51403072.workers.dev/install/ios/latest`;
  
  const finalInstallPageUrl = 'https://khang51403072.github.io/GalaxyMeOTA/index.html';

  console.log(chalk.greenBright(`\n🎉 DONE! Send this link or QR Code to your iOS testers:`));
  console.log(chalk.cyan(finalInstallPageUrl));
  qrcode.generate(finalInstallPageUrl, { small: true });
}

async function handleAndroidPublish(otaDir, workerUrl, config) {
  const { version, versionCode, flavor } = config;
  const buildVariant = `${flavor}Release`;

  logStep('1a', 'Bundling React Native code for Android...');
  await runCommandSilent('npx', ['react-native', 'bundle', '--platform', 'android', '--dev', 'false', '--entry-file', 'index.js', '--bundle-output', `android/app/build/generated/assets/react/${flavor}/release/index.android.bundle`, '--assets-dest', `android/app/build/generated/res/react/${flavor}/release`], rootDir, 'bundle.log');

  logStep('1b', 'Building Android APK...');
  await runCommandSilent('./gradlew', [`assemble${capitalize(buildVariant)}`], androidDir, 'build.log');

  logStep(2, 'Processing Android build output...');
  fs.mkdirSync(otaDir, { recursive: true });

  const apkSrcPath = path.resolve(`${androidDir}/app/build/outputs/apk/${flavor}/release/app-${flavor}-release.apk`);
  const finalApkPath = path.join(otaDir, `GalaxyMe-android-${flavor}-v${version}.apk`);
  fs.copyFileSync(apkSrcPath, finalApkPath);
  console.log(`📂 APK saved at: ${chalk.green(finalApkPath)}`);

  logStep(3, 'Uploading APK to Worker...');
  const apkUrl = await uploadToWorker(finalApkPath, workerUrl, { platform: 'android', version, versionCode, type: 'apk' });

  const directApkUrl = getDirectDropboxLink(apkUrl);
  const finalInstallPageUrl = 'https://khang51403072.github.io/GalaxyMeOTA/index.html';
  console.log(chalk.greenBright(`\n🎉 DONE! Send this link or QR Code to your Android testers:`));
  console.log(chalk.cyan(finalInstallPageUrl));
  qrcode.generate(finalInstallPageUrl, { small: true });
}

// --- HÀM CHÍNH ---

async function publishApp(platform, configPath) {
  console.clear();
  console.log(chalk.greenBright(`
  ╔══════════════════════════════════════╗
  ║ 🚀 Welcome to Kota - App Publisher!  ║
  ╚══════════════════════════════════════╝
  `));

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const { outputDir, workerUrl } = config;
  const platformConfig = config[platform];

  if (!platformConfig) {
    throw new Error(`Configuration for platform "${platform}" not found in ${configPath}`);
  }

  const { flavor, version } = platformConfig;
  const versionCode = platform === 'ios' ? platformConfig.buildNumber : platformConfig.versionCode;
  const otaDir = path.resolve(outputDir);

  console.log(`📌 Platform: ${chalk.yellow(platform)}`);
  console.log(`📌 Flavor: ${chalk.yellow(flavor)}`);
  console.log(`📌 Version: ${chalk.yellow(version)} (Build: ${versionCode})`);
  console.log(`📦 OTA Output Dir: ${chalk.magenta(otaDir)}`);

  try {
    if (platform === 'android') {
      await handleAndroidPublish(otaDir, workerUrl, platformConfig);
    } else if (platform === 'ios') {
      await handleIOSPublish(otaDir, workerUrl, platformConfig);
    }
  } catch (err) {
    if (err.logFilePath) {
      console.error(chalk.red(`\n❌ Command failed: ${err.cmd}`));
      printErrorLog(err.logFilePath);
    } else {
      console.error(chalk.red(`\n❌ ${err.message}`));
    }
  }
}

if (require.main === module) {
  const [,, platform, configPath = 'kota.config.json'] = process.argv;
  if (!platform) {
    console.error(chalk.red('Usage: node kota/publish/publishApp.js <platform> [configPath]'));
    process.exit(1);
  }
  publishApp(platform, configPath);
}

module.exports = publishApp;