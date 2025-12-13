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
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/LanguageToggle';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onHouseSelect: (house: HouseType) => void;
  onNavigateToAR: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onHouseSelect, onNavigateToAR }) => {
  const { t } = useLanguage();

  const handleStartAR = () => {
    // Select the first house by default for demo
    onHouseSelect({
      id: 'epic-homes-4-module-blue',
      name: 'Epic Homes 4 Module - Blue',
      description: 'A 4-module house design by Epic Homes with blue finish',
      modelPath: '4 Module - Blue (centered).glb',
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

  const features = [
    {
      icon: '🏠',
      title: t('feature_ar_title'),
      description: t('feature_ar_desc'),
    },
    {
      icon: '🎨',
      title: t('feature_materials_title'),
      description: t('feature_materials_desc'),
    },
    {
      icon: '🏘️',
      title: t('feature_houses_title'),
      description: t('feature_houses_desc'),
    },
    {
      icon: '📱',
      title: t('feature_share_title'),
      description: t('feature_share_desc'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LanguageToggle />
      <View style={styles.hero}>
        <View style={styles.overlay}>
          <Image 
            source={require('../assets/images/EPIC_Homes_White.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t('app_title')}</Text>
          <Text style={styles.subtitle}>
            {t('app_subtitle')}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{t('features')}</Text>
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
          <Text style={styles.startButtonText}>{t('start_ar')}</Text>
          <Text style={styles.startButtonIcon}>→</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>{t('about_title')}</Text>
          <Text style={styles.infoText}>
            {t('about_text')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

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
