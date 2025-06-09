import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { HOUSE_TYPES, HouseType } from '../constants/houseTypes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 10;

interface HouseSelectorProps {
  onSelect: (house: HouseType) => void;
  selectedHouseId: string | null;
}

export const HouseSelector: React.FC<HouseSelectorProps> = ({
  onSelect,
  selectedHouseId,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select House Design</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
      >
        {HOUSE_TYPES.map((house) => (
          <TouchableOpacity
            key={house.id}
            style={[
              styles.houseCard,
              selectedHouseId === house.id && styles.selectedCard,
            ]}
            onPress={() => onSelect(house)}
          >
            <Image 
              source={house.thumbnail}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <Text style={styles.houseName}>{house.name}</Text>
              <Text style={styles.description}>{house.description}</Text>
              <View style={styles.specs}>
                <Text style={styles.specText}>
                  Size: {house.dimensions.width}m × {house.dimensions.length}m
                </Text>
                <Text style={styles.specText}>
                  Height: {house.dimensions.height}m
                </Text>
              </View>
              <View style={styles.materials}>
                {house.materials.map((material, index) => (
                  <Text key={index} style={styles.materialText}>
                    • {material}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
  },
  houseCard: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: CARD_MARGIN,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#2c2c2c',
  },
  textContainer: {
    padding: 16,
  },
  houseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 12,
  },
  specs: {
    marginBottom: 12,
  },
  specText: {
    fontSize: 13,
    color: '#cccccc',
    marginBottom: 4,
  },
  materials: {
    marginTop: 8,
  },
  materialText: {
    fontSize: 13,
    color: '#cccccc',
    marginBottom: 2,
  },
}); 