// Pure React Native offline manager - simplified version without Expo dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface CachedAsset {
  uri: string;
  timestamp: number;
  size: number;
}

class OfflineManager {
  private static instance: OfflineManager;
  private readonly CACHE_KEY = 'offline_assets_cache';
  private cachedAssets: Map<string, CachedAsset> = new Map();

  private constructor() {}

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Load cached assets info from storage
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        this.cachedAssets = new Map(Object.entries(JSON.parse(cachedData)));
      }

      // Ensure required assets are cached
      await this.ensureRequiredAssets();
    } catch (error: any) {
      console.error('Error initializing offline manager:', error);
      Alert.alert('Offline Asset Error', `Failed to initialize offline assets: ${error?.message || 'Unknown error'}`);
      throw error;
    }
  }

  private async ensureRequiredAssets(): Promise<void> {
    // In Pure React Native, we don't need to download assets as they're bundled
    // Just mark them as available
    const requiredAssets = [
      'house.glb',
      'traditional-malay-house.glb',
      '1 Module - Blue (centered).glb',
      '1 Module - Green (centered).glb',
      '1 Module - Brown (centered).glb',
      '2 Module - Blue (centered).glb',
      '2 Module - Green (centered).glb',
      '2 Module - Brown (centered).glb',
      '4 Module - Blue (centered).glb',
      '4 Module - Green (centered).glb',
      '4 Module - Brown (centered).glb',
      '6 Module - Blue (centered).glb',
      '6 Module - Green (centered).glb',
      '6 Module - Brown (centered).glb',
    ];

    for (const assetName of requiredAssets) {
      const cached = this.cachedAssets.get(assetName);
      if (!cached) {
        this.cachedAssets.set(assetName, {
          uri: `asset://${assetName}`, // Pure RN asset URI format
          timestamp: Date.now(),
          size: 0 // Size not available in Pure RN
        });
      }
    }
    
    await this.saveCacheInfo();
  }

  private async saveCacheInfo(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(Object.fromEntries(this.cachedAssets)));
    } catch (error) {
      console.error('Error saving cache info:', error);
      throw error;
    }
  }

  async getAssetUri(assetName: string): Promise<string> {
    const cached = this.cachedAssets.get(assetName);
    if (!cached) {
      throw new Error(`Asset ${assetName} not found in offline cache`);
    }
    return cached.uri;
  }

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
      this.cachedAssets.clear();
      await this.initialize(); // Reinitialize cache with required assets
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  getCacheSize(): number {
    return Array.from(this.cachedAssets.values())
      .reduce((total, asset) => total + asset.size, 0);
  }
}

export const offlineManager = OfflineManager.getInstance();
