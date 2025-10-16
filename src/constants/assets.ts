// Centralized asset paths for models and images - Pure React Native version
// Note: In Pure RN, we use require() directly for assets

export const ASSETS = {
  models: {
    house: require('../assets/models/houses/house.glb'),
    traditionalMalay: require('../assets/models/houses/traditional-malay-house.glb'),
    // Epic Homes models - 4 Module variants
    epicHomes4ModuleBlue: require('../assets/models/houses/4 Module - Blue.glb'),
    epicHomes4ModuleGreen: require('../assets/models/houses/4 Module - Green.glb'),
    epicHomes4ModuleBrown: require('../assets/models/houses/4 Module - Brown.glb'),
  },
  thumbnails: {
    default: require('../assets/images/epic-homes-logo-orange.png'),
  }
};
