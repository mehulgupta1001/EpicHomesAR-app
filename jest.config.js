module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-webview|react-native-vision-camera)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
