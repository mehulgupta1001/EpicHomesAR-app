import React from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';

const NotFound = () => {
  React.useEffect(() => {
    AccessibilityInfo.announceForAccessibility('Page not found');
  }, []);
  return (
    <View style={styles.container} accessible accessibilityLabel="404 Not Found Screen">
      <Text style={styles.title} accessibilityRole="header">404</Text>
      <Text style={styles.message}>Sorry, the page you are looking for does not exist.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default NotFound;
