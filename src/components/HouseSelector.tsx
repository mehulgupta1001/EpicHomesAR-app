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
import { COLORS } from '../constants/values';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;
const CARD_WIDTH = isLandscape ? width * 0.35 : width * 0.7;
const CARD_MARGIN = 8;

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
            accessible={true}
            accessibilityLabel={`Select ${house.name}`}
            accessibilityRole="button"
          >
            <Image 
              source={house.thumbnail ? house.thumbnail : require('../assets/images/Copy of EPIC_Homes-03 (Normal).png')}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <Text style={styles.houseName}>{house.name}</Text>
              <Text style={styles.dimensions}>
                {house.dimensions.width}m × {house.dimensions.length}m × {house.dimensions.height}m
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
    backgroundColor: COLORS.BACKGROUND,
    padding: isLandscape ? 12 : 16,
    borderRadius: 10,
    position: 'absolute',
    top: isLandscape ? 80 : 100,
    bottom: 20,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: isLandscape ? 16 : 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: isLandscape ? 8 : 12,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
  },
  houseCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 8,
    marginHorizontal: CARD_MARGIN,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.CARD_BORDER,
  },
  thumbnail: {
    width: '100%',
    height: isLandscape ? 120 : 150,
    backgroundColor: COLORS.BACKGROUND,
  },
  textContainer: {
    padding: isLandscape ? 8 : 12,
  },
  houseName: {
    fontSize: isLandscape ? 16 : 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: isLandscape ? 6 : 8,
  },
  dimensions: {
    fontSize: isLandscape ? 12 : 14,
    color: COLORS.SECONDARY,
    marginBottom: 4,
  },
});
