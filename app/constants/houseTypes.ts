import { Asset } from 'expo-asset';
import houseModelFile from '../../assets/models/houses/house.glb';
import traditionalMalayModelFile from '../../assets/models/houses/traditional malay house.glb';
const houseModel = Asset.fromModule(houseModelFile).uri;
const traditionalMalayModel = Asset.fromModule(traditionalMalayModelFile).uri;

export interface HouseType {
  id: string;
  name: string;
  description: string;
  model: any;
  thumbnail: any;
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
    model: houseModel,
    thumbnail: null, // No thumbnail available
    dimensions: {
      width: 6.1,
      length: 7.62,
      height: 4.57,
      platformHeight: 1.22
    },
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
    model: traditionalMalayModel,
    thumbnail: null, // No thumbnail available
    dimensions: {
      width: 8.0,
      length: 10.0,
      height: 5.0,
      platformHeight: 1.5
    },
    materials: [
      'Timber',
      'Bamboo',
      'Palm thatch'
    ],
    culturalInfo: 'A traditional Malay house with detailed architecture and textures.'
  }
]; 