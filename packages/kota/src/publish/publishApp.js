#!/usr/bin/env node
const path = require('path');
const rootDir = process.cwd(); // thư mục gốc khi chạy "npm run ..."
const androidDir = path.join(rootDir, 'android');
const fs = require('fs');
const { runCommand, gitCloneOrPull, gitCommitAndPush } = require('../utils/gitHelpers');

function publishApp(platform, configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const { repo, branch, outputDir } = config;

  const otaDir = path.resolve(outputDir);

  console.log(`🚀 Publishing app for platform: ${platform}`);
  console.log(`📦 Output dir: ${otaDir}`);

  // 1. Build app
  if (platform === 'android') {
    runCommand(`cd ${androidDir} && ./gradlew assembleRelease`);
  } else if (platform === 'ios') {
    runCommand(`cd ios && xcodebuild -scheme GalaxyMe -configuration Release`);
  } else {
    console.error('❌ Unknown platform');
    process.exit(1);
  }

  // 2. Copy build output to OTA dir
  fs.mkdirSync(otaDir, { recursive: true });
  if (platform === 'android') {
    const apkPathString = `${androidDir}/app/build/outputs/apk/release/app-release.apk`
    const apkPath = path.resolve(apkPathString);
    fs.copyFileSync(apkPath, path.join(otaDir, `GalaxyMe-${platform}.apk`));
  } else {
    console.log('⚠️ iOS build copy step needs .ipa export configured manually.');
  }

  // 3. Push to git repo
  gitCloneOrPull(repo, branch, otaDir);
  gitCommitAndPush(otaDir, `Publish ${platform} app - ${new Date().toISOString()}`);

  console.log(`✅ Publish done!`);
}

if (require.main === module) {
  const [,, platform, configPath = 'kota.config.json'] = process.argv;
  if (!platform) {
    console.error('Usage: node kota/publish/publishApp.js <platform> [configPath]');
    process.exit(1);
  }
  publishApp(platform, configPath);
}

module.exports = publishApp;
