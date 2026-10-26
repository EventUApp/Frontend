import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Rating } from '../ui/Rating';
import { Provider } from '../../types';

interface ProviderReviewsProps {
  reviews?: Provider['reviews'];
}

/** Tarjetas de reseñas de clientes (nada si está vacío). */
export const ProviderReviews: React.FC<ProviderReviewsProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(240).reduceMotion(ReduceMotion.System)}
      style={styles.section}
    >
      <Text style={styles.title}>
        Reseñas de Clientes ({reviews.length})
      </Text>

      {reviews.map((rev) => (
        <View key={rev.id} style={styles.card}>
          <View style={styles.header}>
            <Avatar source={rev.clientAvatar} name={rev.clientName} size={36} />
            <View style={styles.author}>
              <Text style={styles.authorName}>{rev.clientName}</Text>
              <Text style={styles.eventName}>{rev.eventName}</Text>
            </View>
            <Rating score={rev.rating} size={12} showText={false} />
          </View>
          <Text style={styles.comment}>{rev.comment}</Text>
          <Text style={styles.date}>{rev.date}</Text>
        </View>
      ))}
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  author: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  authorName: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  eventName: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  comment: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginVertical: 4,
  },
  date: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
});
