import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

/** Tarjeta oscura del asistente paso a paso. */
export const HomeWizardCta: React.FC = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={() => router.push('/create-event')}
      accessibilityRole="button"
      accessibilityLabel="Crea tu evento personalizado con el asistente paso a paso"
    >
      <View style={styles.textCol}>
        <Text style={styles.tag}>ASISTENTE PASO A PASO</Text>
        <Text style={styles.title}>Crea tu evento personalizado</Text>
        <Text style={styles.desc}>
          Selecciona tipo, fecha, presupuesto y arma tu cotización en 4 pasos.
        </Text>
      </View>
      <View style={styles.iconCircle}>
        <Ionicons name="sparkles" size={26} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  tag: {
    color: '#C7D2FE',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  desc: {
    color: '#E0E7FF',
    fontSize: Typography.sizes.xs,
    lineHeight: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
