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
import { useLanguage } from '../hooks/useLanguage';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;
// Adjust card width for better scrolling with many models
const CARD_WIDTH = isLandscape ? width * 0.3 : width * 0.65;
const CARD_MARGIN = 12;

interface HouseSelectorProps {
  onSelect: (house: HouseType) => void;
  selectedHouseId: string | null;
}

export const HouseSelector: React.FC<HouseSelectorProps> = ({
  onSelect,
  selectedHouseId,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('select_house')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        pagingEnabled={false}
        snapToAlignment="start"
        scrollEventThrottle={16}
        style={styles.scrollView}
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
              <Text style={styles.houseName} numberOfLines={2}>{house.name}</Text>
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
    left: 0,
    right: 0,
    height: isLandscape ? 240 : 280,
  },
  title: {
    fontSize: isLandscape ? 16 : 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: isLandscape ? 8 : 12,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  houseCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 8,
    marginHorizontal: CARD_MARGIN,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: isLandscape ? 200 : 240,
  },
  selectedCard: {
    borderColor: COLORS.CARD_BORDER,
  },
  thumbnail: {
    width: '100%',
    height: isLandscape ? 100 : 120,
    backgroundColor: COLORS.BACKGROUND,
  },
  textContainer: {
    padding: isLandscape ? 8 : 10,
    minHeight: isLandscape ? 80 : 100,
    justifyContent: 'flex-start',
    paddingBottom: isLandscape ? 12 : 14,
  },
  houseName: {
    fontSize: isLandscape ? 14 : 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: isLandscape ? 4 : 6,
  },
  dimensions: {
    fontSize: isLandscape ? 11 : 12,
    color: COLORS.SECONDARY,
    marginBottom: 2,
  },
});
