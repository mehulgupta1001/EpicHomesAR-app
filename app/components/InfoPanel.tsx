import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CulturalInfo {
  title: string;
  description: string;
  significance: string;
  region: string;
}

interface TechnicalInfo {
  dimensions: string;
  materials: string[];
  constructionTime: string;
  specialFeatures: string[];
}

interface InfoPanelProps {
  culturalInfo: CulturalInfo;
  technicalInfo: TechnicalInfo;
  onClose: () => void;
  visible: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  culturalInfo,
  technicalInfo,
  onClose,
  visible,
}) => {
  if (!visible) return null;

  return (
    <BlurView intensity={90} style={styles.container}>
      <View style={styles.panel}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cultural Information</Text>
            <Text style={styles.title}>{culturalInfo.title}</Text>
            <Text style={styles.description}>{culturalInfo.description}</Text>
            <Text style={styles.label}>Cultural Significance</Text>
            <Text style={styles.text}>{culturalInfo.significance}</Text>
            <Text style={styles.label}>Traditional Region</Text>
            <Text style={styles.text}>{culturalInfo.region}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Details</Text>
            <Text style={styles.label}>Dimensions</Text>
            <Text style={styles.text}>{technicalInfo.dimensions}</Text>
            
            <Text style={styles.label}>Materials Used</Text>
            {technicalInfo.materials.map((material, index) => (
              <Text key={index} style={styles.listItem}>• {material}</Text>
            ))}

            <Text style={styles.label}>Construction Time</Text>
            <Text style={styles.text}>{technicalInfo.constructionTime}</Text>

            <Text style={styles.label}>Special Features</Text>
            {technicalInfo.specialFeatures.map((feature, index) => (
              <Text key={index} style={styles.listItem}>• {feature}</Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </BlurView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#444',
  },
  text: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  listItem: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
    marginBottom: 5,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
}); 