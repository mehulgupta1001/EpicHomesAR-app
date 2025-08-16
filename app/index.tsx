import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, View } from 'react-native';

// Screens
import { ARScreen } from './screens/ARScreen';
import { HomeScreen } from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [lang, setLang] = React.useState('en');

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 8 }}>
        <Button title="EN" onPress={() => setLang('en')} disabled={lang === 'en'} />
        <Button title="MS" onPress={() => setLang('ms')} disabled={lang === 'ms'} />
      </View>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AR" component={ARScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
} 