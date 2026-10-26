import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { AppButton } from '../ui/AppButton';
import { formatCurrency } from '../../utils/format';
import { AppEvent } from '../../types';

interface EventPaymentsTabProps {
  event: AppEvent;
}

/** Pestaña Pagos: historial de abonos y saldo. */
export const EventPaymentsTab: React.FC<EventPaymentsTabProps> = ({ event }) => {
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Historial de Pagos y Abonos</Text>

        <View style={styles.paymentItem}>
          <View style={styles.paymentIconBox}>
            <Ionicons name="checkmark" size={18} color={Colors.success} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Anticipo de Formalización</Text>
            <Text style={styles.paymentDate}>Fecha: {event.createdAt}</Text>
          </View>
          <Text style={styles.paymentAmount}>
            {formatCurrency(event.depositPaid)}
          </Text>
        </View>

        <View style={styles.paymentItem}>
          <View
            style={[
              styles.paymentIconBox,
              { backgroundColor: event.balanceDue > 0 ? '#FEF3C7' : '#ECFDF5' },
            ]}
          >
            <Ionicons
              name={event.balanceDue > 0 ? 'time-outline' : 'checkmark'}
              size={18}
              color={event.balanceDue > 0 ? Colors.accent : Colors.success}
            />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Saldo Final de Liquidación</Text>
            <Text style={styles.paymentDate}>Pagadero el día del evento</Text>
          </View>
          <Text
            style={[
              styles.paymentAmount,
              { color: event.balanceDue > 0 ? Colors.accent : Colors.success },
            ]}
          >
            {formatCurrency(event.balanceDue)}
          </Text>
        </View>

        {event.balanceDue > 0 && (
          <AppButton
            title="Pagar Saldo Pendiente"
            icon="card-outline"
            onPress={() => router.push(`/checkout/${event.id}`)}
            style={styles.payBtn}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },
  paymentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  paymentTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
  },
  paymentDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  paymentAmount: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
  },
  payBtn: {
    marginTop: Spacing.md,
  },
});
