import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.overlay}>
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
              <MaterialIcons name={feature.icon as any} size={32} color="#007AFF" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <Link href="ar" asChild>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start AR Experience</Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </Link>

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
    icon: 'view-in-ar',
    title: 'AR Visualization',
    description: 'Place and view house designs in your environment',
  },
  {
    icon: 'style',
    title: 'Material Options',
    description: 'Explore traditional building materials',
  },
  {
    icon: 'architecture',
    title: '5 House Types',
    description: 'Traditional Orang Asli house designs',
  },
  {
    icon: 'share',
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
    backgroundColor: '#007AFF',
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
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
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