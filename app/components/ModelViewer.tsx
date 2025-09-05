import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Asset } from 'expo-asset';

interface ModelViewerProps {
  selectedHouse: any;
  style?: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ModelViewer: React.FC<ModelViewerProps> = ({ selectedHouse, style }) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelPath, setModelPath] = useState<string>('');

  useEffect(() => {
    loadModel();
  }, [selectedHouse]);

  const loadModel = async () => {
    try {
      let modelAsset;
      
      switch (selectedHouse?.id) {
        case 'epic-homes-4-module':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/4 Module.glb'));
          break;
        case 'epic-homes-6-module':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/6 Module.glb'));
          break;
        case 'epic-homes-12-module':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/1 & 2 Module.glb'));
          break;
        case 'traditional-malay-house':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/traditional-malay-house.glb'));
          break;
        default:
          modelAsset = Asset.fromModule(require('../../assets/models/houses/house.glb'));
      }

      await modelAsset.downloadAsync();
      setModelPath(modelAsset.uri);
      setModelLoaded(true);
      console.log('Epic Homes model loaded:', modelAsset.uri);
    } catch (error) {
      console.error('Error loading Epic Homes model:', error);
      setModelLoaded(false);
    }
  };

  const getModelInfo = () => {
    if (!selectedHouse) return { name: 'Traditional House', dimensions: '6.1m x 7.62m' };
    
    switch (selectedHouse.id) {
      case 'epic-homes-4-module':
        return { name: 'Epic Homes 4 Module', dimensions: '4.0m x 6.0m' };
      case 'epic-homes-6-module':
        return { name: 'Epic Homes 6 Module', dimensions: '6.0m x 8.0m' };
      case 'epic-homes-12-module':
        return { name: 'Epic Homes 1 & 2 Module', dimensions: '3.0m x 4.0m' };
      case 'traditional-malay-house':
        return { name: 'Traditional Malay House', dimensions: '6.1m x 7.62m' };
      default:
        return { name: 'Traditional House', dimensions: '6.1m x 7.62m' };
    }
  };

  const modelInfo = getModelInfo();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.modelContainer}>
        <Text style={styles.modelTitle}>🏠 {modelInfo.name}</Text>
        <Text style={styles.modelDimensions}>Dimensions: {modelInfo.dimensions}</Text>
        
        {modelLoaded ? (
          <View style={styles.modelLoaded}>
            <Text style={styles.loadedText}>✅ Epic Homes Model Loaded</Text>
            <Text style={styles.modelPath}>GLB: {modelPath.split('/').pop()}</Text>
            <Text style={styles.readyText}>Ready for AR Visualization</Text>
          </View>
        ) : (
          <View style={styles.modelLoading}>
            <Text style={styles.loadingText}>🔄 Loading Epic Homes Model...</Text>
          </View>
        )}

        {/* 3D Model Visualization Placeholder */}
        <View style={styles.model3D}>
          <Text style={styles.model3DText}>📐</Text>
          <Text style={styles.model3DLabel}>3D Model</Text>
          <Text style={styles.model3DSubtext}>Epic Homes House</Text>
          <Text style={styles.model3DSubtext}>Scale: 1:1</Text>
        </View>

        {/* Model Details */}
        <View style={styles.modelDetails}>
          <Text style={styles.detailsTitle}>Model Information:</Text>
          <Text style={styles.detailText}>• Format: GLB (3D Model)</Text>
          <Text style={styles.detailText}>• Status: {modelLoaded ? 'Loaded' : 'Loading'}</Text>
          <Text style={styles.detailText}>• Epic Homes Design: {selectedHouse?.isEpicHomes ? 'Yes' : 'No'}</Text>
          <Text style={styles.detailText}>• AR Ready: {modelLoaded ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modelContainer: {
    alignItems: 'center',
    padding: 20,
  },
  modelTitle: {
    color: '#ff9100',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  modelDimensions: {
    color: 'white',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  modelLoaded: {
    backgroundColor: 'rgba(0,255,0,0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  loadedText: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modelPath: {
    color: 'white',
    fontSize: 10,
    marginBottom: 5,
  },
  readyText: {
    color: '#00FF00',
    fontSize: 12,
  },
  modelLoading: {
    backgroundColor: 'rgba(255,145,0,0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ff9100',
    fontSize: 14,
    fontWeight: 'bold',
  },
  model3D: {
    backgroundColor: 'rgba(255,145,0,0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9100',
    minHeight: 120,
    justifyContent: 'center',
  },
  model3DText: {
    fontSize: 32,
    marginBottom: 10,
  },
  model3DLabel: {
    color: '#ff9100',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  model3DSubtext: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
  modelDetails: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  detailsTitle: {
    color: '#ff9100',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 3,
  },
});
