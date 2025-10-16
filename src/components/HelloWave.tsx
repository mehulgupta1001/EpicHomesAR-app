// Simplified HelloWave component without react-native-reanimated
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export function HelloWave() {
  const rotationAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(rotationAnimation, {
          toValue: 25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Repeat the animation
        setTimeout(animate, 1000);
      });
    };
    
    animate();
  }, [rotationAnimation]);

  const animatedStyle = {
    transform: [{ rotate: rotationAnimation.interpolate({
      inputRange: [0, 25],
      outputRange: ['0deg', '25deg'],
    }) }],
  };

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
