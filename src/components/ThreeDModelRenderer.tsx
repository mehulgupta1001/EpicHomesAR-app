import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HouseType } from '../constants/houseTypes';

interface ThreeDModelRendererProps {
  selectedHouse: HouseType;
  onModelLoaded?: (model: any) => void;
  style?: any;
}

export const ThreeDModelRenderer: React.FC<ThreeDModelRendererProps> = ({
  selectedHouse,
  onModelLoaded,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate model loading
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, this would load the actual 3D model
        console.log('Loading 3D model:', selectedHouse.name);
        console.log('Model path:', selectedHouse.model);
        
        onModelLoaded?.(selectedHouse);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load 3D model');
        setIsLoading(false);
        console.error('Error loading 3D model:', err);
      }
    };

    loadModel();
  }, [selectedHouse, onModelLoaded]);

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading 3D Model...</Text>
          <Text style={styles.modelName}>{selectedHouse.name}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Text style={styles.modelName}>{selectedHouse.name}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.modelContainer}>
        <Text style={styles.modelTitle}>🏠 {selectedHouse.name}</Text>
        <Text style={styles.modelDescription}>{selectedHouse.description}</Text>
        
        {/* Placeholder for actual 3D model rendering */}
        <View style={styles.modelPlaceholder}>
          <Text style={styles.placeholderText}>3D Model View</Text>
          <Text style={styles.placeholderSubtext}>
            Dimensions: {selectedHouse.dimensions.width}m × {selectedHouse.dimensions.length}m × {selectedHouse.dimensions.height}m
          </Text>
          <Text style={styles.placeholderSubtext}>
            Platform Height: {selectedHouse.dimensions.platformHeight}m
          </Text>
        </View>

        {/* Materials List */}
        <View style={styles.materialsContainer}>
          <Text style={styles.materialsTitle}>Materials:</Text>
          {selectedHouse.materials.map((material, index) => (
            <Text key={index} style={styles.materialItem}>• {material}</Text>
          ))}
        </View>

        {/* Cultural Info */}
        <View style={styles.culturalContainer}>
          <Text style={styles.culturalTitle}>Cultural Information:</Text>
          <Text style={styles.culturalText}>{selectedHouse.culturalInfo}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  modelName: {
    color: '#ff821e',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modelContainer: {
    flex: 1,
    padding: 16,
  },
  modelTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modelDescription: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modelPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 4,
  },
  materialsContainer: {
    marginBottom: 16,
  },
  materialsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  materialItem: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 4,
  },
  culturalContainer: {
    marginBottom: 16,
  },
  culturalTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  culturalText: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
  },
});
