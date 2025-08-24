import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [lang, setLang] = React.useState('en');

  return (
    <View style={styles.container}>
      <View style={styles.languageBar}>
        <Button title="EN" onPress={() => setLang('en')} disabled={lang === 'en'} />
        <Button title="MS" onPress={() => setLang('ms')} disabled={lang === 'ms'} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Epic Homes AR</Text>
        <Text style={styles.subtitle}>
          {lang === 'en' ? 'Traditional House Visualizer' : 'Pemvisualisasi Rumah Tradisional'}
        </Text>
        
        <Link href="/ar" style={styles.linkButton}>
          <Text style={styles.linkText}>
            {lang === 'en' ? 'Start AR Experience' : 'Mulakan Pengalaman AR'}
          </Text>
        </Link>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  languageBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  linkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 