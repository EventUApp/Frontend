import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface ProviderGalleryProps {
  images?: string[];
}

/** Galería horizontal de eventos realizados (nada si está vacía). */
export const ProviderGallery: React.FC<ProviderGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(160).reduceMotion(ReduceMotion.System)}
      style={styles.section}
    >
      <Text style={styles.title}>Galería de Eventos Realizados</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {images.map((imgUrl, idx) => (
          <Image
            key={idx}
            source={{ uri: imgUrl }}
            style={styles.image}
            contentFit="cover"
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  title: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.md,
  },
  scroll: {
    paddingBottom: Spacing.sm,
  },
  image: {
    width: 180,
    height: 120,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    backgroundColor: Colors.slate200,
  },
});
