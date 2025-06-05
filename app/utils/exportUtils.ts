import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ConstructionProgress } from '../services/storage';

interface ExportData {
  progress: ConstructionProgress[];
  exportDate: string;
  projectInfo: {
    totalSteps: number;
    completedSteps: number;
    completionPercentage: number;
  };
}

export const generateExportData = (progress: ConstructionProgress[], totalSteps: number): ExportData => {
  const completedSteps = progress.filter(p => p.completed).length;
  
  return {
    progress,
    exportDate: new Date().toISOString(),
    projectInfo: {
      totalSteps,
      completedSteps,
      completionPercentage: Math.round((completedSteps / totalSteps) * 100)
    }
  };
};

export const exportProgressReport = async (
  progress: ConstructionProgress[],
  totalSteps: number
): Promise<boolean> => {
  try {
    const exportData = generateExportData(progress, totalSteps);
    const jsonString = JSON.stringify(exportData, null, 2);
    
    const fileName = `epic-homes-progress-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, jsonString);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error exporting progress:', error);
    return false;
  }
}; 