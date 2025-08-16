import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { t } from './app/constants/i18n';

// Screens
import { ARScreen } from './app/screens/ARScreen';
import { HomeScreen } from './app/screens/HomeScreen';

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
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AR" 
            component={ARScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <Text>{t('appName')}</Text>
        <StatusBar style="auto" />
      </NavigationContainer>
    </>
  );
} 