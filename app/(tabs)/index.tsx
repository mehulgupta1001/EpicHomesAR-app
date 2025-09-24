import { Image, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ff821e', dark: '#ff821e' }}
      headerImage={
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/Copy of EPIC_Homes-04 (White).png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">AR House Visualizer</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🏠 Explore House Designs</ThemedText>
        <ThemedText>
          View traditional Orang Asli house designs in augmented reality. Place 3D models in your real environment and explore different architectural styles.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🎨 Customize Materials</ThemedText>
        <ThemedText>
          Change materials, finishes, and design options to see how different choices look instantly in your space.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📱 Offline Ready</ThemedText>
        <ThemedText>
          Works even in remote areas without internet connection. Perfect for community planning and volunteer coordination.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🌍 Multilingual Support</ThemedText>
        <ThemedText>
          Switch between languages to make the app accessible to diverse communities and volunteers.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 200,
    height: 80,
  },
});
