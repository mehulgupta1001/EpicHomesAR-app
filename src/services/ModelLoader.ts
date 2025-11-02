// Model Loading Service for Epic Homes AR
// Handles loading and management of 3D models

export interface ModelLoadResult {
  success: boolean;
  modelPath?: string;
  error?: string;
}

export class ModelLoader {
  /**
   * Load a 3D model from assets
   * @param modelPath - Path to the model file
   * @returns Promise<ModelLoadResult>
   */
  static async loadModel(modelPath: string): Promise<ModelLoadResult> {
    try {
      console.log('Loading Epic Homes 3D model:', modelPath);
      
      // Validate model path
      if (!modelPath || typeof modelPath !== 'string') {
        throw new Error('Invalid model path');
      }
      
      // Check if model path has valid extension
      if (!modelPath.includes('.glb') && !modelPath.includes('.obj')) {
        throw new Error('Unsupported model format. Only GLB and OBJ files are supported.');
      }
      
      // Convert relative path to Android/iOS asset path for WebView
      // Assets in React Native are bundled and accessible via file:// protocol
      let finalPath = modelPath;
      
      // Clean up the path - remove ../assets/ or ./assets/ prefix
      let cleanPath = modelPath
        .replace(/^\.\.\/assets\//, '')
        .replace(/^\.\/assets\//, '')
        .replace(/^assets\//, '');
      
      // For Android: assets are in android/app/src/main/assets/
      // WebView can access via file:///android_asset/ prefix
      // Note: Models must be copied to android/app/src/main/assets/ during build
      if (cleanPath.includes('models/')) {
        // Keep the models/ path structure
        finalPath = `file:///android_asset/${cleanPath}`;
      } else {
        // Fallback: assume it's already a valid path
        finalPath = modelPath.startsWith('file://') || modelPath.startsWith('http') 
          ? modelPath 
          : `file:///android_asset/models/houses/${cleanPath.split('/').pop()}`;
      }
      
      console.log('Resolved Epic Homes 3D model path:', finalPath);
      
      // Return immediately - actual loading happens in WebView
      return {
        success: true,
        modelPath: finalPath
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
