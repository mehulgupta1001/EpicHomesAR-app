// Real 3D Model Viewer using WebView and Three.js
// This will render actual GLB models for Epic Homes AR

import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface ModelViewerProps {
  modelPath: string;
  rotation: number;
  scale: number;
  onLoadStart?: () => void;
  onLoadSuccess?: () => void;
  onLoadError?: (error: any) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelPath,
  rotation,
  scale,
  onLoadStart,
  onLoadSuccess,
  onLoadError,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  // HTML content with Three.js for GLB model rendering
  // Note: This uses CDN for Three.js - requires internet connection
  // For offline support, Three.js should be bundled locally
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Epic Homes 3D Model Viewer</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: transparent;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }
        #container {
          width: 100%;
          height: 100vh;
          position: relative;
        }
        #loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff821e;
          font-size: 16px;
          z-index: 1000;
        }
        #error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff6b6b;
          font-size: 14px;
          text-align: center;
          z-index: 1000;
        }
      </style>
    </head>
    <body>
      <div id="container">
        <div id="loading">Loading Epic Homes 3D Model...</div>
        <div id="error" style="display: none;"></div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

      <script>
        let scene, camera, renderer, model, controls;
        let isLoading = true;
        let hasError = false;

        function init() {
          // Create scene
          scene = new THREE.Scene();
          scene.background = new THREE.Color(0x000000);

          // Create camera
          camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.set(0, 0, 5);

          // Create renderer
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          document.getElementById('container').appendChild(renderer.domElement);

          // Add lighting
          const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(10, 10, 5);
          directionalLight.castShadow = true;
          scene.add(directionalLight);

          // Add controls
          controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;

          // Load the model
          loadModel();

          // Start render loop
          animate();
        }

        function loadModel() {
          const loader = new THREE.GLTFLoader();
          
          // Convert model path to proper URL
          const modelUrl = '${modelPath}';
          
          loader.load(
            modelUrl,
            function(gltf) {
              model = gltf.scene;
              
              // Scale and position the model
              model.scale.setScalar(${scale});
              model.rotation.y = ${rotation} * Math.PI / 180;
              
              // Enable shadows
              model.traverse(function(child) {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });
              
              scene.add(model);
              
              // Hide loading
              document.getElementById('loading').style.display = 'none';
              isLoading = false;
              
              // Notify React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'modelLoaded',
                success: true
              }));
            },
            function(progress) {
              console.log('Loading progress:', progress);
            },
            function(error) {
              console.error('Error loading model:', error);
              document.getElementById('loading').style.display = 'none';
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').innerHTML = 'Failed to load 3D model<br>Error: ' + error.message;
              isLoading = false;
              hasError = true;
              
              // Notify React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'modelLoaded',
                success: false,
                error: error.message
              }));
            }
          );
        }

        function animate() {
          requestAnimationFrame(animate);
          
          if (controls) {
            controls.update();
          }
          
          renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', function() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Listen for updates from React Native
        window.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'updateModel') {
              if (model) {
                model.rotation.y = data.rotation * Math.PI / 180;
                model.scale.setScalar(data.scale);
              }
            }
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        });

        // Initialize when page loads
        window.addEventListener('load', init);
      </script>
    </body>
    </html>
  `;

  // Update model when props change
  useEffect(() => {
    if (webViewRef.current && !isLoading) {
      const message = JSON.stringify({
        type: 'updateModel',
        rotation: rotation,
        scale: scale,
      });
      webViewRef.current.postMessage(message);
    }
  }, [rotation, scale, isLoading]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'modelLoaded') {
        setIsLoading(false);
        if (data.success) {
          onLoadSuccess?.();
        } else {
          onLoadError?.(data.error);
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoadStart={() => {
          setIsLoading(true);
          onLoadStart?.();
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default ModelViewer;
