import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MaterialOption {
  id: string;
  name: string;
  thumbnail: any;
  description: string;
}

interface MaterialCategory {
  id: string;
  name: string;
  options: MaterialOption[];
}

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'wood',
    name: 'Wood Type',
    options: [
      {
        id: 'cengal',
        name: 'Cengal',
        thumbnail: require('../../assets/images/materials/cengal.png'),
        description: 'Premium hardwood, excellent durability',
      },
      {
        id: 'meranti',
        name: 'Meranti',
        thumbnail: require('../../assets/images/materials/meranti.png'),
        description: 'Versatile hardwood, good strength',
      },
      {
        id: 'bamboo',
        name: 'Bamboo',
        thumbnail: require('../../assets/images/materials/bamboo.png'),
        description: 'Sustainable, fast-growing material',
      },
    ],
  },
  {
    id: 'roofing',
    name: 'Roofing',
    options: [
      {
        id: 'nipah',
        name: 'Nipah Palm',
        thumbnail: require('../../assets/images/materials/nipah.png'),
        description: 'Traditional palm leaf roofing',
      },
      {
        id: 'rumbia',
        name: 'Rumbia',
        thumbnail: require('../../assets/images/materials/rumbia.png'),
        description: 'Durable palm thatch',
      },
      {
        id: 'bamboo-shingle',
        name: 'Bamboo Shingle',
        thumbnail: require('../../assets/images/materials/bamboo-shingle.png'),
        description: 'Modern sustainable option',
      },
    ],
  },
  {
    id: 'binding',
    name: 'Binding',
    options: [
      {
        id: 'rattan',
        name: 'Rattan',
        thumbnail: require('../../assets/images/materials/rattan.png'),
        description: 'Traditional binding material',
      },
      {
        id: 'natural-fiber',
        name: 'Natural Fiber',
        thumbnail: require('../../assets/images/materials/natural-fiber.png'),
        description: 'Local plant-based rope',
      },
      {
        id: 'modern-binding',
        name: 'Modern Binding',
        thumbnail: require('../../assets/images/materials/modern-binding.png'),
        description: 'Enhanced durability option',
      },
    ],
  },
];

interface MaterialCustomizerProps {
  onClose: () => void;
  onMaterialChange: (categoryId: string, materialId: string) => void;
  selectedMaterials: Record<string, string>;
}

export const MaterialCustomizer: React.FC<MaterialCustomizerProps> = ({
  onClose,
  onMaterialChange,
  selectedMaterials,
}) => {
  const [activeCategory, setActiveCategory] = useState(MATERIAL_CATEGORIES[0].id);

  const currentCategory = MATERIAL_CATEGORIES.find(cat => cat.id === activeCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customize Materials</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MATERIAL_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && styles.activeTab,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.optionsContainer}>
        {currentCategory?.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedMaterials[currentCategory.id] === option.id &&
                styles.selectedOption,
            ]}
            onPress={() => onMaterialChange(currentCategory.id, option.id)}
          >
            <Image
              source={option.thumbnail}
              style={styles.materialThumbnail}
              resizeMode="cover"
            />
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>{option.name}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            {selectedMaterials[currentCategory.id] === option.id && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#007AFF"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    padding: 16,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  categoryTabs: {
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: 'white',
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  materialThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2c2c2c',
  },
  optionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#cccccc',
  },
  checkIcon: {
    marginLeft: 12,
  },
}); 