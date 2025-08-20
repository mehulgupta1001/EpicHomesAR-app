import {
    Viro3DObject,
    ViroAmbientLight,
    ViroAnimations,
    ViroARPlaneSelector,
    ViroARScene,
    ViroButton,
    ViroFlexView,
    ViroMaterials,
    ViroNode,
    ViroSpotLight,
    ViroText
} from '@reactvision/react-viro';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { LoadingOverlay } from './LoadingOverlay';

// Use proper Asset API for GLB file
const houseModel = Asset.fromModule(require('../../assets/models/houses/house.glb')).uri;

interface ARViewProps {
  onPlacementComplete?: () => void;
  onMeasurementsUpdate?: (measurements: any) => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}

const CONSTRUCTION_STEPS = [
  'Foundation',
  'Walls',
  'Roof',
  'Interior',
  'Finishing'
];

export const ARView: React.FC<ARViewProps> = ({
  onPlacementComplete,
  onMeasurementsUpdate,
  onRotateLeft,
  onRotateRight,
}) => {
  const [text, setText] = useState('Initializing AR...');
  const [currentStep, setCurrentStep] = useState(0);
  const [housePlaced, setHousePlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [arError, setArError] = useState<string | null>(null);

  useEffect(() => {
    // Check for AR compatibility
    const checkARCompatibility = async () => {
      try {
        // Simulate loading time for assets
        setTimeout(() => {
          setIsLoading(false);
          setText('Point camera at a flat surface');
        }, 2000);
      } catch (error) {
        setArError('AR not supported on this device');
        Alert.alert('AR Error', 'This device does not support AR features. Please use a compatible device.');
      }
    };
    
    checkARCompatibility();
  }, []);

  const onInitialized = (state: any, reason: any) => {
    if (state === 'TRACKING_NORMAL') {
      setText('Surface detected! Tap to place house');
    } else if (state === 'TRACKING_NONE') {
      setText('No surface detected');
    } else if (state === 'TRACKING_LIMITED') {
      setText('Poor tracking - move device slowly');
    }
  };

  const handlePlacement = () => {
    try {
      setHousePlaced(true);
      setText('House placed! Use gestures to interact');
      onPlacementComplete?.();
      
      // Update measurements
      const measurements = {
        width: 8.5,
        length: 12.0,
        height: 3.2,
        platformHeight: 0.3
      };
      onMeasurementsUpdate?.(measurements);
    } catch (error) {
      Alert.alert('Error', 'Failed to place house. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < CONSTRUCTION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Create materials for different construction phases
  ViroMaterials.createMaterials({
    foundation: {
      diffuseColor: '#8B4513',
      lightingModel: 'PBR',
    },
    walls: {
      diffuseColor: '#DEB887',
      lightingModel: 'PBR',
    },
    roof: {
      diffuseColor: '#8B4513',
      lightingModel: 'PBR',
    },
    interior: {
      diffuseColor: '#F5DEB3',
      lightingModel: 'PBR',
    },
    finished: {
      diffuseColor: '#DEB887',
      lightingModel: 'PBR',
    },
  });

  if (isLoading) {
    return <LoadingOverlay message="Loading AR Experience..." />;
  }

  if (arError) {
    return (
      <LoadingOverlay message={`AR Error: ${arError}`} />
    );
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 5, 1]}
        color="#ffffff"
        castsShadow={true}
        shadowMapSize={2048}
        shadowNearZ={2}
        shadowFarZ={7}
        shadowOpacity={0.7}
      />

      <ViroARPlaneSelector>
        <ViroNode position={[0, 0, -1]} dragType="FixedToWorld" onDrag={handlePlacement}>
          {housePlaced && (
            <>
              <Viro3DObject
                source={{ uri: houseModel }}
                position={[0, 0, 0]}
                scale={[0.5, 0.5, 0.5]}
                rotation={[0, 0, 0]}
                materials={['finished']}
                type="GLB"
                animation={{
                  name: 'rotate',
                  run: true,
                  loop: true,
                  interruptible: true,
                }}
              />
              
              <ViroText
                text={`Step ${currentStep + 1}: ${CONSTRUCTION_STEPS[currentStep]}`}
                scale={[0.5, 0.5, 0.5]}
                position={[0, 2, 0]}
                style={{
                  fontFamily: 'Arial',
                  fontSize: 20,
                  color: '#ffffff',
                  textAlign: 'center',
                }}
              />

              <ViroFlexView
                position={[0, -1.5, 0]}
                width={2}
                height={0.5}
                style={{ backgroundColor: '#000000', opacity: 0.8 }}
              >
                <ViroButton
                  source={require('../../assets/images/react-logo.png')}
                  gazeSource={require('../../assets/images/react-logo.png')}
                  position={[-0.8, 0, 0]}
                  scale={[0.2, 0.2, 0.2]}
                  onClick={prevStep}
                />
                <ViroButton
                  source={require('../../assets/images/react-logo.png')}
                  gazeSource={require('../../assets/images/react-logo.png')}
                  position={[0.8, 0, 0]}
                  scale={[0.2, 0.2, 0.2]}
                  onClick={nextStep}
                />
              </ViroFlexView>
            </>
          )}
        </ViroNode>
      </ViroARPlaneSelector>

      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={{
          fontFamily: 'Arial',
          fontSize: 30,
          color: '#ffffff',
          textAlign: 'center',
        }}
      />
    </ViroARScene>
  );
};

// Animation definitions
ViroAnimations.registerAnimations({
  rotate: {
    duration: 5000,
    properties: {
      rotateY: '+=360',
    },
  },
}); 