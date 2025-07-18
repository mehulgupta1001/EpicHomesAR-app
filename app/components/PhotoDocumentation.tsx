import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/values';

interface PhotoDocumentationProps {
  stepIndex: number;
  onPhotoAdded: (stepIndex: number, photoUri: string) => void;
  photos: string[];
}

export const PhotoDocumentation: React.FC<PhotoDocumentationProps> = ({
  stepIndex,
  onPhotoAdded,
  photos,
}) => {
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        const fileName = `step_${stepIndex}_${Date.now()}.jpg`;
        const newUri = `${FileSystem.documentDirectory}photos/${fileName}`;

        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos`, {
          intermediates: true,
        });

        await FileSystem.copyAsync({
          from: photoUri,
          to: newUri,
        });

        onPhotoAdded(stepIndex, newUri);
      }
    } catch (error: any) {
      Alert.alert('Error', `Failed to take photo: ${error?.message || 'Unknown error'}`);
      console.error('Photo error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Documentation</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={takePhoto}
        disabled={loading}
        accessible={true}
        accessibilityLabel="Take photo for documentation"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {loading ? 'Taking Photo...' : 'Take Photo'}
        </Text>
      </TouchableOpacity>

      <View style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.thumbnail}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
}); 