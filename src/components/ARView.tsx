import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { HouseType } from '../constants/houseTypes';

interface ARViewProps {
  selectedHouse?: HouseType;
  onHousePlaced?: () => void;
  onPlacementComplete?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onMeasurementsUpdate?: (measurements: any) => void;
}

// Pure React Native AR Implementation with Real Camera
export default function ARView({ selectedHouse, onHousePlaced, onPlacementComplete, onRotateLeft, onRotateRight }: ARViewProps) {
  const [housePlaced, setHousePlaced] = useState(false);
  const [arMode, setArMode] = useState<'scanning' | 'placing' | 'viewing'>('scanning');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelRotation, setModelRotation] = useState(0);
  const [modelScale, setModelScale] = useState(1);
  const [hasPermission, setHasPermission] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  useEffect(() => {
    // Request camera permission
    const requestCameraPermission = async () => {
      try {
        console.log('Requesting camera permission...');
        const permission = await Camera.requestCameraPermission();
        console.log('Camera permission result:', permission);
        if (permission === 'granted') {
          console.log('Camera permission granted');
          setHasPermission(true);
          // Simulate surface detection after camera is ready
          setTimeout(() => {
            setSurfaceDetected(true);
            setArMode('placing');
          }, 3000);
        } else {
          console.log('Camera permission denied:', permission);
          Alert.alert(
            'Camera Permission Required',
            'Please enable camera access to use AR features. Go to Settings > Apps > Epic Homes AR > Permissions and enable Camera.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => requestCameraPermission() },
            ]
          );
        }
      } catch (error) {
        console.error('Camera permission error:', error);
        Alert.alert(
          'Camera Error',
          'Failed to access camera. Please check permissions in Settings.',
          [{ text: 'OK' }]
        );
      }
    };

    requestCameraPermission();
  }, []);

  const handlePlaceHouse = () => {
    setHousePlaced(true);
    setArMode('viewing');

    // Animate model appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    onPlacementComplete?.();
    onHousePlaced?.();
  };

  const resetAR = () => {
    setHousePlaced(false);
    setArMode('scanning');
    setModelLoaded(false);
    setModelRotation(0);
    setModelScale(1);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);

    setTimeout(() => {
      setArMode('placing');
    }, 2000);
  };

  // const handleModelLoaded = (model: any) => {
  //   setModelLoaded(true);
  //   console.log('Epic Homes 3D model loaded in AR view:', model);
  // };

  const handleRotateLeft = () => {
    setModelRotation(prev => prev - 45);
    onRotateLeft?.();
  };

  const handleRotateRight = () => {
    setModelRotation(prev => prev + 45);
    onRotateRight?.();
  };

  const handleScaleUp = () => {
    setModelScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleScaleDown = () => {
    setModelScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const getModelInfo = () => {
    if (!selectedHouse) {
      return { name: 'Traditional House', description: 'Traditional Orang Asli house design' };
    }

    return {
      name: selectedHouse.name,
      description: selectedHouse.description,
    };
  };

  const modelInfo = getModelInfo();

  // Show loading if no camera permission or device
  if (!hasPermission || !device) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {!hasPermission ? 'Requesting camera permission...' : 'Loading camera...'}
          </Text>
          {!device && (
            <Text style={styles.errorText}>
              Camera device not found. Please check if your device has a camera.
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Real Camera Feed */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={false}
        video={false}
      />

      {/* AR Overlay */}
      <View style={styles.overlay}>
          {/* Scanning Interface */}
          {arMode === 'scanning' && (
            <View style={styles.scanningContainer}>
              <View style={styles.scanningFrame}>
                <Text style={styles.scanningText}>Move camera slowly to detect surfaces</Text>
                <View style={styles.scanningAnimation} />
              </View>
            </View>
          )}

          {/* Placement Interface */}
          {arMode === 'placing' && !housePlaced && (
            <View style={styles.placementContainer}>
              <View style={styles.placementGuide}>
                <Text style={styles.guideText}>Surface detected!</Text>
                <Text style={styles.guideSubtext}>Tap to place your Epic Homes house</Text>
                <TouchableOpacity style={styles.placeButton} onPress={handlePlaceHouse}>
                  <Text style={styles.placeButtonText}>Place {modelInfo.name}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Surface Detection Indicator */}
          {surfaceDetected && (
            <View style={styles.surfaceIndicator}>
              <Text style={styles.surfaceText}>✓ Surface Ready</Text>
            </View>
          )}

          {/* 3D Model Display */}
          {housePlaced && arMode === 'viewing' && (
            <Animated.View
              style={[
                styles.modelDisplay,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.modelContainer}>
                <Text style={styles.modelTitle}>🏠 {modelInfo.name}</Text>
                <Text style={styles.modelDescription}>{modelInfo.description}</Text>

                {/* Epic Homes 3D Model Display */}
                <View style={styles.model3D}>
                  <Text style={styles.model3DText}>Epic Homes 3D Model</Text>
                  <Text style={styles.model3DSubtext}>Model: {selectedHouse?.model}</Text>
                  <Text style={styles.model3DSubtext}>Dimensions: {selectedHouse?.dimensions.width}m x {selectedHouse?.dimensions.length}m</Text>
                  <Text style={styles.model3DSubtext}>Height: {selectedHouse?.dimensions.height}m</Text>

                  {/* Model Preview */}
                  <View style={styles.modelPreview}>
                    <Text style={styles.modelPreviewText}>🏠</Text>
                    <Text style={styles.modelPreviewLabel}>3D Model Active</Text>
                  </View>
                </View>

                {/* AR Controls */}
                <View style={styles.arControls}>
                  <TouchableOpacity style={styles.controlButton} onPress={handleRotateLeft}>
                    <Text style={styles.controlText}>↻ Rotate Left</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton} onPress={handleRotateRight}>
                    <Text style={styles.controlText}>↺ Rotate Right</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton} onPress={handleScaleUp}>
                    <Text style={styles.controlText}>📏 Scale Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton} onPress={handleScaleDown}>
                    <Text style={styles.controlText}>📏 Scale Down</Text>
                  </TouchableOpacity>
                </View>

                {/* Model Status */}
                {modelLoaded && (
                  <View style={styles.modelStatus}>
                    <Text style={styles.statusText}>
                      ✅ Epic Homes 3D Model Active
                    </Text>
                    <Text style={styles.statusSubtext}>
                      Rotation: {modelRotation}° | Scale: {modelScale.toFixed(1)}x
                    </Text>
                  </View>
                )}

                {/* Construction Progress */}
                <View style={styles.constructionSteps}>
                  <Text style={styles.stepsTitle}>Construction Progress:</Text>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>✓ Foundation Complete</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepText}>✓ Walls Complete</Text>
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
            </Animated.View>
          )}
        </View>
      </View>
  );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
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
    backgroundColor: '#ff821e', // Epic Homes orange
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  placeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modelDisplay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 20,
    padding: 20,
    maxHeight: screenHeight * 0.6,
  },
  modelContainer: {
    alignItems: 'center',
  },
  modelTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modelDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  model3D: {
    backgroundColor: 'rgba(255,130,30,0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff821e',
  },
  model3DText: {
    color: '#ff821e',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  model3DSubtext: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
  modelPreview: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  modelPreviewText: {
    fontSize: 24,
    marginBottom: 5,
  },
  modelPreviewLabel: {
    color: '#ff821e',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  modelStatus: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  statusText: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusSubtext: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
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
  surfaceIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0,255,0,0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  surfaceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
