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
    
    // In Pure React Native, use react-native-share for file sharing
    // Note: This requires react-native-share to be installed
    // For now, return the data as a string that can be shared via clipboard or share API
    
    // Save to a temporary location for sharing
    // This will be handled by the calling component using react-native-share
    console.log('Export Data prepared:', jsonString);
    
    // Return success - actual sharing should be handled by the UI component
    // The component should use Share API or react-native-share library
    return true;
  } catch (error) {
    console.error('Error exporting progress:', error);
    return false;
  }
};
