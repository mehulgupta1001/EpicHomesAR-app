import { Link } from 'expo-router';
import React from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [lang, setLang] = React.useState('en');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ff821e', dark: '#ff821e' }}
      headerImage={
        <View style={styles.logoContainer}>
          <View style={styles.languageBar}>
            <Button title="EN" onPress={() => setLang('en')} disabled={lang === 'en'} />
            <Button title="MS" onPress={() => setLang('ms')} disabled={lang === 'ms'} />
          </View>
          <Image 
            source={require('../../assets/images/Copy of EPIC_Homes-04 (White).png')} 
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
      <ThemedView style={styles.stepContainer}>
        <Link href="/(tabs)/explore" style={styles.linkButton}>
          <ThemedText style={styles.linkText}>
            {lang === 'en' ? 'Start AR Experience' : 'Mulakan Pengalaman AR'}
          </ThemedText>
        </Link>
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
  languageBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    width: '100%',
  },
  linkButton: {
    backgroundColor: '#ff821e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  linkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
