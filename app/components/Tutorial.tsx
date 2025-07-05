import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TUTORIAL_KEY = 'tutorial_completed';

export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  action: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: keyof typeof MaterialIcons.glyphMap;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to Epic Homes AR",
    description: "This app will help you visualize and build traditional houses. Let's learn how to use it!",
    action: "Tap Next to continue",
    position: "center",
    icon: "home"
  },
  {
    id: 2,
    title: "Finding a Surface",
    description: "First, you'll need to find a flat surface. Move your device slowly around and look for the grid pattern.",
    action: "Move your device to scan the area",
    position: "top",
    icon: "grid-on"
  },
  {
    id: 3,
    title: "Placing the House",
    description: "Once you see the grid, tap anywhere on it to place the house model. You can then rotate it as needed.",
    action: "Tap to place the house",
    position: "bottom",
    icon: "touch-app"
  },
  {
    id: 4,
    title: "Construction Guide",
    description: "Access the step-by-step construction guide here. Each step includes materials needed and safety tips.",
    action: "Swipe up to see steps",
    position: "bottom",
    icon: "build"
  },
  {
    id: 5,
    title: "Progress Tracking",
    description: "Mark steps as complete and take photos to document your progress. Everything works offline!",
    action: "Try marking a step complete",
    position: "right",
    icon: "check-circle"
  }
];

interface TutorialProps {
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [animation] = useState(new Animated.Value(0));

  const checkTutorialStatus = useCallback(async () => {
    try {
      const completed = await AsyncStorage.getItem(TUTORIAL_KEY);
      if (completed === 'true') {
        setVisible(false);
        onComplete();
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    }
  }, [onComplete]);

  const animateIn = useCallback(() => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  useEffect(() => {
    checkTutorialStatus();
    animateIn();
  }, [checkTutorialStatus, animateIn]);

  const handleNext = async () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      animation.setValue(0);
      animateIn();
    } else {
      try {
        await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
        setVisible(false);
        onComplete();
      } catch (error) {
        console.error('Error saving tutorial status:', error);
      }
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: animation,
            },
          ]}
        >
          <MaterialIcons name={step.icon} size={40} color="#4a90e2" />
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
          <Text style={styles.action}>{step.action}</Text>
          
          <View style={styles.footer}>
            <Text style={styles.progress}>
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  action: {
    fontSize: 18,
    color: '#4a90e2',
    fontWeight: '500',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  progress: {
    color: '#666',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 