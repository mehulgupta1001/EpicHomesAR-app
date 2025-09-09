import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ThreeDModelRendererProps {
  selectedHouse: any;
  onModelLoaded?: (model: THREE.Group) => void;
  style?: any;
}

export const ThreeDModelRenderer: React.FC<ThreeDModelRendererProps> = ({ 
  selectedHouse, 
  onModelLoaded,
  style 
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    try {
      // Create Three.js scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);

      // Create renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0xf0f0f0, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Add ground plane
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1;
      ground.receiveShadow = true;
      scene.add(ground);

      // Load the Epic Homes model
      await loadEpicHomesModel(scene, selectedHouse);

      // Start render loop
      const render = () => {
        if (modelRef.current) {
          // Auto-rotate the model
          modelRef.current.rotation.y += 0.01;
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

      // Scale and position the model
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

      // Notify parent component
      if (onModelLoaded) {
        onModelLoaded(model);
      }

      setModelLoaded(true);
      console.log('Epic Homes 3D model loaded successfully!');

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

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>🔄 Loading Epic Homes 3D Model...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />

      {modelLoaded && (
        <View style={styles.modelInfo}>
          <Text style={styles.modelInfoText}>
            ✅ Epic Homes 3D Model Loaded
          </Text>
          <Text style={styles.modelInfoSubtext}>
            {selectedHouse?.name || 'Epic Homes House'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  },
  modelInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  modelInfoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modelInfoSubtext: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
});
