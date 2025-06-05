import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export interface HouseType {
  id: string;
  name: string;
  description: string;
  color: string;
}

const HOUSE_TYPES: HouseType[] = [
  {
    id: 'rumah-panggung',
    name: 'Rumah Panggung',
    description: 'Traditional stilt house design',
    color: '#FFB74D',
  },
  {
    id: 'rumah-panjang',
    name: 'Rumah Panjang',
    description: 'Traditional longhouse design',
    color: '#4DB6AC',
  },
  {
    id: 'lean-to',
    name: 'Lean-to Structure',
    description: 'Simple lean-to shelter design',
    color: '#7986CB',
  },
  {
    id: 'bamboo-house',
    name: 'Elevated Bamboo House',
    description: 'Elevated house made primarily of bamboo',
    color: '#81C784',
  },
  {
    id: 'modern-fusion',
    name: 'Modern Fusion',
    description: 'Contemporary design with traditional elements',
    color: '#FF8A65',
  },
];

interface HouseSelectorProps {
  onSelect: (house: HouseType) => void;
  selectedHouseId?: string;
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
            <View style={[styles.thumbnail, { backgroundColor: house.color }]} />
            <View style={styles.textContainer}>
              <Text style={styles.houseName}>{house.name}</Text>
              <Text style={styles.description}>{house.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  houseCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 12,
  },
  houseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
}); 