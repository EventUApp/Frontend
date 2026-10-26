import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { AppButton } from '../ui/AppButton';
import { formatCurrency } from '../../utils/format';

interface CheckoutSuccessProps {
  eventName: string;
  amountPaid: number;
  pendingBalance: number;
  onViewEvent: () => void;
}

/** Vista de pago aprobado con recibo simulado. */
export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  eventName,
  amountPaid,
  pendingBalance,
  onViewEvent,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="checkmark-done" size={48} color={Colors.white} />
      </View>

      <Text style={styles.title}>¡Pago Aprobado!</Text>
      <Text style={styles.subtitle}>
        Tu transacción simulada fue procesada exitosamente.
      </Text>

      <View style={styles.receiptBox}>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Evento:</Text>
          <Text style={styles.receiptVal}>{eventName}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Monto Abonado:</Text>
          <Text style={styles.receiptAmount}>{formatCurrency(amountPaid)}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Estado del Evento:</Text>
          <Text style={[styles.receiptVal, styles.confirmedVal]}>
            Confirmado y Contratado
          </Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Saldo Pendiente:</Text>
          <Text style={styles.receiptVal}>{formatCurrency(pendingBalance)}</Text>
        </View>
      </View>

      <AppButton
        title="Ver Detalle y Cronograma del Evento"
        icon="calendar"
        size="lg"
        variant="primary"
        onPress={onViewEvent}
        style={styles.ctaBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.md,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  receiptLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  receiptVal: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate800,
  },
  confirmedVal: {
    color: Colors.success,
    fontWeight: '700',
  },
  receiptAmount: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  ctaBtn: {
    width: '100%',
    marginTop: Spacing.lg,
  },
});
