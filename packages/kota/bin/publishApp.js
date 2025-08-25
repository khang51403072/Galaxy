const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');

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

/**
 * Cập nhật file manifest.plist với URL của file IPA mới.
 * @param {string} manifestPath - Đường dẫn đầy đủ đến file manifest.plist
 * @param {string} newIpaUrl - URL tải trực tiếp (.ipa?dl=1) mới
 */
function updateManifest(manifestPath, newIpaUrl) {
  console.log(`📝 Reading manifest file at: ${manifestPath}`);
  
  try {
    // Đọc nội dung file
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    
    // Chuyển đổi nội dung XML thành một đối tượng JavaScript
    const manifestJson = plist.parse(manifestContent);

    // Truy cập và cập nhật URL
    // Cấu trúc của manifest là: items -> mảng (lấy phần tử đầu) -> assets -> mảng (lấy phần tử đầu) -> url
    if (manifestJson.items && manifestJson.items[0] && manifestJson.items[0].assets && manifestJson.items[0].assets[0]) {
      console.log(`  -> Found old URL: ${manifestJson.items[0].assets[0].url}`);
      manifestJson.items[0].assets[0].url = newIpaUrl;
      console.log(`  -> Set new URL: ${newIpaUrl}`);
    } else {
      throw new Error("Manifest file has an unexpected structure.");
    }
    
    // Chuyển đổi đối tượng JavaScript trở lại thành chuỗi XML
    const updatedManifestContent = plist.build(manifestJson);

    // Ghi đè file manifest cũ với nội dung đã được cập nhật
    fs.writeFileSync(manifestPath, updatedManifestContent);
    
    console.log(chalk.green('✅ Manifest file updated successfully!'));

  } catch (error) {
    console.error(chalk.red(`❌ Failed to update manifest file: ${error.message}`));
    throw error; // Ném lỗi ra ngoài để dừng script
  }
}

// Tách hàm upload chung
async function uploadToWorker(filePath, platform, version, versionCode, type, workerUrl) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('platform', platform);
  form.append('version', version);
  form.append('versionCode', versionCode);
  form.append('type', type);

  try {
    const response = await axios.post(`${workerUrl}/upload`, form, {
      headers: form.getHeaders(), // Rất quan trọng, để axios dùng đúng header
      maxContentLength: Infinity, // Cho phép upload file lớn
      maxBodyLength: Infinity
    });

    const result = response.data;
    console.log(chalk.green(`✅ Upload ${type} completed: ${JSON.stringify(result)}`));
    return result.url; // Giả sử worker trả về url

  } catch (error) {
    if (error.response) {
      // Server đã trả về lỗi (vd: 400, 500)
      throw new Error(`Upload ${type} failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      throw new Error(`Upload ${type} failed: No response received. Error: ${error.message}`);
    } else {
      // Lỗi khác
      throw new Error(`Upload ${type} failed with error: ${error.message}`);
    }
  }
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
    let finalIntallPath = '';
    let finalBundlePath = '';
    if (platform === 'android') {
      const apkPath = path.resolve(`${androidDir}/app/build/outputs/apk/${flavor}/release/app-${flavor}-release.apk`);
      finalIntallPath = path.join(otaDir, `GalaxyMe-${platform}-${flavor}.apk`);
      fs.copyFileSync(apkPath, finalIntallPath);
      console.log(`📂 APK saved at: ${chalk.green(finalIntallPath)}`);

      //
      const bundleSrc = path.resolve(`${androidDir}/app/build/generated/assets/react/${flavor}/release/index.android.bundle`);
      finalBundlePath = path.join(otaDir, `bundle_${new Date().toISOString().replace(/[-:.TZ]/g, '')}.jsbundle`);
      fs.copyFileSync(bundleSrc, finalBundlePath);
      console.log(`📂 Bundle saved at: ${chalk.green(finalBundlePath)}`);
        // STEP 3: Upload lên Worker
      logStep(3.1, `Uploading to Worker: ${workerUrl}`);
      await uploadToWorker(finalIntallPath, platform, version, versionCode, type, workerUrl);

      // STEP 3.1: Upload Bundle
      // logStep(3.2, `Uploading Bundle to Worker: ${workerUrl}`);
      // await uploadToWorker(finalBundlePath, platform, version, versionCode, 'bundle', workerUrl);
    }
    else if(platform==='ios')
    {   
      // Tìm file .ipa và manifest.plist trong thư mục export
      const exportDir = path.join(rootDir, 'ios/build/export'); // Đường dẫn export của iOS
      const ipaFileName = fs.readdirSync(exportDir).find(file => file.endsWith('.ipa'));
      if (!ipaFileName) throw new Error('Could not find .ipa file in export directory.');

      const ipaSrcPath = path.join(exportDir, ipaFileName);
      finalIntallPath = path.join(otaDir, `GalaxyMe-${platform}-${flavor}.ipa`);
      fs.copyFileSync(ipaSrcPath, finalIntallPath);
      console.log(`📂 IPA saved at: ${chalk.green(finalIntallPath)}`);
      // STEP 3: Upload lên Worker
      logStep(3.1, `Uploading to Worker: ${workerUrl}`);
      // Giả sử hàm uploadToWorker trả về một object { success, url }
      const uploadResult = await uploadToWorker(finalIntallPath, platform, version, versionCode, 'ipa', workerUrl);
      console.log(`  -> IPA URL from worker: ${uploadResult}`);

      // 2. "Cook" the Manifest
      logStep(3.2, `Cooking the manifest file...`);
      // Lấy link tải trực tiếp
      const directIpaUrl = uploadResult.replace("&dl=0", "&dl=1").replace("?dl=0", "?dl=1");;
      // Lấy đường dẫn đến manifest gốc
      const manifestSrcPath = path.join(exportDir, 'manifest.plist');
      // Cập nhật manifest
      updateManifest(manifestSrcPath, directIpaUrl);

      // 3. Upload file manifest đã được cập nhật
      logStep(3.3, `Uploading updated manifest to Worker...`);
      const manifestUploadResult = await uploadToWorker(manifestSrcPath, platform, version, versionCode, 'manifest', workerUrl);
      
      // 4. Lấy link tải trực tiếp cho manifest
      const directManifestUrl = manifestUploadResult.replace("&dl=0", "&dl=1").replace("?dl=0", "?dl=1");;

      // 5. Tạo link cài đặt cuối cùng và in ra màn hình
      const installUrl = `itms-services://?action=download-manifest&url=${directManifestUrl}`;
      
      console.log(chalk.greenBright(`\n🎉 DONE! Send this link to your testers:`));
      console.log(chalk.cyan(installUrl));
    }
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
