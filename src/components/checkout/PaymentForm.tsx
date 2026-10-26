import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { AppInput } from '../ui/AppInput';

export type PaymentMethod = 'card' | 'pse' | 'transfer';

interface PaymentFormProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  cardNumber: string;
  onCardNumberChange: (value: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (value: string) => void;
  cardCvv: string;
  onCardCvvChange: (value: string) => void;
  /** Se dispara con "done" en el CVV para pagar sin buscar el botón. */
  onSubmit: () => void;
}

const METHODS: {
  id: PaymentMethod;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  name: string;
  desc: string;
}[] = [
  {
    id: 'card',
    icon: 'card-outline',
    iconColor: Colors.primary,
    name: 'Tarjeta de Crédito / Débito',
    desc: 'Visa, Mastercard, American Express',
  },
  {
    id: 'pse',
    icon: 'business-outline',
    iconColor: Colors.info,
    name: 'PSE (Débito Bancario)',
    desc: 'Bancolombia, Davivienda, Nequi, etc.',
  },
  {
    id: 'transfer',
    icon: 'swap-horizontal-outline',
    iconColor: Colors.accent,
    name: 'Transferencia Directa Bancaria',
    desc: 'Comprobante de consignación',
  },
];

/** Métodos de pago + campos de tarjeta simulada con foco encadenado. */
export const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedMethod,
  onSelectMethod,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvv,
  onCardCvvChange,
  onSubmit,
}) => {
  const numberRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const expiryRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const cvvRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  return (
    <>
      <Text style={styles.sectionTitle}>Selecciona un Medio de Pago (Mock)</Text>

      {METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, isSelected && styles.methodCardActive]}
            onPress={() => onSelectMethod(method.id)}
            accessibilityRole="radio"
            accessibilityLabel={`Método de pago: ${method.name}`}
            accessibilityState={{ selected: isSelected }}
          >
            <Ionicons name={method.icon} size={24} color={method.iconColor} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDesc}>{method.desc}</Text>
            </View>
            <Ionicons
              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={isSelected ? Colors.primary : Colors.slate300}
            />
          </TouchableOpacity>
        );
      })}

      {selectedMethod === 'card' && (
        <View style={styles.mockFieldsBox}>
          <AppInput
            label="Número de tarjeta simulada"
            value={cardNumber}
            onChangeText={onCardNumberChange}
            placeholder="4000 1234 5678 9010"
            leftIcon="card-outline"
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
            inputRef={numberRef}
            onSubmitEditing={() => expiryRef.current?.focus()}
          />
          <View style={styles.expiryRow}>
            <AppInput
              label="Vencimiento"
              value={cardExpiry}
              onChangeText={onCardExpiryChange}
              placeholder="12/28"
              containerStyle={styles.expiryField}
              keyboardType="numeric"
              returnKeyType="next"
              blurOnSubmit={false}
              inputRef={expiryRef}
              onSubmitEditing={() => cvvRef.current?.focus()}
            />
            <AppInput
              label="CVV"
              value={cardCvv}
              onChangeText={onCardCvvChange}
              placeholder="123"
              containerStyle={styles.cvvField}
              keyboardType="numeric"
              secureTextEntry
              returnKeyType="done"
              inputRef={cvvRef}
              onSubmitEditing={onSubmit}
            />
          </View>
        </View>
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
    marginBottom: Spacing.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
    minHeight: 44,
  },
  methodCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FAF5FF',
  },
  methodInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  methodName: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  methodDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  mockFieldsBox: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  expiryRow: {
    flexDirection: 'row',
  },
  expiryField: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cvvField: {
    flex: 1,
  },
});
