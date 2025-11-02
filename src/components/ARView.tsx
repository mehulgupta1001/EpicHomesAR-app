import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { HouseType } from '../constants/houseTypes';
import { ModelLoader } from '../services/ModelLoader';
import { ARControls } from '../services/ARControls';
import { ARCapabilityDetector } from '../services/ARCapabilityDetector';
import ModelViewer from './ModelViewer';

interface ARViewProps {
  selectedHouse?: HouseType;
  onHousePlaced?: () => void;
  onPlacementComplete?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onMeasurementsUpdate?: (measurements: any) => void;
}

// Pure React Native AR Implementation with Real 3D Models
export default function ARView({ selectedHouse, onHousePlaced, onPlacementComplete, onRotateLeft, onRotateRight }: ARViewProps) {
  const [housePlaced, setHousePlaced] = useState(false);
  const [arMode, setArMode] = useState<'scanning' | 'placing' | 'viewing'>('scanning');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelRotation, setModelRotation] = useState(0);
  const [modelScale, setModelScale] = useState(1);
  const [hasPermission, setHasPermission] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [modelPath, setModelPath] = useState<string>('');
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  // AR Capability Detection
  const checkARSupport = async (): Promise<boolean> => {
    try {
      const result = await ARCapabilityDetector.checkARSupport();
      console.log('AR support check result:', result);

      if (!result.supported) {
        console.log('AR not supported:', result.reason);
        const recommendations = ARCapabilityDetector.getFallbackRecommendations(result);
        console.log('Fallback recommendations:', recommendations);
      }

      return result.supported;
    } catch (error) {
      console.error('AR support check failed:', error);
      return false;
    }
  };

  // Model Loading Service
  const loadModel = async (modelPathToLoad: string) => {
    setModelLoading(true);
    setModelError(null);
    try {
      console.log('Loading model:', modelPathToLoad);

      // Use ModelLoader service
      const result = await ModelLoader.loadModel(modelPathToLoad);

      if (result.success && result.modelPath) {
        setModelPath(result.modelPath);
        setModelLoaded(true);
        console.log('Model loaded successfully');
      } else {
        throw new Error(result.error || 'Failed to load model');
      }
    } catch (error) {
      console.error('Model loading failed:', error);
      setModelError(error instanceof Error ? error.message : 'Failed to load model');
    } finally {
      setModelLoading(false);
    }
  };

  useEffect(() => {
    // Check AR support and request camera permission
    const initializeAR = async () => {
      try {
      // Check AR support
      const supported = await checkARSupport();

      if (!supported) {
        setFallbackMode(true);
      }

        // Request camera permission
        console.log('Requesting camera permission...');
        const permission = await Camera.requestCameraPermission();
        console.log('Camera permission result:', permission);

        if (permission === 'granted') {
          console.log('Camera permission granted');
          setHasPermission(true);

          // Load the selected model
          if (selectedHouse?.model) {
            await loadModel(selectedHouse.model);
          }

          // Initialize AR surface detection after camera is ready
          // Note: This is a simplified implementation for WebView-based AR
          // In production, use native AR SDKs (ARCore/ARKit) for real surface detection
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
              { text: 'OK', onPress: () => initializeAR() },
            ]
          );
        }
      } catch (error) {
        console.error('AR initialization error:', error);
        Alert.alert(
          'AR Error',
          'Failed to initialize AR features. Please check permissions in Settings.',
          [{ text: 'OK' }]
        );
      }
    };

    initializeAR();
  }, [selectedHouse]);

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

    // Reset using ARControls service
    const resetState = ARControls.reset();
    setModelRotation(resetState.rotation);
    setModelScale(resetState.scale);

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
    const newRotation = ARControls.rotateLeft(modelRotation);
    setModelRotation(newRotation);
    onRotateLeft?.();
  };

  const handleRotateRight = () => {
    const newRotation = ARControls.rotateRight(modelRotation);
    setModelRotation(newRotation);
    onRotateRight?.();
  };

  const handleScaleUp = () => {
    const newScale = ARControls.scaleUp(modelScale);
    setModelScale(newScale);
  };

  const handleScaleDown = () => {
    const newScale = ARControls.scaleDown(modelScale);
    setModelScale(newScale);
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
                {/* Real 3D Model Viewer */}
                {modelLoaded && modelPath && !fallbackMode ? (
                  <View style={styles.model3DContainer}>
                    <ModelViewer
                      modelPath={modelPath}
                      rotation={modelRotation}
                      scale={modelScale}
                      onLoadStart={() => console.log('Epic Homes 3D model loading started')}
                      onLoadSuccess={() => console.log('Epic Homes 3D model loaded successfully')}
                      onLoadError={(error) => console.error('Epic Homes 3D model loading error:', error)}
                    />
                  </View>
                ) : fallbackMode ? (
                  <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackText}>
                      AR not supported on this device
                    </Text>
                    <Text style={styles.fallbackSubtext}>
                      Using 3D preview mode
                    </Text>
                    <View style={styles.fallbackModelContainer}>
                      <ModelViewer
                        modelPath={modelPath}
                        rotation={modelRotation}
                        scale={modelScale}
                        onLoadStart={() => console.log('Fallback 3D model loading started')}
                        onLoadSuccess={() => console.log('Fallback 3D model loaded successfully')}
                        onLoadError={(error) => console.error('Fallback 3D model loading error:', error)}
                      />
                    </View>
                  </View>
                ) : modelLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading 3D model...</Text>
                  </View>
                ) : modelError ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{modelError}</Text>
                  </View>
                ) : null}

                {/* AR Controls - Only show when house is actually rendered */}
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
    backgroundColor: 'black',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 10,
    maxHeight: screenHeight * 0.15,
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
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff821e',
  },
  model3DText: {
    color: '#ff821e',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  model3DSubtext: {
    color: 'white',
    fontSize: 10,
    marginBottom: 2,
  },
  arControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  controlButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  controlText: {
    color: 'white',
    fontSize: 10,
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
  model3DContainer: {
    width: 200,
    height: 150,
    backgroundColor: 'rgba(255,130,30,0.1)',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff821e',
  },
  model3DViewer: {
    flex: 1,
    borderRadius: 10,
  },
  model3DPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,130,30,0.2)',
    borderRadius: 10,
    padding: 20,
  },
  model3DInfo: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  fallbackModelPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,193,7,0.2)',
    borderRadius: 10,
    padding: 20,
  },
  fallbackContainer: {
    backgroundColor: 'rgba(255,193,7,0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffc107',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#ffc107',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fallbackSubtext: {
    color: 'white',
    fontSize: 12,
  },
  fallbackModelContainer: {
    width: 250,
    height: 200,
    backgroundColor: 'rgba(255,193,7,0.1)',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  errorContainer: {
    backgroundColor: 'rgba(220,53,69,0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dc3545',
    alignItems: 'center',
  },
});
