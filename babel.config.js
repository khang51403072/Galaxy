module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@ext': './src/shared/utils/extensions',
        },
      },
    ],
    'react-native-reanimated/plugin'
  ],
};
