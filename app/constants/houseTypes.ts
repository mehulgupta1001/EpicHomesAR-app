
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
    id: 'rumah-panjang',
    name: 'Rumah Panjang',
    description: 'Traditional longhouse design with communal spaces',
    model: require('../../assets/models/houses/house.glb'),
    thumbnail: require('../../assets/images/houses/rumah-panjang.png'),
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
    culturalInfo: 'The Rumah Panjang represents community living with shared spaces for multiple families.'
  },
  {
    id: 'rumah-semai',
    name: 'Rumah Semai',
    description: 'Compact single-family dwelling with traditional elements',
    model: require('../../assets/models/houses/house-semai.glb'),
    thumbnail: require('../../assets/images/houses/rumah-semai.png'),
    dimensions: {
      width: 4.5,
      length: 5.5,
      height: 3.8,
      platformHeight: 1.0
    },
    materials: [
      'Meranti wood',
      'Split bamboo walls',
      'Natural fiber ropes',
      'Palm leaf roofing'
    ],
    culturalInfo: 'The Rumah Semai reflects the Semai people\'s connection to the forest and sustainable living practices.'
  },
  {
    id: 'rumah-temuan',
    name: 'Rumah Temuan',
    description: 'Elevated design with cross-ventilation',
    model: require('../../assets/models/houses/house-temuan.glb'),
    thumbnail: require('../../assets/images/houses/rumah-temuan.png'),
    dimensions: {
      width: 5.2,
      length: 6.4,
      height: 4.1,
      platformHeight: 1.5
    },
    materials: [
      'Local hardwood',
      'Woven bamboo panels',
      'Traditional bindings',
      'Thatched roofing'
    ],
    culturalInfo: 'The Rumah Temuan showcases advanced natural ventilation and climate adaptation techniques.'
  },
  {
    id: 'rumah-jakun',
    name: 'Rumah Jakun',
    description: 'Traditional A-frame design with extended roof',
    model: require('../../assets/models/houses/house-jakun.glb'),
    thumbnail: require('../../assets/images/houses/rumah-jakun.png'),
    dimensions: {
      width: 5.8,
      length: 7.0,
      height: 4.8,
      platformHeight: 1.3
    },
    materials: [
      'Mixed hardwoods',
      'Split bamboo flooring',
      'Rattan weaving',
      'Palm thatch'
    ],
    culturalInfo: 'The Rumah Jakun design emphasizes harmony with the surrounding environment and traditional building techniques.'
  },
  {
    id: 'rumah-penan',
    name: 'Rumah Penan',
    description: 'Modular design with expandable sections',
    model: require('../../assets/models/houses/house-penan.glb'),
    thumbnail: require('../../assets/images/houses/rumah-penan.png'),
    dimensions: {
      width: 5.5,
      length: 6.8,
      height: 4.2,
      platformHeight: 1.2
    },
    materials: [
      'Local timber',
      'Bamboo matting',
      'Natural cordage',
      'Leaf roofing'
    ],
    culturalInfo: 'The Rumah Penan reflects the adaptable nature of the Penan people with its modular design approach.'
  }
]; 