import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants/colors';
import { HouseType } from './src/constants/houseTypes';
import { ARScreen } from './src/screens/ARScreen';
import { HomeScreen } from './src/screens/HomeScreen';

type Screen = 'home' | 'ar';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);

  const handleHouseSelect = (house: HouseType) => {
    setSelectedHouse(house);
  };

  const handleNavigateToAR = () => {
    if (selectedHouse) {
      setCurrentScreen('ar');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {currentScreen === 'home' && (
        <HomeScreen
          onHouseSelect={handleHouseSelect}
          onNavigateToAR={handleNavigateToAR}
        />
      )}
      {currentScreen === 'ar' && selectedHouse && (
        <ARScreen
          selectedHouse={selectedHouse}
          onBack={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;