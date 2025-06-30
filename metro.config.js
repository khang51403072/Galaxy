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

