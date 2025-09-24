import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Alert, StyleSheet, View } from 'react-native';

export default function ARScreen() {
  const handleStartAR = () => {
    Alert.alert(
      'AR Feature Coming Soon',
      'The AR functionality is being developed. This will allow you to place 3D house models in your real environment.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol
          size={120}
          color="#ff821e"
          name="camera.fill"
          style={styles.headerIcon}
        />
        <ThemedText type="title" style={styles.title}>
          AR House Visualizer
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Place 3D house models in your real environment
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedView style={styles.featureCard}>
          <IconSymbol size={40} color="#ff821e" name="cube.fill" />
          <ThemedText type="subtitle" style={styles.featureTitle}>
            3D House Models
          </ThemedText>
          <ThemedText style={styles.featureDescription}>
            View traditional Orang Asli house designs in full 3D detail
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureCard}>
          <IconSymbol size={40} color="#ff821e" name="hand.tap.fill" />
          <ThemedText type="subtitle" style={styles.featureTitle}>
            Interactive Controls
          </ThemedText>
          <ThemedText style={styles.featureDescription}>
            Rotate, scale, and move models with simple gestures
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureCard}>
          <IconSymbol size={40} color="#ff821e" name="paintbrush.fill" />
          <ThemedText type="subtitle" style={styles.featureTitle}>
            Material Customization
          </ThemedText>
          <ThemedText style={styles.featureDescription}>
            Change materials and finishes to see different options
          </ThemedText>
        </ThemedView>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          AR functionality is currently in development. Check back soon for the full experience!
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  headerIcon: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#ff821e',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  featureCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 129, 30, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 129, 30, 0.2)',
  },
  featureTitle: {
    textAlign: 'center',
    color: '#ff821e',
  },
  featureDescription: {
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
