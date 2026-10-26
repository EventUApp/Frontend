import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Service } from '../../types';

interface ServiceDescriptionProps {
  service: Service;
}

/** Descripción, specs, incluye / no incluye y condiciones. */
export const ServiceDescription: React.FC<ServiceDescriptionProps> = ({ service }) => {
  return (
    <>
      <Animated.View
        entering={FadeInDown.duration(200).delay(280).reduceMotion(ReduceMotion.System)}
      >
        <Text style={styles.sectionTitle}>Descripción del Servicio</Text>
        <Text style={styles.description}>{service.fullDescription}</Text>

        {(service.duration || service.capacity) && (
          <View style={styles.specsRow}>
            {service.duration && (
              <View style={styles.specItem}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.specLabel}>Duración:</Text>
                <Text style={styles.specVal}>{service.duration}</Text>
              </View>
            )}
            {service.capacity && (
              <View style={styles.specItem}>
                <Ionicons name="people-outline" size={16} color={Colors.primary} />
                <Text style={styles.specLabel}>Capacidad:</Text>
                <Text style={styles.specVal}>{service.capacity}</Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(200).delay(340).reduceMotion(ReduceMotion.System)}
      >
        <Text style={styles.sectionTitle}>¿Qué incluye este servicio?</Text>
        <View style={styles.checklist}>
          {service.includes.map((inc, idx) => (
            <View key={idx} style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.checkItemText}>{inc}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {service.notIncludes && service.notIncludes.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(200).delay(400).reduceMotion(ReduceMotion.System)}
        >
          <Text style={styles.sectionTitle}>¿Qué NO incluye?</Text>
          <View style={styles.checklist}>
            {service.notIncludes.map((notInc, idx) => (
              <View key={idx} style={styles.checkItem}>
                <Ionicons name="close-circle" size={18} color={Colors.danger} />
                <Text style={styles.notIncludeText}>{notInc}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {service.conditions && (
        <Animated.View
          entering={FadeInDown.duration(200).delay(440).reduceMotion(ReduceMotion.System)}
          style={styles.conditionsBox}
        >
          <Ionicons name="information-circle-outline" size={18} color={Colors.slate600} />
          <View style={styles.conditionsContent}>
            <Text style={styles.conditionsTitle}>Condiciones de Reserva</Text>
            <Text style={styles.conditionsText}>{service.conditions}</Text>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
  },
  specsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.slate100,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  specLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginLeft: 4,
    marginRight: 2,
  },
  specVal: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
  },
  checklist: {
    marginBottom: Spacing.sm,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs + 2,
  },
  checkItemText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  notIncludeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  conditionsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginTop: Spacing.md,
  },
  conditionsContent: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  conditionsTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginBottom: 2,
  },
  conditionsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
  },
});
