// Using Expo's built-in storage - will need to implement with expo-secure-store or similar
// import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConstructionProgress {
  stepIndex: number;
  completed: boolean;
  notes: string;
  startDate?: string;
  completionDate?: string;
}

const STORAGE_KEYS = {
  CONSTRUCTION_PROGRESS: 'construction_progress',
};

// In-memory storage for development
let memoryStorage: { [key: string]: string } = {};

export const StorageService = {
  saveProgress: async (progress: ConstructionProgress[]) => {
    try {
      memoryStorage[STORAGE_KEYS.CONSTRUCTION_PROGRESS] = JSON.stringify(progress);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  },

  loadProgress: async (): Promise<ConstructionProgress[] | null> => {
    try {
      const data = memoryStorage[STORAGE_KEYS.CONSTRUCTION_PROGRESS];
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  },

  clearProgress: async () => {
    try {
      delete memoryStorage[STORAGE_KEYS.CONSTRUCTION_PROGRESS];
      return true;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  },

  // Utility function to export progress data
  exportProgress: async () => {
    try {
      const progress = await StorageService.loadProgress();
      return progress ? JSON.stringify(progress, null, 2) : null;
    } catch (error) {
      console.error('Error exporting progress:', error);
      return null;
    }
  },
}; 