import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#000000');
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Epic Homes AR',
        }}
      />
      <Stack.Screen
        name="ar"
        options={{
          title: 'AR View',
          presentation: 'fullScreenModal',
        }}
      />
    </Stack>
  );
}
