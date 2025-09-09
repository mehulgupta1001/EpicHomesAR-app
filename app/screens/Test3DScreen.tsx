import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Standalone3DViewer } from '../components/Standalone3DViewer';
import { HOUSE_TYPES } from '../constants/houseTypes';

export default function Test3DScreen() {
  const [selectedHouse, setSelectedHouse] = useState(HOUSE_TYPES[0]);

  const handleHouseSelect = (house: any) => {
    setSelectedHouse(house);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏠 Epic Homes 3D Model Test</Text>
        <Text style={styles.headerSubtitle}>Real 3D Rendering with expo-gl + three.js</Text>
      </View>

      {/* House Selection */}
      <ScrollView horizontal style={styles.houseSelection} showsHorizontalScrollIndicator={false}>
        {HOUSE_TYPES.map((house) => (
          <TouchableOpacity
            key={house.id}
            style={[
              styles.houseCard,
              selectedHouse.id === house.id && styles.selectedHouseCard
            ]}
            onPress={() => handleHouseSelect(house)}
          >
            <Text style={styles.houseEmoji}>{house.emoji}</Text>
            <Text style={[
              styles.houseName,
              selectedHouse.id === house.id && styles.selectedHouseName
            ]}>
              {house.name}
            </Text>
            {house.isEpicHomes && (
              <Text style={styles.epicHomesBadge}>Epic Homes</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3D Model Viewer */}
      <View style={styles.viewerContainer}>
        <Standalone3DViewer selectedHouse={selectedHouse} />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>🎮 Controls:</Text>
        <Text style={styles.instructionText}>• Tap buttons to rotate and scale the 3D model</Text>
        <Text style={styles.instructionText}>• Epic Homes models are loaded from GLB files</Text>
        <Text style={styles.instructionText}>• Real-time 3D rendering with shadows and lighting</Text>
        <Text style={styles.instructionText}>• Select different house types to see various models</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#ff9100',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  houseSelection: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  houseCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedHouseCard: {
    backgroundColor: '#ff9100',
    borderColor: '#ff9100',
  },
  houseEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  houseName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  selectedHouseName: {
    color: 'white',
  },
  epicHomesBadge: {
    fontSize: 8,
    color: '#ff9100',
    fontWeight: 'bold',
    marginTop: 2,
  },
  viewerContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  instructions: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
