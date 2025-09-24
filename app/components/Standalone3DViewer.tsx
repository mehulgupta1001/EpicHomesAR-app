import { Asset } from 'expo-asset';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Standalone3DViewerProps {
  selectedHouse: any;
  style?: any;
}

export const Standalone3DViewer: React.FC<Standalone3DViewerProps> = ({ 
  selectedHouse, 
  style 
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    try {
      // Create Three.js scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB); // Sky blue
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 3, 8);

      // Create renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x87CEEB, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Add ground plane
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Load the Epic Homes model
      await loadEpicHomesModel(scene, selectedHouse);

      // Start render loop
      const render = () => {
        if (modelRef.current) {
          // Apply rotation and scale
          modelRef.current.rotation.y = rotation * Math.PI / 180;
          modelRef.current.scale.setScalar(scale * 0.5);
        }
        
        renderer.render(scene, camera);
        gl.endFrameEXP();
        animationRef.current = requestAnimationFrame(render);
      };
      render();

    } catch (err) {
      console.error('Error creating 3D context:', err);
      setError('Failed to initialize 3D rendering');
    }
  };

  const loadEpicHomesModel = async (scene: THREE.Scene, house: any) => {
    if (!house) return;

    setLoading(true);
    setError(null);

    try {
      // Get the correct model path based on house type
      let modelAsset;
      switch (house.id) {
        case 'epic-homes-4-module':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/4 Module.glb'));
          break;
        case 'epic-homes-6-module':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/6 Module.glb'));
          break;
        case 'epic-homes-12-module':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/1 & 2 Module.glb'));
          break;
        case 'traditional-malay-house':
          modelAsset = Asset.fromModule(require('../../assets/models/houses/traditional-malay-house.glb'));
          break;
        default:
          modelAsset = Asset.fromModule(require('../../assets/models/houses/house.glb'));
      }

      // Download the asset
      await modelAsset.downloadAsync();
      console.log('Epic Homes model asset loaded:', modelAsset.uri);

      // Load the GLB model
      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          modelAsset.uri,
          (gltf) => resolve(gltf),
          (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
          },
          (error) => reject(error)
        );
      });

      // Remove existing model
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      // Add the new model
      const model = (gltf as any).scene;
      modelRef.current = model;

      // Initial scale and position
      model.scale.setScalar(0.5);
      model.position.set(0, 0, 0);

      // Enable shadows
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);

      setModelLoaded(true);
      console.log('Epic Homes 3D model loaded successfully in standalone viewer!');

    } catch (err) {
      console.error('Error loading Epic Homes model:', err);
      setError('Failed to load Epic Homes model');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Reload model when house changes
  useEffect(() => {
    if (sceneRef.current && selectedHouse) {
      loadEpicHomesModel(sceneRef.current, selectedHouse);
    }
  }, [selectedHouse]);

  const handleRotateLeft = () => {
    setRotation(prev => prev - 45);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 45);
  };

  const handleScaleUp = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleScaleDown = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setRotation(0);
    setScale(1);
  };

  const getModelInfo = () => {
    if (!selectedHouse) return { name: 'Traditional House', dimensions: '6.1m x 7.62m' };
    
    switch (selectedHouse.id) {
      case 'epic-homes-4-module':
        return { name: 'Epic Homes 4 Module', dimensions: '4.0m x 6.0m' };
      case 'epic-homes-6-module':
        return { name: 'Epic Homes 6 Module', dimensions: '6.0m x 8.0m' };
      case 'epic-homes-12-module':
        return { name: 'Epic Homes 1 & 2 Module', dimensions: '3.0m x 4.0m' };
      case 'traditional-malay-house':
        return { name: 'Traditional Malay House', dimensions: '6.1m x 7.62m' };
      default:
        return { name: 'Traditional House', dimensions: '6.1m x 7.62m' };
    }
  };

  const modelInfo = getModelInfo();

  return (
    <View style={[styles.container, style]}>
      {/* 3D Model Display */}
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>🔄 Loading Epic Homes 3D Model...</Text>
        </View>
      )}
      
      {/* Error Overlay */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            if (sceneRef.current && selectedHouse) {
              loadEpicHomesModel(sceneRef.current, selectedHouse);
            }
          }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Model Info */}
      <View style={styles.modelInfo}>
        <Text style={styles.modelTitle}>🏠 {modelInfo.name}</Text>
        <Text style={styles.modelDimensions}>Dimensions: {modelInfo.dimensions}</Text>
        {modelLoaded && (
          <Text style={styles.modelStatus}>✅ 3D Model Loaded</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlButton} onPress={handleRotateLeft}>
            <Text style={styles.controlText}>↻ Rotate Left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleRotateRight}>
            <Text style={styles.controlText}>↺ Rotate Right</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlButton} onPress={handleScaleUp}>
            <Text style={styles.controlText}>📏 Scale Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleScaleDown}>
            <Text style={styles.controlText}>📏 Scale Down</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Reset View</Text>
        </TouchableOpacity>
      </View>

      {/* Status Display */}
      {modelLoaded && (
        <View style={styles.statusDisplay}>
          <Text style={styles.statusText}>
            Rotation: {rotation}° | Scale: {scale.toFixed(1)}x
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  glView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modelInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    maxWidth: 250,
  },
  modelTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modelDimensions: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 5,
  },
  modelStatus: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  controlButton: {
    backgroundColor: '#ff9100',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusDisplay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
