// REAL AR Implementation using react-native-ar-viewer with ARCore
// This provides actual AR surface detection and 3D model rendering

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, InteractionManager } from 'react-native';
import { ArViewerView } from 'react-native-ar-viewer';
import { HouseType } from '../constants/houseTypes';

interface RealARViewProps {
  selectedHouse?: HouseType;
  onHousePlaced?: () => void;
  onPlacementComplete?: () => void;
  onError?: (error: string) => void;
}

export default function RealARView({ 
  selectedHouse, 
  onHousePlaced, 
  onPlacementComplete,
  onError 
}: RealARViewProps) {
  const arViewerRef = useRef<ArViewerView>(null);
  const [isARReady, setIsARReady] = useState(false);
  const [modelPath, setModelPath] = useState<string>('');
  const [arError, setArError] = useState<string | null>(null);
  const [shouldRenderAR, setShouldRenderAR] = useState(false);
  const [rnBridgeReady, setRnBridgeReady] = useState(false);
  const [renderDelayComplete, setRenderDelayComplete] = useState(false);

  // Convert model path for ARCore
  // react-native-ar-viewer for Android: models must be in assets folder
  // Path format: Relative path from assets root: "models/houses/filename.glb"
  useEffect(() => {
    // Reset states when house changes
    setShouldRenderAR(false);
    setIsARReady(false);
    setArError(null);
    setRenderDelayComplete(false);
    
    if (!selectedHouse) {
      console.warn('Real AR: No selectedHouse provided');
      setModelPath('');
      return;
    }

    // Extract model path - handle both 'model' and 'modelPath' properties
    const rawModelPath = (selectedHouse as any).model || (selectedHouse as any).modelPath;
    
    console.log('Real AR: Selected house:', selectedHouse.name);
    console.log('Real AR: House ID:', selectedHouse.id);
    console.log('Real AR: Raw model path:', rawModelPath);
    console.log('Real AR: Model path type:', typeof rawModelPath);
    console.log('Real AR: Full house object keys:', Object.keys(selectedHouse));

    if (!rawModelPath) {
      console.error('Real AR: selectedHouse.model is empty/undefined');
      console.error('Real AR: Available properties:', JSON.stringify(selectedHouse, null, 2));
      
      // Fallback: Try to get filename from house ID
      // All module houses now use centered versions
      let fallbackFileName = '';
      if (selectedHouse.id.includes('1-module') && selectedHouse.id.includes('blue')) {
        fallbackFileName = '1 Module - Blue (centered).glb';
      } else if (selectedHouse.id.includes('1-module') && selectedHouse.id.includes('green')) {
        fallbackFileName = '1 Module - Green (centered).glb';
      } else if (selectedHouse.id.includes('1-module') && selectedHouse.id.includes('brown')) {
        fallbackFileName = '1 Module - Brown (centered).glb';
      } else if (selectedHouse.id.includes('2-module') && selectedHouse.id.includes('blue')) {
        fallbackFileName = '2 Module - Blue (centered).glb';
      } else if (selectedHouse.id.includes('2-module') && selectedHouse.id.includes('green')) {
        fallbackFileName = '2 Module - Green (centered).glb';
      } else if (selectedHouse.id.includes('2-module') && selectedHouse.id.includes('brown')) {
        fallbackFileName = '2 Module - Brown (centered).glb';
      } else if (selectedHouse.id.includes('4-module') && selectedHouse.id.includes('blue')) {
        fallbackFileName = '4 Module - Blue (centered).glb';
      } else if (selectedHouse.id.includes('4-module') && selectedHouse.id.includes('green')) {
        fallbackFileName = '4 Module - Green (centered).glb';
      } else if (selectedHouse.id.includes('4-module') && selectedHouse.id.includes('brown')) {
        fallbackFileName = '4 Module - Brown (centered).glb';
      } else if (selectedHouse.id.includes('6-module') && selectedHouse.id.includes('blue')) {
        fallbackFileName = '6 Module - Blue (centered).glb';
      } else if (selectedHouse.id.includes('6-module') && selectedHouse.id.includes('green')) {
        fallbackFileName = '6 Module - Green (centered).glb';
      } else if (selectedHouse.id.includes('6-module') && selectedHouse.id.includes('brown')) {
        fallbackFileName = '6 Module - Brown (centered).glb';
      } else if (selectedHouse.id.includes('blue')) {
        fallbackFileName = '4 Module - Blue (centered).glb'; // Default to 4 Module if no module specified
      } else if (selectedHouse.id.includes('green')) {
        fallbackFileName = '4 Module - Green (centered).glb';
      } else if (selectedHouse.id.includes('brown')) {
        fallbackFileName = '4 Module - Brown (centered).glb';
      } else if (selectedHouse.id.includes('traditional')) {
        fallbackFileName = 'traditional-malay-house.glb';
      } else if (selectedHouse.id.includes('default')) {
        fallbackFileName = 'house.glb';
      }
      
      if (fallbackFileName) {
        console.log('Real AR: Using fallback filename:', fallbackFileName);
        const modelPathForAR = `models/houses/${fallbackFileName}`;
        setModelPath(modelPathForAR);
        return;
      }
      
      setModelPath('');
      return;
    }

    // Handle different path formats
    let fileName = '';
    if (typeof rawModelPath === 'string') {
      // Extract filename from path like "../assets/models/houses/house.glb" or "house.glb"
      fileName = rawModelPath.split('/').pop() || '';
      
      // If it's already just a filename, use it directly
      if (!fileName.endsWith('.glb')) {
        fileName = rawModelPath; // Might already be just filename
      }
    } else {
      console.error('Real AR: Model path is not a string:', rawModelPath);
      setModelPath('');
      return;
    }

    if (!fileName || !fileName.endsWith('.glb')) {
      console.error('Real AR: Invalid filename extracted:', fileName);
      setModelPath('');
      return;
    }

    // react-native-ar-viewer for Android path format:
    // README example shows: model={Platform.OS === 'android' ? 'dice.glb' : 'dice.usdz'}
    // This suggests just filename if in assets root, but our files are in models/houses/
    // Try both formats - library might auto-search subfolders
    // Format 1: Relative path (models/houses/filename.glb)
    const modelPathForAR = `models/houses/${fileName}`;
    setModelPath(modelPathForAR);
    console.log('Real AR: Final model path for ARCore:', modelPathForAR);
    console.log('Real AR: Model file exists at: android/app/src/main/assets/models/houses/', fileName);
    
    // Critical: Wait for React Native bridge to be ready before initializing AR
    // ARCore native code crashes if initialized before React Native is ready
    
    // Simplified approach with guaranteed state updates
    console.log('Real AR: Starting initialization sequence...');
    
    let cancelled = false;
    let fallbackTimer: NodeJS.Timeout | null = null;
    let interactionHandle: { cancel?: () => void } | null = null;
    
    // Step 1: Wait for React Native to settle
    const timer1 = setTimeout(() => {
      if (cancelled) return;
      console.log('Real AR: Step 1 complete - React Native settled');
      
      // Step 2: Try InteractionManager, but with a timeout fallback
      let interactionResolved = false;
      
      const proceedToRender = () => {
        if (cancelled || interactionResolved) return;
        interactionResolved = true;
        
        console.log('Real AR: proceedToRender called');
        
        // Step 3: Mark bridge ready immediately (use functional update to ensure it happens)
        setRnBridgeReady((prev) => {
          if (prev) return prev; // Already set
          console.log('Real AR: Step 3 - Setting rnBridgeReady to true');
          return true;
        });
        
        // Step 4: Final delay before rendering AR component
        setTimeout(() => {
          if (cancelled) return;
          setShouldRenderAR((prev) => {
            if (prev) return prev; // Already set
            console.log('Real AR: Step 4 - Setting shouldRenderAR to true');
            return true;
          });
          console.log('Real AR: All flags set - should render now');
        }, 400);
      };
      
      interactionHandle = InteractionManager.runAfterInteractions(() => {
        if (cancelled) return;
        console.log('Real AR: Step 2 complete - Interactions finished');
        proceedToRender();
      });
      
      // Fallback: If InteractionManager takes too long, proceed anyway
      fallbackTimer = setTimeout(() => {
        if (!interactionResolved && !cancelled) {
          console.warn('Real AR: InteractionManager timeout, proceeding anyway');
          if (interactionHandle && interactionHandle.cancel) {
            interactionHandle.cancel();
          }
          proceedToRender();
        }
      }, 2000); // 2 second fallback
    }, 600); // Reduced initial delay
    
    // Cleanup function
    return () => {
      cancelled = true;
      clearTimeout(timer1);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (interactionHandle && interactionHandle.cancel) {
        interactionHandle.cancel();
      }
    };
  }, [selectedHouse]);

  const handleARStarted = () => {
    console.log('Real AR: AR session started successfully');
    console.log('Real AR: Model path being used:', modelPath);
    console.log('Real AR: Gesture props - allowRotate: true, allowScale: true, allowTranslate: true');
    setIsARReady(true);
    setArError(null);
    console.log('Real AR: isARReady set to TRUE - hiding loading overlay');
  };

  const handleARError = (event: any) => {
    const errorMessage = event.nativeEvent?.message || 'AR session error';
    console.error('Real AR Error:', errorMessage);
    console.error('Real AR Error event:', event.nativeEvent);
    console.error('Real AR: Model path that failed:', modelPath);
    setArError(errorMessage);
    setIsARReady(false);
    onError?.(errorMessage);
    
    Alert.alert(
      'AR Error',
      `AR session failed: ${errorMessage}\n\nModel: ${modelPath}\n\nPlease ensure:\n- ARCore is installed and up to date\n- Device supports ARCore\n- Camera permissions are granted\n- Model file exists in assets`,
      [{ text: 'OK' }]
    );
  };

  const handleModelPlaced = () => {
    console.log('Real AR: Model placed on detected surface');
    console.log('Real AR: Model should now be selected and gestures enabled');
    console.log('Real AR: Try two-finger rotation and pinch-to-scale gestures');
    // If AR started event didn't fire, mark as ready when model is placed
    setIsARReady(true);
    setArError(null);
    console.log('Real AR: Model placed - marking AR as ready (isARReady=true)');
    onHousePlaced?.();
    onPlacementComplete?.();
  };

  const handleDataReturned = useCallback((event: any) => {
    try {
      if (!event || !event.nativeEvent) {
        console.warn('Real AR: Invalid data event received');
        return;
      }
      
      const data = event.nativeEvent;
      console.log('Real AR data returned:', data);
      
      if (data?.error) {
        console.error('Real AR data error:', data.error);
        setArError(data.error);
        onError?.(data.error);
      }
      
      if (data?.result) {
        console.log('Real AR result:', data.result);
      }
      
      if (data?.requestId) {
        console.log('Real AR request ID:', data.requestId);
      }
    } catch (error) {
      console.error('Error handling AR data:', error);
    }
  }, [onError]);

  if (!selectedHouse) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please select a house model first</Text>
      </View>
    );
  }

  // Calculate if we're ready to render
  const isReadyToRender = modelPath && rnBridgeReady && shouldRenderAR;
  
  // Single useEffect for final delay - ALWAYS called to follow Rules of Hooks
  useEffect(() => {
    // Only set up timer if ready to render and delay not complete
    if (!isReadyToRender || renderDelayComplete) {
      return;
    }
    
    console.log('Real AR: Starting final delay before rendering AR component...');
    const finalTimer = setTimeout(() => {
      console.log('Real AR: Final delay complete, ready to render ArViewerView');
      setRenderDelayComplete(true);
    }, 1500); // 1.5 second delay for React Native bridge stability
    
    return () => clearTimeout(finalTimer);
  }, [isReadyToRender, renderDelayComplete]); // Dependencies ensure it re-runs when needed
  
  // Early returns - check conditions in order
  if (!modelPath) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff821e" />
        <Text style={styles.message}>Loading model...</Text>
        <Text style={styles.loadingSubtext}>Please wait</Text>
      </View>
    );
  }
  
  if (!rnBridgeReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff821e" />
        <Text style={styles.message}>Initializing React Native bridge...</Text>
        <Text style={styles.loadingSubtext}>Please wait</Text>
      </View>
    );
  }
  
  if (!shouldRenderAR) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff821e" />
        <Text style={styles.message}>Preparing AR experience...</Text>
        <Text style={styles.loadingSubtext}>Please wait</Text>
      </View>
    );
  }
  
  if (!renderDelayComplete) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff821e" />
        <Text style={styles.message}>Finalizing AR setup...</Text>
        <Text style={styles.loadingSubtext}>Almost ready</Text>
      </View>
    );
  }

  // If there's an error, show it
  if (arError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{arError}</Text>
          <Text style={styles.loadingSubtext}>
            Please ensure ARCore is installed from Google Play Store
          </Text>
        </View>
      </View>
    );
  }

  // CRITICAL: Try rendering with a try-catch wrapper using React's error boundary pattern
  // Since we can't catch native crashes, we'll delay render even more and add defensive checks
  console.log('Real AR: About to render ArViewerView - all conditions met');
  console.log('Real AR: Model path:', modelPath);
  console.log('Real AR: Ensuring React Native is in stable state...');
  
  // Additional safety: Only render if we've waited long enough AND no errors
  if (!modelPath || arError) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {arError || 'Model not ready'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ArViewerView
        ref={arViewerRef}
        model={modelPath}
        planeOrientation="horizontal"
        allowScale={true}
        allowRotate={true}
        allowTranslate={false}
        lightEstimation={true}
        manageDepth={true}
        disableInstructions={false}
        disableInstantPlacement={true}
        style={styles.arView}
        onStarted={() => {
          console.log('Real AR: onStarted event received - SUCCESS!');
          handleARStarted();
        }}
        onError={(event: any) => {
          console.error('Real AR: onError event received:', event);
          handleARError(event);
        }}
        onModelPlaced={() => {
          console.log('Real AR: onModelPlaced event received');
          handleModelPlaced();
        }}
        onDataReturned={(event: any) => {
          console.log('Real AR: onDataReturned event received');
          handleDataReturned(event);
        }}
        onEnded={() => {
          console.log('Real AR: AR session ended');
          // Don't reset isARReady on session end - keep it ready if model was placed
          // setIsARReady(false);
          console.log('Real AR: Session ended but keeping isARReady=true if model was placed');
        }}
      />
      
      {arError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{arError}</Text>
        </View>
      )}
      
      {/* Show loading overlay only if AR not ready */}
      {/* CRITICAL: Use pointerEvents="none" when hidden to ensure touches reach AR view */}
      {/* isARReady is set in both handleARStarted() and handleModelPlaced() */}
      {!isARReady && !arError ? (
        <View style={styles.loadingOverlay} pointerEvents="box-none">
          <ActivityIndicator size="large" color="#ff821e" />
          <Text style={styles.loadingText}>Initializing AR...</Text>
          <Text style={styles.loadingSubtext}>Move your device slowly to detect surfaces</Text>
          {__DEV__ && (
            <Text style={[styles.loadingSubtext, { fontSize: 10, marginTop: 5, opacity: 0.7 }]}>
              Debug: isARReady={String(isARReady)}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arView: {
    flex: 1,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    padding: 15,
    borderRadius: 8,
    zIndex: 2000,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

