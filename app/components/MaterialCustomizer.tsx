import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ASSETS } from '../constants/assets';
import { COLORS } from '../constants/values';
import { HouseType } from '../constants/houseTypes';

interface MaterialOption {
  id: string;
  name: string;
  thumbnail: ImageSourcePropType;
  description: string;
}

interface MaterialCategory {
  id: string;
  name: string;
  options: MaterialOption[];
}

interface WallColorOption {
  name: string;
  value: string;
  material: string;
}

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'wood',
    name: 'Wood Type',
    options: [
      {
        id: 'cengal',
        name: 'Cengal',
        thumbnail: ASSETS.thumbnails.default,
        description: 'Premium hardwood, excellent durability',
      },
      {
        id: 'meranti',
        name: 'Meranti',
        thumbnail: ASSETS.thumbnails.default,
        description: 'Versatile hardwood, good strength',
      },
      {
        id: 'bamboo',
        name: 'Bamboo',
        thumbnail: ASSETS.thumbnails.default,
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
        thumbnail: ASSETS.thumbnails.default,
        description: 'Traditional palm leaf roofing',
      },
      {
        id: 'rumbia',
        name: 'Rumbia',
        thumbnail: ASSETS.thumbnails.default,
        description: 'Durable palm thatch',
      },
      {
        id: 'bamboo-shingle',
        name: 'Bamboo Shingle',
        thumbnail: ASSETS.thumbnails.default,
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
        thumbnail: ASSETS.thumbnails.default,
        description: 'Traditional binding material',
      },
      {
        id: 'natural-fiber',
        name: 'Natural Fiber',
        thumbnail: ASSETS.thumbnails.default,
        description: 'Local plant-based rope',
      },
      {
        id: 'modern-binding',
        name: 'Modern Binding',
        thumbnail: ASSETS.thumbnails.default,
        description: 'Enhanced durability option',
      },
    ],
  },
];

interface MaterialCustomizerProps {
  onClose: () => void;
  onMaterialChange: (categoryId: string, materialId: string) => void;
  onWallColorChange?: (color: WallColorOption) => void;
  selectedMaterials: Record<string, string>;
  selectedHouse?: HouseType;
  selectedWallColor?: WallColorOption;
}

export const MaterialCustomizer: React.FC<MaterialCustomizerProps> = ({
  onClose,
  onMaterialChange,
  onWallColorChange,
  selectedMaterials,
  selectedHouse,
  selectedWallColor,
}) => {
  const [activeCategory, setActiveCategory] = useState(MATERIAL_CATEGORIES[0].id);
  const [showWallColors, setShowWallColors] = useState(false);

  const currentCategory = MATERIAL_CATEGORIES.find(cat => cat.id === activeCategory);
  const isEpicHomesHouse = selectedHouse?.isEpicHomes;
  const wallColors = selectedHouse?.wallColors || [];

  const handleWallColorSelect = (color: WallColorOption) => {
    if (onWallColorChange) {
      onWallColorChange(color);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEpicHomesHouse ? 'Customize Epic Homes' : 'Customize Materials'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Epic Homes Wall Color Picker */}
      {isEpicHomesHouse && wallColors.length > 0 && (
        <View style={styles.wallColorSection}>
          <Text style={styles.sectionTitle}>Wall Color Scheme</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the external wall color for your house
          </Text>
          <View style={styles.colorOptions}>
            {wallColors.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorOption,
                  selectedWallColor?.name === color.name && styles.selectedColorOption,
                ]}
                onPress={() => handleWallColorSelect(color)}
                accessible={true}
                accessibilityLabel={`Select wall color: ${color.name}`}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color.value },
                    selectedWallColor?.name === color.name && styles.selectedColorSwatch,
                  ]}
                />
                <Text style={styles.colorName}>{color.name}</Text>
                {selectedWallColor?.name === color.name && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#007AFF"
                    style={styles.colorCheckIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Traditional Material Categories */}
      {!isEpicHomesHouse && (
        <>
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
                accessible={true}
                accessibilityLabel={`Select material: ${option.name}`}
                accessibilityRole="button"
              >
                {option.thumbnail ? (
                  <Image
                    source={option.thumbnail}
                    style={styles.materialThumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.materialThumbnail}>
                    <Text style={styles.placeholderText}>{option.name.charAt(0)}</Text>
                  </View>
                )}
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
        </>
      )}
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
  // Epic Homes Wall Color Styles
  wallColorSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 16,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  colorOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
    minWidth: 80,
  },
  selectedColorOption: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  selectedColorSwatch: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  colorName: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  colorCheckIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // Traditional Material Styles
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
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.SECONDARY,
  },
  checkIcon: {
    marginLeft: 12,
  },
}); 