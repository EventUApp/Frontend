import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { stepStyles } from './stepStyles';
import { formatCurrency } from '../../utils/format';
import { Service } from '../../types';

interface StepReviewProps {
  name: string;
  typeName: string;
  date: string;
  location: string;
  guests: string;
  services: Service[];
  estimatedTotal: number;
}

/** Paso 4: resumen del desglose + tarjeta final antes de guardar. */
export const StepReview: React.FC<StepReviewProps> = ({
  name,
  typeName,
  date,
  location,
  guests,
  services,
  estimatedTotal,
}) => {
  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Revisa y guarda</Text>
      <Text style={stepStyles.desc}>
        Verifica el desglose: al confirmar quedará guardado en tus eventos.
      </Text>

      <View style={styles.quoteBox}>
        {services.map((s) => (
          <View key={s.id} style={styles.quoteRow}>
            <View style={styles.quoteInfo}>
              <Text style={styles.quoteSrvName}>{s.name}</Text>
              <Text style={styles.quoteProv}>{s.providerName}</Text>
            </View>
            <Text style={styles.quotePrice}>{formatCurrency(s.price)}</Text>
          </View>
        ))}
        <View style={styles.quoteTotalRow}>
          <Text style={styles.quoteTotalLabel}>Total calculado</Text>
          <Text style={styles.quoteTotalVal}>{formatCurrency(estimatedTotal)}</Text>
        </View>
      </View>

      <View style={styles.finalCard}>
        <View style={styles.finalIcon}>
          <Ionicons name="sparkles" size={32} color={Colors.white} />
        </View>
        <Text style={styles.finalName}>{name}</Text>
        <Text style={styles.finalDetails}>
          {typeName} • {date} • {location}
        </Text>
        <Text style={styles.finalGuests}>~{guests} invitados</Text>
        <View style={styles.finalPriceBox}>
          <Text style={styles.finalPriceLabel}>Cotización total:</Text>
          <Text style={styles.finalPriceValue}>{formatCurrency(estimatedTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteBox: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: Spacing.lg,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },
  quoteInfo: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  quoteSrvName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  quoteProv: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  quotePrice: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  quoteTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  quoteTotalLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
  },
  quoteTotalVal: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  finalCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  finalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  finalName: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
    textAlign: 'center',
    marginBottom: 4,
  },
  finalDetails: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    textAlign: 'center',
    marginBottom: 2,
  },
  finalGuests: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: Spacing.lg,
  },
  finalPriceBox: {
    backgroundColor: Colors.slate50,
    width: '100%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  finalPriceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: 2,
  },
  finalPriceValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
});
