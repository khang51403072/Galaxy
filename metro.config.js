// metro.config.js (project root)
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = defaultConfig.resolver;
  const path = require("path");
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, "../..");
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
      // Alias configuration
      alias: {
        '@': './src',
        '@ext': './src/shared/utils/extensions',
      },
      nodeModulesPaths: [
        path.resolve(projectRoot, 'node_modules'),path.resolve(workspaceRoot, 'node_modules'),
      ],
      disableHierarchicalLookup: true,
    },
    
  });
})();

