import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { PriceTag } from '../ui/PriceTag';
import { Service } from '../../types';

interface ServicePriceCardProps {
  service: Service;
}

/** Bloque de tarifa oficial y disponibilidad. */
export const ServicePriceCard: React.FC<ServicePriceCardProps> = ({ service }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(160).reduceMotion(ReduceMotion.System)}
      style={styles.card}
    >
      <View>
        <Text style={styles.label}>Tarifa oficial del proveedor:</Text>
        <PriceTag
          price={service.price}
          unit={service.priceUnit}
          size="xl"
          color={Colors.primaryDark}
        />
      </View>

      <View style={styles.availabilityBox}>
        <Ionicons
          name={service.available ? 'checkmark-circle' : 'pause-circle'}
          size={14}
          color={service.available ? Colors.success : Colors.slate500}
        />
        <Text
          style={[
            styles.availabilityText,
            !service.available && { color: Colors.slate500 },
          ]}
        >
          {service.available ? 'Disponible' : 'Bajo consulta'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  label: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: 2,
  },
  availabilityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  availabilityText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
});
