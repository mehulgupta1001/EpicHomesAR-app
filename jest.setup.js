// Mock ViroReact components for testing
jest.mock('@reactvision/react-viro', () => ({
  ViroARScene: 'ViroARScene',
  ViroText: 'ViroText',
  Viro3DObject: 'Viro3DObject',
  ViroAmbientLight: 'ViroAmbientLight',
  ViroSpotLight: 'ViroSpotLight',
  ViroARPlaneSelector: 'ViroARPlaneSelector',
  ViroNode: 'ViroNode',
  ViroFlexView: 'ViroFlexView',
  ViroButton: 'ViroButton',
  ViroMaterials: {
    createMaterials: jest.fn(),
  },
  ViroAnimations: {
    registerAnimations: jest.fn(),
  },
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({ uri: 'mock-uri' })),
  },
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock/documents/',
  cacheDirectory: '/mock/cache/',
  makeDirectoryAsync: jest.fn(),
  downloadAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
