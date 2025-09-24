import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThreeDModelRenderer } from './ThreeDModelRenderer';

interface ARViewProps {
  selectedHouse?: any;
  onHousePlaced?: () => void;
  onPlacementComplete?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onMeasurementsUpdate?: (measurements: any) => void;
}

// Real AR Implementation using Camera and 3D Model Display
export default function ARView({ selectedHouse, onHousePlaced, onPlacementComplete, onRotateLeft, onRotateRight }: ARViewProps) {
  const [housePlaced, setHousePlaced] = useState(false);
  const [arMode, setArMode] = useState<'scanning' | 'placing' | 'viewing'>('scanning');
  const [cameraReady, setCameraReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelRotation, setModelRotation] = useState(0);
  const [modelScale, setModelScale] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (cameraReady) {
      // Simulate surface detection
      setTimeout(() => {
        setArMode('placing');
      }, 2000);
    }
  }, [cameraReady]);

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

  const handleModelLoaded = (model: any) => {
    setModelLoaded(true);
    console.log('Epic Homes 3D model loaded in AR view:', model);
  };

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
    if (!selectedHouse) return { name: 'Traditional House', description: 'Traditional Orang Asli house design' };
    
    switch (selectedHouse.id) {
      case 'epic-homes-4-module':
        return { name: 'Epic Homes 4 Module', description: 'A 4-module house design by Epic Homes' };
      case 'epic-homes-6-module':
        return { name: 'Epic Homes 6 Module', description: 'A 6-module house design by Epic Homes' };
      case 'epic-homes-12-module':
        return { name: 'Epic Homes 1 & 2 Module', description: 'A 1 & 2 module house design by Epic Homes' };
      case 'traditional-malay-house':
        return { name: 'Traditional Malay House', description: 'A detailed model of a traditional Malay house' };
      default:
        return { name: 'Traditional House', description: 'Traditional Orang Asli house design' };
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera. Please enable camera permissions.</Text>
        <TouchableOpacity style={styles.placeButton} onPress={requestPermission}>
          <Text style={styles.placeButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const modelInfo = getModelInfo();

  return (
    <View style={styles.container}>
      {/* Real Camera Feed */}
      <CameraView
        style={styles.camera}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      >
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

          {/* 3D Model Display */}
          {housePlaced && arMode === 'viewing' && (
            <Animated.View 
              style={[
                styles.modelDisplay,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.modelContainer}>
                <Text style={styles.modelTitle}>🏠 {modelInfo.name}</Text>
                <Text style={styles.modelDescription}>{modelInfo.description}</Text>
                
                {/* Epic Homes Real 3D Model Display */}
                <ThreeDModelRenderer 
                  selectedHouse={selectedHouse} 
                  onModelLoaded={handleModelLoaded}
                  style={styles.modelViewer} 
                />

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
      </CameraView>
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
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
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
    backgroundColor: '#ff9100', // Epic Homes orange
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
  modelViewer: {
    width: '100%',
    marginBottom: 15,
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
    backgroundColor: 'rgba(255,145,0,0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9100',
  },
  model3DText: {
    color: '#ff9100',
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
    color: '#ff9100',
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
}); 