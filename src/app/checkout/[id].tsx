import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  AppButton,
  EmptyState,
} from '../../components';
import { PaymentForm, type PaymentMethod } from '../../components/checkout/PaymentForm';
import { CheckoutSuccess } from '../../components/checkout/CheckoutSuccess';
import { formatCurrency } from '../../utils/format';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, simulatePayment } = useAppStore();
  const event = events.find((e) => e.id === id);

  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!event) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Evento no encontrado" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Evento no encontrado"
          description="El evento que buscas no existe o no tienes permiso para verlo."
          actionTitle="Volver a eventos"
          onActionPress={() => router.replace('/events')}
        />
      </ScreenContainer>
    );
  }

  const total = event.contractedPrice || event.quotedPrice;
  const initialDeposit = Math.round(total * 0.5);
  const pendingBalance = total - initialDeposit;
  const amountToPay = paymentOption === 'deposit' ? initialDeposit : total;

  const handlePay = () => {
    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      simulatePayment(event.id, amountToPay);
      setLoading(false);
      setPaymentApproved(true);
    }, 1200);
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title="Resumen de Pago (Simulado)"
        subtitle={event.name}
        showBack={!paymentApproved}
      />

      {/* El KAV evita que el teclado tape los campos de tarjeta y el
          botón de pagar al final del formulario. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {paymentApproved ? (
            <CheckoutSuccess
              eventName={event.name}
              amountPaid={amountToPay}
              pendingBalance={paymentOption === 'deposit' ? pendingBalance : 0}
              onViewEvent={() => router.replace(`/event/${event.id}`)}
            />
          ) : (
            <>
              {/* Amount Summary Box */}
              <View style={styles.amountCard}>
                <Text style={styles.amountCardTitle}>Valores de Contratación</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Precio Total del Plan:</Text>
                  <Text style={styles.amountTotal}>{formatCurrency(total)}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Anticipo sugerido (50%):</Text>
                  <Text style={styles.amountDeposit}>{formatCurrency(initialDeposit)}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Saldo pendiente al inicio:</Text>
                  <Text style={styles.amountPending}>{formatCurrency(pendingBalance)}</Text>
                </View>
              </View>

              {/* Choose Payment Mode */}
              <Text style={styles.sectionTitle}>¿Cuánto deseas abonar hoy?</Text>
              <View style={styles.paymentOptionsRow}>
                <TouchableOpacity
                  style={[styles.optionCard, paymentOption === 'deposit' && styles.optionCardActive]}
                  onPress={() => setPaymentOption('deposit')}
                  accessibilityRole="radio"
                  accessibilityLabel={`Pagar anticipo del 50 por ciento, ${formatCurrency(initialDeposit)}`}
                  accessibilityState={{ selected: paymentOption === 'deposit' }}
                >
                  <View style={styles.radioRow}>
                    <Ionicons
                      name={paymentOption === 'deposit' ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={paymentOption === 'deposit' ? Colors.primary : Colors.slate400}
                    />
                    <Text style={styles.optionTitle}>Pagar Anticipo (50%)</Text>
                  </View>
                  <Text style={styles.optionAmount}>{formatCurrency(initialDeposit)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, paymentOption === 'full' && styles.optionCardActive]}
                  onPress={() => setPaymentOption('full')}
                  accessibilityRole="radio"
                  accessibilityLabel={`Pagar total del 100 por ciento, ${formatCurrency(total)}`}
                  accessibilityState={{ selected: paymentOption === 'full' }}
                >
                  <View style={styles.radioRow}>
                    <Ionicons
                      name={paymentOption === 'full' ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={paymentOption === 'full' ? Colors.primary : Colors.slate400}
                    />
                    <Text style={styles.optionTitle}>Pagar Total (100%)</Text>
                  </View>
                  <Text style={styles.optionAmount}>{formatCurrency(total)}</Text>
                </TouchableOpacity>
              </View>

              <PaymentForm
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
                cardNumber={cardNumber}
                onCardNumberChange={setCardNumber}
                cardExpiry={cardExpiry}
                onCardExpiryChange={setCardExpiry}
                cardCvv={cardCvv}
                onCardCvvChange={setCardCvv}
                onSubmit={handlePay}
              />

              {/* Disclaimer */}
              <View style={styles.securityAlert}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
                <Text style={styles.securityAlertText}>
                  Ambiente de pruebas. Ningún cargo real será efectuado a tu cuenta bancaria.
                </Text>
              </View>

              {/* Pay Button */}
              <AppButton
                title={`Simular Pago de ${formatCurrency(amountToPay)}`}
                icon="lock-closed-outline"
                size="lg"
                variant="primary"
                loading={loading}
                onPress={handlePay}
                style={styles.payBtn}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: SCROLL_BOTTOM_PADDING,
    flexGrow: 1,
  },
  amountCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  amountCardTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  amountLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
  },
  amountTotal: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
  },
  amountDeposit: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  amountPending: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate700,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.sm,
  },
  paymentOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  optionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginLeft: 4,
  },
  optionAmount: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  securityAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  securityAlertText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    marginLeft: 6,
    flex: 1,
  },
  payBtn: {
    marginTop: Spacing.lg,
  },
});
