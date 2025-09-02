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
  // Epic Homes specific properties
  isEpicHomes?: boolean;
  wallColors?: {
    name: string;
    value: string;
    material: string;
  }[];
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
  // Epic Homes Models
  {
    id: 'epic-homes-4-module',
    name: 'Epic Homes 4 Module',
    description: 'A 4-module house design by Epic Homes with customizable wall colors.',
    model: ASSETS.models.epicHomes4Module,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE, // You can adjust these dimensions
    materials: [
      'Concrete blocks',
      'Steel reinforcement',
      'Roof tiles'
    ],
    culturalInfo: 'A modern, affordable housing solution designed for community development.',
    isEpicHomes: true,
    wallColors: [
      { name: 'Blue', value: '#4A90E2', material: 'blue_wall' },
      { name: 'Brown', value: '#8B4513', material: 'brown_wall' },
      { name: 'Green', value: '#228B22', material: 'green_wall' }
    ]
  },
  {
    id: 'epic-homes-6-module',
    name: 'Epic Homes 6 Module',
    description: 'A 6-module house design by Epic Homes with customizable wall colors.',
    model: ASSETS.models.epicHomes6Module,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE, // You can adjust these dimensions
    materials: [
      'Concrete blocks',
      'Steel reinforcement',
      'Roof tiles'
    ],
    culturalInfo: 'A larger modern housing solution designed for growing families.',
    isEpicHomes: true,
    wallColors: [
      { name: 'Blue', value: '#4A90E2', material: 'blue_wall' },
      { name: 'Brown', value: '#8B4513', material: 'brown_wall' },
      { name: 'Green', value: '#228B22', material: 'green_wall' }
    ]
  },
  {
    id: 'epic-homes-12-module',
    name: 'Epic Homes 1 & 2 Module',
    description: 'A 1 & 2 module house design by Epic Homes with customizable wall colors.',
    model: ASSETS.models.epicHomes12Module,
    thumbnail: ASSETS.thumbnails.default,
    dimensions: DIMENSIONS.DEFAULT_HOUSE, // You can adjust these dimensions
    materials: [
      'Concrete blocks',
      'Steel reinforcement',
      'Roof tiles'
    ],
    culturalInfo: 'A compact modern housing solution perfect for small families.',
    isEpicHomes: true,
    wallColors: [
      { name: 'Blue', value: '#4A90E2', material: 'blue_wall' },
      { name: 'Brown', value: '#8B4513', material: 'brown_wall' },
      { name: 'Green', value: '#228B22', material: 'green_wall' }
    ]
  }
]; 