import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { HouseType } from '../constants/houseTypes';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onHouseSelect: (house: HouseType) => void;
  onNavigateToAR: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onHouseSelect, onNavigateToAR }) => {
  const handleStartAR = () => {
    // Select the first house by default for demo
    onHouseSelect({
      id: 'epic-homes-4-module-blue',
      name: 'Epic Homes 4 Module - Blue',
      description: 'A 4-module house design by Epic Homes with blue finish',
      modelPath: '4 Module - Blue.glb',
      dimensions: {
        width: 6.1,
        length: 7.62,
        height: 4.57,
        platformHeight: 1.22,
      },
      materials: ['Hardwood', 'Bamboo', 'Rattan', 'Nipah Palm'],
      culturalInfo: {
        region: 'Central Malaysia',
        significance: 'Traditional Orang Asli house design with modern materials',
        traditionalUses: ['Family dwelling', 'Community gathering', 'Cultural ceremonies'],
      },
    });
    onNavigateToAR();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.overlay}>
          <Image 
            source={require('../assets/images/EPIC_Homes_White.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Epic Homes AR</Text>
          <Text style={styles.subtitle}>
            Visualize Traditional Malaysian Indigenous Houses
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartAR}>
          <Text style={styles.startButtonText}>Start AR Experience</Text>
          <Text style={styles.startButtonIcon}>→</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Epic Homes</Text>
          <Text style={styles.infoText}>
            Epic Homes is dedicated to building sustainable, traditional-style houses
            for indigenous communities in Malaysia. Our AR visualizer helps clients
            and communities explore different house designs while respecting
            cultural heritage.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const features = [
  {
    icon: '🏠',
    title: 'AR Visualization',
    description: 'Place and view house designs in your environment',
  },
  {
    icon: '🎨',
    title: 'Material Options',
    description: 'Explore traditional building materials',
  },
  {
    icon: '🏘️',
    title: '5 House Types',
    description: 'Traditional Orang Asli house designs',
  },
  {
    icon: '📱',
    title: 'Share & Save',
    description: 'Save and share your visualizations',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  hero: {
    height: 300,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    padding: 20,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  startButtonIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});
