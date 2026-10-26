import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { formatCurrency } from '../../utils/format';

interface ProviderHeaderProps {
  revenue: number;
}

/** Banner oscuro superior + tarjeta de ingresos contratados. */
export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ revenue }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.tag}>PANEL DE PROVEEDOR</Text>
          <Text style={styles.title}>Foto Studio ABC</Text>
          <Text style={styles.subtitle}>Resumen operacional y contrataciones</Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.white} />
          <Text style={styles.verifiedText}>Verificado</Text>
        </View>
      </View>

      {/* Quick Revenue Box */}
      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Ingresos Contratados en Custodia (Escrow)</Text>
        <Text style={styles.revenueValue}>{formatCurrency(revenue || 1100000)}</Text>
        <Text style={styles.revenueNote}>Garantizados para 3 eventos confirmados este mes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.slate900,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  tag: {
    color: '#818CF8',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.extrabold,
    color: Colors.white,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginLeft: 4,
  },
  revenueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  revenueLabel: {
    color: Colors.slate300,
    fontSize: Typography.sizes.xs,
    marginBottom: 4,
  },
  revenueValue: {
    color: Colors.white,
    fontSize: Typography.sizes.xxl,
    lineHeight: Typography.lineHeights.xxl,
    fontWeight: Typography.weights.extrabold,
  },
  revenueNote: {
    color: Colors.slate400,
    fontSize: Typography.sizes.xs,
    marginTop: 4,
  },
});
