// Centralized asset paths for models and images - Pure React Native version
// Note: In Pure RN, we use require() directly for assets

export const ASSETS = {
  models: {
    // Note: GLB files are not directly supported in React Native bundler
    // These will be loaded at runtime from the assets folder
    house: '../assets/models/houses/house.glb',
    traditionalMalay: '../assets/models/houses/traditional-malay-house.glb',
    // Epic Homes models - 1 Module variants (centered)
    epicHomes1ModuleBlue: '../assets/models/houses/1 Module - Blue (centered).glb',
    epicHomes1ModuleGreen: '../assets/models/houses/1 Module - Green (centered).glb',
    epicHomes1ModuleBrown: '../assets/models/houses/1 Module - Brown (centered).glb',
    // Epic Homes models - 2 Module variants
    epicHomes2ModuleBlue: '../assets/models/houses/2 Module - Blue.glb',
    epicHomes2ModuleGreen: '../assets/models/houses/2 Module - Green.glb',
    epicHomes2ModuleBrown: '../assets/models/houses/2 Module - Brown.glb',
    // Epic Homes models - 4 Module variants
    epicHomes4ModuleBlue: '../assets/models/houses/4 Module - Blue.glb',
    epicHomes4ModuleGreen: '../assets/models/houses/4 Module - Green.glb',
    epicHomes4ModuleBrown: '../assets/models/houses/4 Module - Brown.glb',
    // Epic Homes models - 6 Module variants
    epicHomes6ModuleBlue: '../assets/models/houses/6 Module - Blue.glb',
    epicHomes6ModuleGreen: '../assets/models/houses/6 Module - Green.glb',
    epicHomes6ModuleBrown: '../assets/models/houses/6 Module - Brown.glb',
  },
  thumbnails: {
    default: require('../assets/images/EPIC_Homes_Orange.png'),
  },
  logos: {
    epicHomesOrange: require('../assets/images/EPIC_Homes_Orange.png'),
    epicHomesWhite: require('../assets/images/EPIC_Homes_White.png'),
    epicHomesBlack: require('../assets/images/Copy of EPIC_Homes-05 (Black).png'),
  }
};
