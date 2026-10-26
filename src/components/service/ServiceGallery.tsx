import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { Service } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

interface ServiceGalleryProps {
  service: Service;
}

/** Carrusel de imágenes con badges flotantes y paginación. */
export const ServiceGallery: React.FC<ServiceGalleryProps> = ({ service }) => {
  const images =
    service.images && service.images.length > 0 ? service.images : [FALLBACK_IMAGE];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScrollImage = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide >= 0 && slide < images.length && slide !== activeImageIndex) {
      setActiveImageIndex(slide);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollImage}
        scrollEventThrottle={16}
      >
        {images.map((imgUri, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri: imgUri }}
              style={styles.image}
              contentFit="cover"
              transition={250}
            />
          </View>
        ))}
      </ScrollView>

      {/* Floating Badges */}
      <View style={styles.badgesRow}>
        {service.recommended && (
          <Animated.View
            entering={FadeInDown.duration(200).delay(80).reduceMotion(ReduceMotion.System)}
            style={styles.recommendedBadge}
          >
            <Ionicons name="sparkles" size={12} color={Colors.white} />
            <Text style={styles.recommendedText}>Recomendado</Text>
          </Animated.View>
        )}

        {images.length > 1 && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>
              {activeImageIndex + 1}/{images.length}
            </Text>
          </View>
        )}
      </View>

      {/* Paging Indicators */}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeImageIndex === i ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.slate200,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesRow: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  recommendedBadge: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginLeft: 4,
  },
  counterBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  counterBadgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  dotActive: {
    width: 20,
    opacity: 1,
  },
  dotInactive: {
    width: 6,
    opacity: 0.5,
  },
});
