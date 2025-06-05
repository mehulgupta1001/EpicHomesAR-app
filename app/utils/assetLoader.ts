import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

interface AssetManifest {
  models: string[];
  textures: string[];
}

const ASSET_MANIFEST: AssetManifest = {
  models: [
    require('../../assets/models/houses/house.glb'),
  ],
  textures: [
    // Add texture paths here when needed
  ],
};

class AssetLoader {
  private static instance: AssetLoader;
  private loadedAssets: Map<string, Asset> = new Map();
  private isPreloading = false;

  private constructor() {}

  static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  async preloadAssets(): Promise<void> {
    if (this.isPreloading) {
      console.log('Asset preloading already in progress');
      return;
    }

    this.isPreloading = true;
    console.log('Starting asset preload...');

    try {
      // Preload models
      const modelPromises = ASSET_MANIFEST.models.map(async (modelPath) => {
        const asset = Asset.fromModule(modelPath);
        await asset.downloadAsync();
        this.loadedAssets.set(modelPath, asset);
        console.log(`Loaded model: ${modelPath}`);
      });

      // Preload textures
      const texturePromises = ASSET_MANIFEST.textures.map(async (texturePath) => {
        const asset = Asset.fromModule(texturePath);
        await asset.downloadAsync();
        this.loadedAssets.set(texturePath, asset);
        console.log(`Loaded texture: ${texturePath}`);
      });

      await Promise.all([...modelPromises, ...texturePromises]);
      console.log('Asset preload complete');
    } catch (error) {
      console.error('Error preloading assets:', error);
      throw error;
    } finally {
      this.isPreloading = false;
    }
  }

  getAsset(path: string): Asset | undefined {
    return this.loadedAssets.get(path);
  }

  async clearCache(): Promise<void> {
    try {
      const cacheDir = FileSystem.cacheDirectory + 'AssetLoader/';
      await FileSystem.deleteAsync(cacheDir, { idempotent: true });
      this.loadedAssets.clear();
      console.log('Asset cache cleared');
    } catch (error) {
      console.error('Error clearing asset cache:', error);
      throw error;
    }
  }

  isAssetLoaded(path: string): boolean {
    return this.loadedAssets.has(path);
  }
}

export const assetLoader = AssetLoader.getInstance(); 