// metro.config.js
// const { getDefaultConfig } = require('@react-native/metro-config');

// module.exports = (async () => {
//   const {
//     resolver: { assetExts, sourceExts },
//     transformer,
//   } = await getDefaultConfig();

//   return {
//     transformer: {
//       ...transformer,
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       // Giữ toàn bộ assetExts (jpg, png, ttf, otf, mp3…) ngoại trừ svg
//       assetExts: assetExts.filter(ext => ext !== 'svg'),
//       // Thêm svg vào sourceExts để transform bằng svg-transformer
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   };
// })();

// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const path = require('path');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const defaultConfig = getDefaultConfig(__dirname);

// module.exports = mergeConfig(defaultConfig, {
//   resolver: {
//     assetExts: [...defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), 'ttf'], // 👈 thêm định dạng .ttf
//   },
//   watchFolders: [
//     path.resolve(__dirname, 'src/shared/assets/fonts'), // 👈 để hot reload biết theo dõi fonts
//   ],
// });


// metro.config.js (project root)
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = defaultConfig.resolver;

  return mergeConfig(defaultConfig, {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      // Giữ nguyên tất cả assetExts (png, jpg, ttf, mp3…)
      // Chỉ loại bỏ svg để nó được xử lý qua transformer
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      // Thêm svg vào sourceExts để bundler hiểu import .svg
      sourceExts: [...sourceExts, 'svg'],
    },
  });
})();

