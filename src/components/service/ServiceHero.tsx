import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Rating } from '../ui/Rating';
import { Service } from '../../types';

interface ServiceHeroProps {
  service: Service;
}

/** Cabecera: categoría, nombre, rating y ubicación. */
export const ServiceHero: React.FC<ServiceHeroProps> = ({ service }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(100).reduceMotion(ReduceMotion.System)}
    >
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{service.categoryName}</Text>
      </View>
      <Text style={styles.name}>{service.name}</Text>

      <View style={styles.ratingRow}>
        <Rating score={service.rating} count={service.reviewCount} size={15} />
        <View style={styles.locationBox}>
          <Ionicons name="location-outline" size={14} color={Colors.slate500} />
          <Text style={styles.locationText}>{service.location}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: Typography.sizes.xl,
    lineHeight: Typography.lineHeights.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginLeft: 3,
  },
});
