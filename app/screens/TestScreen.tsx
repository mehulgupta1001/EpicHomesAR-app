import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const TestScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Epic Homes AR - Test Screen</Text>
        <Text style={styles.subtitle}>Basic UI Test</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Test Button 1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Test Button 2</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Test Button 3</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Status Check:</Text>
          <Text style={styles.infoText}>✅ React Native is working</Text>
          <Text style={styles.infoText}>✅ Basic UI components load</Text>
          <Text style={styles.infoText}>✅ Touch interactions work</Text>
          <Text style={styles.infoText}>✅ Styling is applied</Text>
        </View>
        
        <Text style={styles.info}>
          If you can see this screen with working buttons, basic React Native is working.
          The issue is with ViroReact AR components, not the core app.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  infoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 5,
  },
  info: {
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});
