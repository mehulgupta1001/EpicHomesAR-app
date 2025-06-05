import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface Material {
  id: string;
  name: string;
  description: string;
  color: string;
}

const MATERIALS: Material[] = [
  {
    id: 'bamboo',
    name: 'Traditional Bamboo',
    description: 'Sustainable bamboo material',
    color: '#8D6E63',
  },
  {
    id: 'rattan',
    name: 'Woven Rattan',
    description: 'Traditional rattan weaving',
    color: '#D7CCC8',
  },
  {
    id: 'wood-meranti',
    name: 'Meranti Wood',
    description: 'Local hardwood variety',
    color: '#795548',
  },
  {
    id: 'wood-chengal',
    name: 'Chengal Wood',
    description: 'Premium hardwood',
    color: '#5D4037',
  },
  {
    id: 'nipah',
    name: 'Nipah Palm',
    description: 'Traditional roofing material',
    color: '#A1887F',
  },
];

interface MaterialCustomizerProps {
  onSelectMaterial: (material: Material) => void;
  selectedMaterialId?: string;
}

export const MaterialCustomizer: React.FC<MaterialCustomizerProps> = ({
  onSelectMaterial,
  selectedMaterialId,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customize Materials</Text>
        <Text style={styles.subtitle}>Choose traditional materials</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.materialsContainer}
      >
        {MATERIALS.map((material) => (
          <TouchableOpacity
            key={material.id}
            style={[
              styles.materialCard,
              selectedMaterialId === material.id && styles.selectedCard,
            ]}
            onPress={() => onSelectMaterial(material)}
          >
            <View style={[styles.materialImage, { backgroundColor: material.color }]} />
            <View style={styles.materialInfo}>
              <Text style={styles.materialName}>{material.name}</Text>
              <Text style={styles.materialDescription}>
                {material.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  materialsContainer: {
    paddingBottom: 8,
  },
  materialCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  materialImage: {
    width: '100%',
    height: 100,
  },
  materialInfo: {
    padding: 8,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  materialDescription: {
    fontSize: 12,
    color: '#666',
  },
}); 