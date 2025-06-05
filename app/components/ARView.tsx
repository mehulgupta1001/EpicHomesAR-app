import {
    Viro3DObject,
    ViroARPlaneSelector,
    ViroARScene,
    ViroARSceneNavigator,
    ViroAmbientLight,
    ViroErrorEvent,
    ViroMaterials,
    ViroNode,
    ViroPolyline,
    ViroQuad,
    ViroSpotLight,
    ViroText
} from '@viro-community/react-viro';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { assetLoader } from '../utils/assetLoader';
import { performanceMonitor } from '../utils/performanceMonitor';
import { LoadingOverlay } from './LoadingOverlay';

// Define materials for different house types
ViroMaterials.createMaterials({
  default: {
    diffuseColor: '#8D6E63',
    roughness: 0.7,
    metalness: 0.1,
    lightingModel: "PBR",
  },
  measurementLine: {
    diffuseColor: '#00ff00',
    lightingModel: "Constant",
  }
});

interface HouseModel {
  source: any;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: {
    width: number; // in meters
    length: number; // in meters
    height: number; // in meters
    platformHeight: number; // in meters
  };
}

// Real-world dimensions in meters
const HOUSE_MODEL: HouseModel = {
  source: require('../../assets/models/houses/house.glb'),
  // Scale will be adjusted based on the model's original size
  // This assumes a 1 unit = 1 meter in the original model
  scale: [1, 1, 1],
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  dimensions: {
    width: 6.1,  // 20 feet
    length: 7.62, // 25 feet
    height: 4.57, // 15 feet
    platformHeight: 1.22 // 4 feet
  }
};

interface Measurements {
  width: number;
  length: number;
  height: number;
  platformHeight: number;
}

interface ARViewProps {
  onPlacementComplete: () => void;
  onMeasurementsUpdate: (measurements: Measurements) => void;
  rotation: number;
}

type TrackingState = 'TRACKING' | 'NOT_TRACKING' | 'LIMITED';

interface TrackingUpdatedEvent {
  state: TrackingState;
  reason: number;
}

const ARScene: React.FC<{
  onPlacementComplete?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onMeasurementsUpdate?: (measurements: {
    width: number;
    length: number;
    height: number;
    platformHeight: number;
  }) => void;
}> = ({ onPlacementComplete, onRotateLeft, onRotateRight, onMeasurementsUpdate }) => {
  const [isPlaced, setIsPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [planeDetected, setPlaneDetected] = useState(false);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [modelScale, setModelScale] = useState<[number, number, number]>([1, 1, 1]);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);

  const handlePlacement = () => {
    if (!isPlaced) {
      setIsPlaced(true);
      onPlacementComplete?.();
      // Update measurements after placement
      if (onMeasurementsUpdate) {
        onMeasurementsUpdate(HOUSE_MODEL.dimensions);
      }
    }
  };

  const handleError = (event: NativeSyntheticEvent<ViroErrorEvent>) => {
    setModelLoadError(true);
    Alert.alert(
      'AR Error',
      `There was an error loading the AR experience: ${event.nativeEvent.error}. Please ensure you have sufficient lighting and a clear surface.`,
      [{ text: 'OK', onPress: () => setModelLoadError(false) }]
    );
  };

  const handleSurfaceFound = () => {
    setSurfaceDetected(true);
    Alert.alert('Surface Detected', 'You can now place the house model.');
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    // Model loaded successfully, now we can calculate the proper scale
    // This will be adjusted based on testing with the actual model
    calculateModelScale();
  };

  const calculateModelScale = () => {
    // This function will be fine-tuned based on the actual model's original dimensions
    // For now, we'll use a base scale that we can adjust easily
    const baseScale = 0.1; // This will be adjusted based on testing
    setModelScale([baseScale, baseScale, baseScale]);
  };

  const handlePlaneDetected = () => {
    setPlaneDetected(true);
  };

  const rotateLeft = () => {
    setModelRotation(([x, y, z]) => [x, y - 45, z]);
    onRotateLeft?.();
  };

  const rotateRight = () => {
    setModelRotation(([x, y, z]) => [x, y + 45, z]);
    onRotateRight?.();
  };

  // Function to create measurement lines
  const renderMeasurementLines = () => {
    if (!isPlaced) return null;

    const { width, length, height, platformHeight } = HOUSE_MODEL.dimensions;
    const halfWidth = width / 2;
    const halfLength = length / 2;

    return (
      <>
        {/* Width measurement */}
        <ViroPolyline
          position={[-halfWidth, platformHeight, -halfLength]}
          points={[[0, 0, 0], [width, 0, 0]]}
          thickness={0.01}
          materials={["measurementLine"]}
        />
        <ViroText
          text={`Width: ${width.toFixed(2)}m`}
          position={[0, platformHeight, -halfLength]}
          scale={[0.2, 0.2, 0.2]}
          style={{ color: '#00ff00' }}
        />

        {/* Length measurement */}
        <ViroPolyline
          position={[-halfWidth, platformHeight, -halfLength]}
          points={[[0, 0, 0], [0, 0, length]]}
          thickness={0.01}
          materials={["measurementLine"]}
        />
        <ViroText
          text={`Length: ${length.toFixed(2)}m`}
          position={[-halfWidth, platformHeight, 0]}
          scale={[0.2, 0.2, 0.2]}
          style={{ color: '#00ff00' }}
        />

        {/* Height measurement */}
        <ViroPolyline
          position={[-halfWidth, 0, -halfLength]}
          points={[[0, 0, 0], [0, height + platformHeight, 0]]}
          thickness={0.01}
          materials={["measurementLine"]}
        />
        <ViroText
          text={`Height: ${height.toFixed(2)}m`}
          position={[-halfWidth, height / 2, -halfLength]}
          scale={[0.2, 0.2, 0.2]}
          style={{ color: '#00ff00' }}
        />
      </>
    );
  };

  return (
    <ViroARScene onTrackingUpdated={handleSurfaceFound} onAnchorFound={handleSurfaceFound}>
      <ViroAmbientLight color="#FFFFFF" intensity={0.3} />
      <ViroSpotLight
        position={[0, 5, 0]}
        color="#FFFFFF"
        direction={[0, -1, 0]}
        intensity={0.7}
        attenuationStartDistance={5}
        attenuationEndDistance={10}
        innerAngle={5}
        outerAngle={20}
        castsShadow={true}
      />

      {/* Instructions Text */}
      {!surfaceDetected && (
        <ViroText
          text="Move your device slowly to detect a surface..."
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={{ fontSize: 30, color: 'white' }}
        />
      )}

      {surfaceDetected && !isPlaced && (
        <ViroText
          text="Tap on the surface to place the house"
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={{ fontSize: 16, color: 'white', textAlignVertical: 'center', textAlign: 'center' }}
        />
      )}

      <ViroARPlaneSelector
        minHeight={0.5}
        minWidth={0.5}
        onPlaneSelected={handlePlacement}
        onAnchorFound={handlePlaneDetected}
        pauseUpdates={isPlaced}
      >
        <ViroNode
          position={[0, 0, 0]}
          dragType="FixedToWorld"
          onDrag={() => {}}
        >
          <Viro3DObject
            source={HOUSE_MODEL.source}
            scale={modelScale}
            position={HOUSE_MODEL.position}
            rotation={modelRotation}
            type="GLB"
            materials={['default']}
            lightReceivingBitMask={3}
            shadowCastingBitMask={2}
            transformBehaviors={['billboard']}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
          <ViroQuad
            rotation={[-90, 0, 0]}
            width={HOUSE_MODEL.dimensions.width}
            height={HOUSE_MODEL.dimensions.length}
            shadowCastingBitMask={0}
            lightReceivingBitMask={2}
          />
          {renderMeasurementLines()}
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export const ARView: React.FC<ARViewProps> = ({
  onPlacementComplete,
  onMeasurementsUpdate,
  rotation
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const modelLoadingId = useRef<string>();
  const frameMetricId = useRef<string>();

  useEffect(() => {
    initializeAR();
    return () => {
      if (frameMetricId.current) {
        performanceMonitor.endMetric(frameMetricId.current);
      }
    };
  }, []);

  const initializeAR = async () => {
    const initMetricId = performanceMonitor.startMetric('arInitialization', 'startup');
    try {
      await assetLoader.preloadAssets();
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing AR:', error);
      Alert.alert(
        'Initialization Error',
        'Failed to initialize AR experience. Please ensure you have a compatible device and try again.'
      );
    } finally {
      performanceMonitor.endMetric(initMetricId);
    }
  };

  const handleTrackingUpdated = (event: NativeSyntheticEvent<TrackingUpdatedEvent>) => {
    if (event.nativeEvent.state === 'TRACKING') {
      if (frameMetricId.current) {
        performanceMonitor.endMetric(frameMetricId.current);
      }
      frameMetricId.current = performanceMonitor.startMetric('rendering', 'frame');
    }
  };

  const handleLoadStart = () => {
    modelLoadingId.current = performanceMonitor.startMetric('modelLoading', 'house_model');
  };

  const handleLoadEnd = () => {
    if (modelLoadingId.current) {
      performanceMonitor.endMetric(modelLoadingId.current);
    }
  };

  const handleError = (event: NativeSyntheticEvent<ViroErrorEvent>) => {
    console.error('Error in AR view:', event.nativeEvent.error);
    Alert.alert(
      'AR Error',
      'There was an error in the AR experience. Please ensure you have sufficient lighting and a clear surface.',
      [{ text: 'OK' }]
    );
  };

  if (isLoading) {
    return <LoadingOverlay message="Initializing AR Experience..." />;
  }

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ARScene
              onPlacementComplete={onPlacementComplete}
              onRotateLeft={() => {}}
              onRotateRight={() => {}}
              onMeasurementsUpdate={onMeasurementsUpdate}
            />
          ),
        }}
        style={styles.arView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}); 