// Pure React Native export utilities - simplified version without Expo dependencies
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
    
    // In Pure React Native, we would use a different approach for file sharing
    // For now, we'll just log the data and return success
    console.log('Export Data:', jsonString);
    
    // TODO: Implement actual file sharing using react-native-share or similar
    return true;
  } catch (error) {
    console.error('Error exporting progress:', error);
    return false;
  }
};
