// Model Loading Service for Epic Homes AR
// Handles loading and management of 3D models

import { Platform } from 'react-native';

export interface ModelLoadResult {
  success: boolean;
  modelPath?: string;
  error?: string;
}

export class ModelLoader {
  /**
   * Load a 3D model - Maps string paths to Android asset paths
   * NOTE: GLB files must be manually copied to android/app/src/main/assets/models/houses/
   * Metro bundler cannot bundle GLB files directly
   * @param modelPath - String path to model (e.g., '../assets/models/houses/house.glb')
   * @returns Promise<ModelLoadResult>
   */
  static async loadModel(modelPath: string): Promise<ModelLoadResult> {
    try {
      console.log('Loading Epic Homes 3D model:', modelPath);

      // Validate model path
      if (!modelPath || typeof modelPath !== 'string') {
        throw new Error('Invalid model path');
      }

      // Extract file name
      let fileName = modelPath.split('/').pop() || 'model.glb';
      
      // Clean up filename - handle spaces in names like "4 Module - Blue.glb"
      fileName = fileName.trim();

      // For Android: Models must be manually copied to android/app/src/main/assets/models/houses/
      // WebView can access them via file:///android_asset/ prefix
      // Format: file:///android_asset/models/houses/filename.glb
      const androidAssetPath = `file:///android_asset/models/houses/${fileName}`;

      console.log('Resolved Android asset path:', androidAssetPath);
      
      // Return the Android asset path - WebView can directly load from there
      // No need to copy files if they're already in assets folder
      return {
        success: true,
        modelPath: androidAssetPath
      };

    } catch (error) {
      console.error('Epic Homes 3D model loading failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Preload multiple models for better performance
   * @param modelPaths - Array of model paths to preload
   * @returns Promise<ModelLoadResult[]>
   */
  static async preloadModels(modelPaths: string[]): Promise<ModelLoadResult[]> {
    const results: ModelLoadResult[] = [];
    
    for (const modelPath of modelPaths) {
      const result = await this.loadModel(modelPath);
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Get model info (size, format, etc.)
   * @param modelPath - Path to the model file
   * @returns Model information
   */
  static getModelInfo(modelPath: string) {
    const fileName = modelPath.split('/').pop() || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    return {
      fileName,
      extension,
      isGLB: extension === 'glb',
      isOBJ: extension === 'obj',
      isSupported: ['glb', 'obj'].includes(extension)
    };
  }
  
  /**
   * Validate model compatibility
   * @param modelPath - Path to the model file
   * @returns boolean
   */
  static isModelCompatible(modelPath: string): boolean {
    const info = this.getModelInfo(modelPath);
    return info.isSupported;
  }
}
