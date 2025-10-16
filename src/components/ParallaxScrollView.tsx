// Simplified ParallaxScrollView component without react-native-reanimated
import type { PropsWithChildren, ReactElement } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '../hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = headerBackgroundColor[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor }]}>
          {headerImage}
        </ThemedView>
        
        {/* Content */}
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
