import { ImageSourcePropType } from 'react-native';
import { ASSETS } from './assets';
import { DIMENSIONS } from './values';

export interface HouseType {
  id: string;
  name: string;
  description: string;
  model: any; // GLB file reference
  thumbnail: ImageSourcePropType;
  dimensions: {
    width: number;
    length: number;
    height: number;
    platformHeight: number;
  };
  materials: string[];
  culturalInfo: string;
  // Epic Homes specific properties
  isEpicHomes?: boolean;
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
  },
  // Epic Homes Models - 4 Module Variants
  {
    id: 'epic-homes-4-module-blue',
    name: 'Epic Homes 4 Module - Blue',
    description: 'A 4-module house design by Epic Homes with blue finish.',
    model: ASSETS.models.epicHomes4ModuleBlue,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE, // You can adjust these dimensions
    materials: [
      'Concrete blocks',
      'Steel reinforcement',
      'Blue roof tiles'
    ],
    culturalInfo: 'A modern, affordable housing solution with blue finish designed for community development.',
    isEpicHomes: true
  },
  {
    id: 'epic-homes-4-module-green',
    name: 'Epic Homes 4 Module - Green',
    description: 'A 4-module house design by Epic Homes with green finish.',
    model: ASSETS.models.epicHomes4ModuleGreen,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE, // You can adjust these dimensions
    materials: [
      'Concrete blocks',
      'Steel reinforcement',
      'Green roof tiles'
    ],
    culturalInfo: 'A modern, affordable housing solution with green finish designed for community development.',
    isEpicHomes: true
  },
  {
    id: 'epic-homes-4-module-brown',
    name: 'Epic Homes 4 Module - Brown',
    description: 'A 4-module house design by Epic Homes with brown finish.',
    model: ASSETS.models.epicHomes4ModuleBrown,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE, // You can adjust these dimensions
    materials: [
      'Concrete blocks',
      'Steel reinforcement',
      'Brown roof tiles'
    ],
    culturalInfo: 'A modern, affordable housing solution with brown finish designed for community development.',
    isEpicHomes: true
  }
];