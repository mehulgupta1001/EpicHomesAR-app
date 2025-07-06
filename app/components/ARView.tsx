import {
    Viro3DObject,
    ViroARPlaneSelector,
    ViroARScene,
    ViroARSceneNavigator,
    ViroAmbientLight,
    ViroMaterials,
    ViroNode,
    ViroPolyline,
    ViroQuad,
    ViroSpotLight,
    ViroText
} from '@reactvision/react-viro';
import { ViroARTrackingReasonConstants, ViroTrackingStateConstants } from '@reactvision/react-viro/dist/components/ViroConstants';
import { Asset } from 'expo-asset';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import houseTexture from '../../assets/models/houses/gltf_embedded_0.jpeg';
import houseModelFile from '../../assets/models/houses/house.glb';
import { HouseType } from '../constants/houseTypes';
import type { MetricCategory, MetricName } from '../utils/performanceMonitor';
import { performanceMonitor } from '../utils/performanceMonitor';
import { LoadingOverlay } from './LoadingOverlay';

// Define materials for different house types and parts
ViroMaterials.createMaterials({
  // Wood materials
  cengal: {
    diffuseColor: '#8D6E63',
    roughness: 0.7,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  meranti: {
    diffuseColor: '#A1887F',
    roughness: 0.6,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  bamboo: {
    diffuseColor: '#D7CCC8',
    roughness: 0.5,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  // Roofing materials
  nipah: {
    diffuseColor: '#795548',
    roughness: 0.8,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  rumbia: {
    diffuseColor: '#6D4C41',
    roughness: 0.8,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  'bamboo-shingle': {
    diffuseColor: '#5D4037',
    roughness: 0.6,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  // Binding materials
  rattan: {
    diffuseColor: '#8D6E63',
    roughness: 0.7,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  'natural-fiber': {
    diffuseColor: '#A1887F',
    roughness: 0.8,
    metalness: 0.1,
    lightingModel: "Physical",
  },
  'modern-binding': {
    diffuseColor: '#6D4C41',
    roughness: 0.5,
    metalness: 0.2,
    lightingModel: "Physical",
  },
  houseTextureMaterial: {
    diffuseTexture: { uri: houseTexture },
    lightingModel: 'Physical',
  },
  measurementLine: {
    diffuseColor: '#00ff00',
    lightingModel: "Constant",
  }
});

interface Measurements {
  width: number;
  length: number;
  height: number;
  platformHeight: number;
}

interface ARViewProps {
  onPlacementComplete: () => void;
  onMeasurementsUpdate: (measurements: Measurements) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  rotation: number;
  selectedHouse?: HouseType;
  selectedMaterials: Record<string, string>;
}

export const ARView: React.FC<ARViewProps> = ({
  onPlacementComplete,
  onMeasurementsUpdate,
  onRotateLeft,
  onRotateRight,
  rotation,
  selectedHouse,
  selectedMaterials,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaced, setIsPlaced] = useState<boolean>(false);
  const modelLoadingId = useRef<string | undefined>(undefined);
  const frameMetricId = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (frameMetricId.current) {
        performanceMonitor.endMetric(frameMetricId.current);
      }
    };
  }, []);

  const handleTrackingUpdated = (state: typeof ViroTrackingStateConstants[keyof typeof ViroTrackingStateConstants], reason?: typeof ViroARTrackingReasonConstants[keyof typeof ViroARTrackingReasonConstants]) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      if (frameMetricId.current) {
        performanceMonitor.endMetric(frameMetricId.current);
      }
      frameMetricId.current = performanceMonitor.startMetric('rendering', 'frame');
    }
  };

  const handleLoadStart = () => {
    modelLoadingId.current = performanceMonitor.startMetric('modelLoading' as MetricCategory, 'house_model' as MetricName);
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    if (modelLoadingId.current) {
      performanceMonitor.endMetric(modelLoadingId.current);
    }
    setIsLoading(false);
  };

  const handleError = (event: any) => {
    console.error('Error in AR view:', event.nativeEvent);
    Alert.alert(
      'AR Error',
      'There was an error in the AR experience. Please ensure you have sufficient lighting and a clear surface.',
      [{ text: 'OK' }]
    );
  };

  const handlePlacement = () => {
    setIsPlaced(true);
    onPlacementComplete();
    if (selectedHouse) {
      onMeasurementsUpdate(selectedHouse.dimensions);
    }
  };

  const getMaterialsForModel = () => {
    return selectedMaterials.wood || 'cengal';
  };

  const renderMeasurementLines = () => {
    if (!selectedHouse || !isPlaced) return null;

    const { width, length, height, platformHeight } = selectedHouse.dimensions;
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
          color="#00ff00"
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
          color="#00ff00"
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
          color="#00ff00"
        />
      </>
    );
  };

  const houseModel = Asset.fromModule(houseModelFile).uri;

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ViroARScene onTrackingUpdated={handleTrackingUpdated}>
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

              <ViroARPlaneSelector
                minHeight={0.5}
                minWidth={0.5}
                onPlaneSelected={handlePlacement}
                pauseUpdates={isPlaced}
              >
                <ViroNode
                  position={[0, 0, 0]}
                  rotation={[0, rotation, 0]}
                >
                  {selectedHouse && (
                    <Viro3DObject
                      source={{ uri: houseModel }}
                      resources={[{ uri: houseTexture }]}
                      scale={[1, 1, 1]}
                      type="GLB"
                      materials={[getMaterialsForModel(), 'houseTextureMaterial']}
                      lightReceivingBitMask={3}
                      shadowCastingBitMask={2}
                      transformBehaviors={['billboard']}
                      onLoadStart={handleLoadStart}
                      onLoadEnd={handleLoadEnd}
                      onError={handleError}
                    />
                  )}
                  
                  <ViroQuad
                    rotation={[-90, 0, 0]}
                    width={selectedHouse?.dimensions.width || 6.1}
                    height={selectedHouse?.dimensions.length || 7.62}
                    materials={['measurementLine']}
                    opacity={0.5}
                  />

                  {renderMeasurementLines()}
                </ViroNode>
              </ViroARPlaneSelector>

              {!isPlaced && (
                <ViroText
                  text="Tap on the surface to place the house"
                  scale={[0.5, 0.5, 0.5]}
                  position={[0, 0, -1]}
                  fontSize={16}
                  color="white"
                />
              )}
            </ViroARScene>
          ),
        }}
        style={styles.arView}
      />

      {isLoading && <LoadingOverlay message="Loading 3D Model..." />}
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
}); 