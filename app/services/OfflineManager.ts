// Using Expo's built-in storage - will need to implement with expo-secure-store or similar
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
// @ts-ignore - expo-file-system type declarations issue
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import houseModelAsset from '../../assets/models/houses/house.glb';
import traditionalMalayModelAsset from '../../assets/models/houses/traditional-malay-house.glb';

// Temporary in-memory storage for development
let memoryStorage: { [key: string]: string } = {};

// Define house model paths using Asset API

const houseModel = Asset.fromModule(houseModelAsset).uri;
const traditionalMalayModel = Asset.fromModule(traditionalMalayModelAsset).uri;

interface CachedAsset {
  uri: string;
  timestamp: number;
  size: number;
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
      
      // Load cached assets info from storage (using in-memory storage for now)
      const cachedData = memoryStorage[this.CACHE_KEY];
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
    const requiredAssets = [
      houseModel,
      traditionalMalayModel,
      // Add other required assets here
    ];

    for (const asset of requiredAssets) {
      const assetModule = Asset.fromModule(asset);
      const assetUri = assetModule.uri;
      const assetName = assetUri.split('/').pop() || 'unknown';
      const targetPath = `${this.assetDirectory}${assetName}`;
      const cached = this.cachedAssets.get(assetName);
      if (!cached || cached.timestamp < (Date.now() - 7 * 24 * 60 * 60 * 1000)) { // 1 week old
        try {
          await FileSystem.downloadAsync(assetUri, targetPath);
          const info = await FileSystem.getInfoAsync(targetPath) as FileSystem.FileInfo;
          let size = 0;
          if (info.exists && info.size) {
            size = info.size;
          }
          this.cachedAssets.set(assetName, {
            uri: targetPath,
            timestamp: Date.now(),
            size
          });
          
          await this.saveCacheInfo();
        } catch (error: any) {
          console.error(`Error caching asset ${assetName}:`, error);
          Alert.alert('Asset Download Error', `Failed to download asset ${assetName}: ${error?.message || 'Unknown error'}`);
          if (!cached) throw error;
        }
      }
    }
  }

  private async saveCacheInfo(): Promise<void> {
    try {
      memoryStorage[this.CACHE_KEY] = JSON.stringify(Object.fromEntries(this.cachedAssets));
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
      delete memoryStorage[this.CACHE_KEY];
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