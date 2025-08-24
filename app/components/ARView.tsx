import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ARViewProps {
  selectedHouse?: any;
  onHousePlaced?: () => void;
  onPlacementComplete?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onMeasurementsUpdate?: (measurements: any) => void;
}

const { height: screenHeight } = Dimensions.get('window');

export default function ARView({ selectedHouse, onHousePlaced }: ARViewProps) {
  const [housePlaced, setHousePlaced] = useState(false);
  const [arMode, setArMode] = useState<'scanning' | 'placing' | 'viewing'>('scanning');

  useEffect(() => {
    // Simulate surface detection after component mounts
    setTimeout(() => {
      setArMode('placing');
    }, 2000);
  }, []);

  const handlePlaceHouse = () => {
    setHousePlaced(true);
    setArMode('viewing');
    Alert.alert('House Placed!', 'The house has been placed in AR view. Use gestures to interact.');
    onHousePlaced?.();
  };

  const resetAR = () => {
    setHousePlaced(false);
    setArMode('scanning');
    // Simulate surface detection again
    setTimeout(() => {
      setArMode('placing');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* AR Background Simulation */}
      <View style={styles.arBackground}>
        <View style={styles.overlay}>
          {/* AR Scanning Interface */}
          {arMode === 'scanning' && (
            <View style={styles.scanningContainer}>
              <View style={styles.scanningFrame}>
                <Text style={styles.scanningText}>Move camera slowly to detect surfaces</Text>
                <View style={styles.scanningAnimation} />
              </View>
            </View>
          )}

          {/* AR Placement Interface */}
          {arMode === 'placing' && !housePlaced && (
            <View style={styles.placementContainer}>
              <View style={styles.placementGuide}>
                <Text style={styles.guideText}>Surface detected!</Text>
                <Text style={styles.guideSubtext}>Tap to place the house</Text>
                <TouchableOpacity style={styles.placeButton} onPress={handlePlaceHouse}>
                  <Text style={styles.placeButtonText}>Place House</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* AR House Display */}
          {housePlaced && arMode === 'viewing' && (
            <View style={styles.houseDisplay}>
              <View style={styles.houseModel}>
                <Text style={styles.houseText}>🏠 {selectedHouse?.name || 'Traditional House'}</Text>
                <Text style={styles.houseDetails}>
                  {selectedHouse?.description || 'Traditional Orang Asli house design'}
                </Text>
                
                {/* AR Controls */}
                <View style={styles.arControls}>
                  <TouchableOpacity style={styles.controlButton}>
                    <Text style={styles.controlText}>Rotate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                    <Text style={styles.controlText}>Scale</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                    <Text style={styles.controlText}>Materials</Text>
                  </TouchableOpacity>
                </View>

                {/* Construction Steps */}
                <View style={styles.constructionSteps}>
                  <Text style={styles.stepsTitle}>Construction Progress:</Text>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>✓ Foundation</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>✓ Walls</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>🔄 Roof (In Progress)</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>⏳ Interior</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>⏳ Finishing</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetAR}>
                <Text style={styles.resetButtonText}>Reset AR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arBackground: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,0,0.1)',
  },
  scanningText: {
    color: '#00FF00',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  scanningAnimation: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 25,
    borderTopColor: 'transparent',
  },
  placementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placementGuide: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    maxWidth: 300,
  },
  guideText: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  guideSubtext: {
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  placeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  placeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  houseDisplay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 20,
    padding: 20,
    maxHeight: screenHeight * 0.6,
  },
  houseModel: {
    alignItems: 'center',
  },
  houseText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  houseDetails: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  arControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  controlText: {
    color: 'white',
    fontSize: 12,
  },
  constructionSteps: {
    width: '100%',
    marginBottom: 20,
  },
  stepsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepItem: {
    paddingVertical: 5,
  },
  stepText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 