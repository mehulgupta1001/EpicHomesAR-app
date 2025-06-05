import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

interface CachedAsset {
  uri: string;
  timestamp: number;
  size: number;
}

interface FileInfo extends FileSystem.FileInfo {
  size?: number;
}

class OfflineManager {
  private static instance: OfflineManager;
  private readonly CACHE_KEY = 'offline_assets_cache';
  private readonly assetDirectory = `${FileSystem.documentDirectory}offline_assets/`;
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
      // Create offline assets directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(this.assetDirectory, { intermediates: true });
      
      // Load cached assets info from storage
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        this.cachedAssets = new Map(Object.entries(JSON.parse(cachedData)));
      }

      // Ensure required assets are cached
      await this.ensureRequiredAssets();
    } catch (error) {
      console.error('Error initializing offline manager:', error);
      throw error;
    }
  }

  private async ensureRequiredAssets(): Promise<void> {
    const requiredAssets = [
      require('../../assets/models/houses/house.glb'),
      // Add other required assets here
    ];

    for (const asset of requiredAssets) {
      const assetModule = Asset.fromModule(asset);
      const assetUri = assetModule.uri;
      const assetName = assetUri.split('/').pop() || 'unknown';
      const targetPath = `${this.assetDirectory}${assetName}`;

      // Check if asset needs updating
      const cached = this.cachedAssets.get(assetName);
      if (!cached || cached.timestamp < (Date.now() - 7 * 24 * 60 * 60 * 1000)) { // 1 week old
        try {
          await FileSystem.downloadAsync(assetUri, targetPath);
          const info = await FileSystem.getInfoAsync(targetPath) as FileInfo;
          
          this.cachedAssets.set(assetName, {
            uri: targetPath,
            timestamp: Date.now(),
            size: info.size || 0
          });
          
          await this.saveCacheInfo();
        } catch (error) {
          console.error(`Error caching asset ${assetName}:`, error);
          // If download fails but we have a cached version, we'll use that
          if (!cached) throw error;
        }
      }
    }
  }

  private async saveCacheInfo(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.CACHE_KEY,
        JSON.stringify(Object.fromEntries(this.cachedAssets))
      );
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
      await FileSystem.deleteAsync(this.assetDirectory, { idempotent: true });
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