import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../theme';

interface RatingProps {
  score: number;
  count?: number;
  size?: number;
  showText?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  score,
  count,
  size = 14,
  showText = true,
}) => {
  const reviewLabel =
    count !== undefined
      ? `Calificación ${score.toFixed(1)} de 5, ${count} ${
          count === 1 ? 'reseña' : 'reseñas'
        }`
      : `Calificación ${score.toFixed(1)} de 5`;

  return (
    // Agrupado en un solo nodo: con showText={false} la nota solo vivía
    // en el icono y se perdía por completo para el lector de pantalla.
    <View style={styles.container} accessible accessibilityLabel={reviewLabel}>
      <Ionicons name="star" size={size} color={Colors.accent} accessibilityElementsHidden />
      {showText && (
        <Text style={[styles.score, { fontSize: size }]} accessibilityElementsHidden>
          {score.toFixed(1)}
        </Text>
      )}
      {count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]} accessibilityElementsHidden>
          ({count})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginLeft: Spacing.xs,
  },
  count: {
    color: Colors.slate500,
    marginLeft: Spacing.xs,
  },
});
