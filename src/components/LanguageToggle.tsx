import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { COLORS } from '../constants/colors';

export const LanguageToggle: React.FC = () => {
  const { locale, toggleLanguage } = useLanguage();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleLanguage}
      accessible={true}
      accessibilityLabel={`Switch language to ${locale === 'en' ? 'Malay' : 'English'}`}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{locale === 'en' ? 'MS' : 'EN'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

