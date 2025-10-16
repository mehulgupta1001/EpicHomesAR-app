import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HouseType } from '../constants/houseTypes';

interface Standalone3DViewerProps {
  selectedHouse: HouseType;
  onClose?: () => void;
  style?: any;
}

export const Standalone3DViewer: React.FC<Standalone3DViewerProps> = ({ 
  selectedHouse, 
  onClose,
  style 
}) => {
  const getModelInfo = () => {
    if (!selectedHouse) {
      return {
        name: 'Epic Homes House',
        dimensions: 'Standard Size',
        materials: 'Traditional Materials'
      };
    }
    
    return {
      name: selectedHouse.name || 'Epic Homes House',
      dimensions: selectedHouse.dimensions || 'Standard Size',
      materials: selectedHouse.materials || 'Traditional Materials'
    };
  };

  const modelInfo = getModelInfo();

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏠 {modelInfo.name}</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3D Model Placeholder */}
      <View style={styles.modelContainer}>
        <View style={styles.modelPlaceholder}>
          <Text style={styles.placeholderText}>3D Model View</Text>
          <Text style={styles.placeholderSubtext}>
            {selectedHouse?.description || 'Epic Homes house model'}
          </Text>
        </View>
      </View>

      {/* Model Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Model Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dimensions:</Text>
          <Text style={styles.infoValue}>
            {selectedHouse?.dimensions ? 
              `${selectedHouse.dimensions.width}m × ${selectedHouse.dimensions.length}m × ${selectedHouse.dimensions.height}m` :
              'Standard Size'
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform Height:</Text>
          <Text style={styles.infoValue}>
            {selectedHouse?.dimensions?.platformHeight ? 
              `${selectedHouse.dimensions.platformHeight}m` :
              'Standard Height'
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Materials:</Text>
          <Text style={styles.infoValue}>
            {Array.isArray(selectedHouse?.materials) ? 
              selectedHouse.materials.join(', ') :
              'Traditional Materials'
            }
          </Text>
        </View>

        {selectedHouse?.culturalInfo && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cultural Info:</Text>
            <Text style={styles.infoValue}>{selectedHouse.culturalInfo}</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>🔄 Rotate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>🔍 Zoom</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>📏 Measure</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ff821e',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modelContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlButton: {
    backgroundColor: '#ff821e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
