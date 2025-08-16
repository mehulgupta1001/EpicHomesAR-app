import { ImageSourcePropType } from 'react-native';
import { ASSETS } from './assets';
import { DIMENSIONS } from './values';

export interface HouseType {
  id: string;
  name: string;
  description: string;
  model: string; // Changed from ImageSourcePropType to string for GLB file URIs
  thumbnail: ImageSourcePropType;
  dimensions: {
    width: number;
    length: number;
    height: number;
    platformHeight: number;
  };
  materials: string[];
  culturalInfo: string;
}

export const HOUSE_TYPES: HouseType[] = [
  {
    id: 'default-house',
    name: 'Default House',
    description: 'A basic traditional house model.',
    model: ASSETS.models.house,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE,
    materials: [
      'Cengal hardwood',
      'Bamboo panels',
      'Rattan bindings',
      'Nipah palm leaves'
    ],
    culturalInfo: 'A basic traditional house representing community living.'
  },
  {
    id: 'traditional-malay-house',
    name: 'Traditional Malay House',
    description: 'A detailed model of a traditional Malay house.',
    model: ASSETS.models.traditionalMalay,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.TRADITIONAL_MALAY,
    materials: [
      'Timber',
      'Bamboo',
      'Palm thatch'
    ],
    culturalInfo: 'A traditional Malay house with detailed architecture and textures.'
  }
]; 