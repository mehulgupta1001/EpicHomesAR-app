// Jest setup file for mocking native modules

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage: { [key: string]: string } = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => Promise.resolve(storage[key] || null)),
      setItem: jest.fn((key: string, value: string) => {
        storage[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(storage).forEach(key => delete storage[key]);
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
      multiGet: jest.fn((keys: string[]) =>
        Promise.resolve(keys.map(key => [key, storage[key] || null]))
      ),
      multiSet: jest.fn((pairs: [string, string][]) => {
        pairs.forEach(([key, value]) => {
          storage[key] = value;
        });
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: string[]) => {
        keys.forEach(key => delete storage[key]);
        return Promise.resolve();
      }),
    },
  };
});

// Mock react-native-vision-camera BEFORE any imports
jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Camera: class Camera extends React.Component {
      static requestCameraPermission = jest.fn(() => Promise.resolve('granted'));
      static getCameraPermissionStatus = jest.fn(() => Promise.resolve('granted'));
      render() {
        return React.createElement(View, this.props);
      }
    },
    useCameraDevices: jest.fn(() => ({
      find: jest.fn(() => ({ position: 'back', hasFlash: true })),
    })),
  };
});

// Mock react-native-webview
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => React.createElement(View, { ...props, ref })),
    WebView: React.forwardRef((props, ref) => React.createElement(View, { ...props, ref })),
  };
});

