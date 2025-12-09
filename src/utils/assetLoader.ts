// Pure React Native asset loader - simplified version without Expo dependencies

interface AssetManifest {
  models: string[];
  textures: string[];
}

const ASSET_MANIFEST: AssetManifest = {
  models: [
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
  ],
  textures: [
    // Add texture paths here when needed
  ],
};

class AssetLoader {
  private static instance: AssetLoader;
  private loadedAssets: Map<string, any> = new Map();
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
      // In Pure React Native, assets are bundled and don't need preloading
      // Just mark them as available
      ASSET_MANIFEST.models.forEach((modelPath) => {
        this.loadedAssets.set(modelPath, { uri: `asset://${modelPath}` });
        console.log(`Marked model as available: ${modelPath}`);
      });

      ASSET_MANIFEST.textures.forEach((texturePath) => {
        this.loadedAssets.set(texturePath, { uri: `asset://${texturePath}` });
        console.log(`Marked texture as available: ${texturePath}`);
      });

      console.log('Asset preload complete');
    } catch (error) {
      console.error('Error preloading assets:', error);
      throw error;
    } finally {
      this.isPreloading = false;
    }
  }

  getAsset(path: string): any | undefined {
    return this.loadedAssets.get(path);
  }

  async clearCache(): Promise<void> {
    try {
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
