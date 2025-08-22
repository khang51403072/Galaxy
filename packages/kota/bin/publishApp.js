const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const fetch = require('node-fetch'); // nhớ cài: npm install node-fetch
const rootDir = process.cwd();
const androidDir = path.join(rootDir, 'android');
let archivePromise, finalIpaPath, finalManifestPath;
const iosDir = path.join(rootDir, 'ios');
const buildDir = path.join(iosDir, 'build');
const archivePath = path.join(buildDir, 'GalaxyMe.xcarchive');
const exportDir = path.join(buildDir, 'export');
const FormData = require('form-data'); 
const { runCommandSilent } = require('../src/utils/gitHelpers');
const plist = require('plist'); 

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
// Tách hàm upload chung
async function uploadToWorker(filePath, platform, version, versionCode, type, workerUrl) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('platform', platform);
  form.append('version', version);
  form.append('versionCode', versionCode);
  form.append('type', type);

  const res = await fetch(`${workerUrl}/upload`, { method: 'POST', body: form });
  const result = await res.json();

  if (!res.ok) throw new Error(`Upload ${type} failed: ${JSON.stringify(result)}`);
  console.log(chalk.green(`✅ Upload ${type} completed: ${JSON.stringify(result)}`));
  // Giả sử worker trả về JSON có chứa trường `url`
  if (!result.url) {
    throw new Error('Worker response did not include a URL for the uploaded file.');
  }
  return result.url; 
}
async function publishApp(platform, flavor, configPath) {
  console.clear();
  console.log(chalk.greenBright(`
  ╔══════════════════════════════════════╗
  ║ 🚀 Welcome to Kota - App Publisher!  ║
  ╚══════════════════════════════════════╝
  `));

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const { outputDir, workerUrl, version, versionCode, type } = config;
  const otaDir = path.resolve(outputDir);

  console.log(`📌 Platform: ${chalk.yellow(platform)}`);
  console.log(`📌 Flavor: ${chalk.yellow(flavor)}`);
  console.log(`📦 OTA Output Dir: ${chalk.magenta(otaDir)}`);

  // STEP 1: Build
  logStep(1, `Building ${platform} (${flavor})...`);
  let buildPromise;
  if (platform === 'android') {
    const buildVariant = `${flavor}Release`;
    buildPromise = runCommandSilent('./gradlew', [`assemble${capitalize(buildVariant)}`], androidDir, 'build.log');
    try {
      console.log('📦 Bundling OTA file...');
      await runCommandSilent(
        'npx',
        [
          'react-native',
          'bundle',
          '--platform', 'android',
          '--dev', 'false',
          '--entry-file', 'index.js',
          '--bundle-output', `android/app/build/generated/assets/react/${flavor}/release/index.android.bundle`,
          '--assets-dest', `android/app/build/generated/res/react/${flavor}/release`
        ],
        rootDir,
        'bundle.log'
      );
    } catch (err) {
      console.error(`❌ Bundle failed! See ${err} for details.`);
      return;
    }
    const logPath = await buildPromise;
    console.log(chalk.green(`✅ Build completed! Log: ${logPath}`));
    
  } else if (platform === 'ios') {
    // Đối với iOS, chúng ta không cần bundle riêng, Xcode sẽ làm việc đó.
    // Lệnh build của iOS là một chuỗi 2 bước: archive và export.
    
    // Bước 1.1: Archive
    console.log('📦 Archiving iOS app...');
    const scheme = 'GalaxyMe'; // Thay bằng scheme của bạn nếu khác
    archivePromise = runCommandSilent(
      'xcodebuild',
      [
        'archive',
        '-workspace', `${iosDir}/${scheme}.xcworkspace`,
        '-scheme', scheme,
        '-sdk', 'iphoneos',
        '-configuration', 'Release',
        '-archivePath', archivePath,
      ],
      iosDir,
      'build.log'
    );

    const archiveLogPath = await archivePromise;
    console.log(chalk.green(`✅ Archive completed! Log: ${archiveLogPath}`));

    // Bước 1.2: Export Archive để tạo .ipa và manifest.plist
    logStep('1b', 'Exporting .ipa from archive...');
    const exportOptionsPath = path.join(iosDir, `/ExportOptions.plist`); // Đường dẫn đến file plist
    console.log(chalk.green(`✅ Exporting: ${exportOptionsPath}`));
    await runCommandSilent(
      'xcodebuild',
      [
        '-exportArchive',
        '-archivePath', archivePath,
        '-exportPath', exportDir,
        '-exportOptionsPlist', exportOptionsPath,
      ],
      iosDir,
      'export.log'
    );
    console.log(chalk.green(`✅ Export completed! Files are in: ${exportDir}`));
  } 
  else {
    console.error(chalk.red('❌ Unknown platform'));
    process.exit(1);
  }

  try {
    

    // STEP 2: Copy file
    logStep(2, 'Copying build output...');
    fs.mkdirSync(otaDir, { recursive: true });
    let finalApkPath = '';
    if (platform === 'android') {
      const apkPath = path.resolve(`${androidDir}/app/build/outputs/apk/${flavor}/release/app-${flavor}-release.apk`);
      finalApkPath = path.join(otaDir, `GalaxyMe-${platform}-${flavor}.apk`);
      fs.copyFileSync(apkPath, finalApkPath);
      console.log(`📂 APK saved at: ${chalk.green(finalApkPath)}`);

      //
      const bundleSrc = path.resolve(`${androidDir}/app/build/generated/assets/react/${flavor}/release/index.android.bundle`);
      finalBundlePath = path.join(otaDir, `bundle_${new Date().toISOString().replace(/[-:.TZ]/g, '')}.jsbundle`);
      fs.copyFileSync(bundleSrc, finalBundlePath);
      console.log(`📂 Bundle saved at: ${chalk.green(finalBundlePath)}`);
    }

    // STEP 3: Upload lên Worker
    logStep(3.1, `Uploading to Worker: ${workerUrl}`);
    await uploadToWorker(finalApkPath, platform, version, versionCode, type, workerUrl);

    // STEP 3.1: Upload Bundle
    logStep(3.2, `Uploading Bundle to Worker: ${workerUrl}`);
    await uploadToWorker(finalBundlePath, platform, version, versionCode, 'bundle', workerUrl);


  } catch (err) {
    if (err.logFilePath) {
      console.error(chalk.red(`\n❌ Command failed: ${err.cmd}`));
      printErrorLog(err.logFilePath);
    } else {
      console.error(chalk.red(`❌ ${err.message}`));
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

if (require.main === module) {
  const [,, platform, flavor, configPath = 'kota.config.json'] = process.argv;
  if (!platform || !flavor) {
    console.error(chalk.red('Usage: node kota/publish/publishApp.js <platform> <flavor> [configPath]'));
    process.exit(1);
  }
  publishApp(platform, flavor, configPath);
}

module.exports = publishApp;
