import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { AppInput } from '../ui/AppInput';
import { stepStyles } from './stepStyles';

interface StepSizeProps {
  guests: string;
  onGuestsChange: (value: string) => void;
  budget: string;
  onBudgetChange: (value: string) => void;
}

const GUEST_OPTIONS = [
  { label: 'Mini', range: '10-50', value: '30' },
  { label: 'Mediano', range: '50-100', value: '75' },
  { label: 'Grande', range: '+100', value: '150' },
];

const BUDGET_OPTIONS = [
  { label: '$1 M', value: '1000000' },
  { label: '$3 M', value: '3000000' },
  { label: '$5 M', value: '5000000' },
  { label: '$10 M', value: '10000000' },
];

/** Paso 2: magnitud (invitados y presupuesto, sin teclear si no quieres). */
export const StepSize: React.FC<StepSizeProps> = ({
  guests,
  onGuestsChange,
  budget,
  onBudgetChange,
}) => {
  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>¿De qué tamaño será?</Text>
      <Text style={stepStyles.desc}>
        Toca un tamaño y un rango: calculamos porciones y prioridades por ti.
      </Text>

      <Text style={stepStyles.fieldLabel}>Invitados</Text>
      <View style={stepStyles.quickRow}>
        {GUEST_OPTIONS.map((opt) => {
          const isSelected = guests === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.guestCard, isSelected && styles.guestCardActive]}
              onPress={() => onGuestsChange(opt.value)}
              accessibilityRole="radio"
              accessibilityLabel={`${opt.label}, de ${opt.range} invitados`}
              accessibilityState={{ selected: isSelected }}
            >
              <Ionicons
                name={isSelected ? 'people' : 'people-outline'}
                size={24}
                color={isSelected ? Colors.white : Colors.primary}
                accessibilityElementsHidden
              />
              <Text style={[styles.guestLabel, isSelected && styles.guestLabelActive]}>
                {opt.label} ({opt.range})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={stepStyles.fieldLabel}>Presupuesto</Text>
      <View style={stepStyles.quickRow}>
        {BUDGET_OPTIONS.map((opt) => {
          const isSelected = budget === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[stepStyles.quickChip, isSelected && stepStyles.quickChipActive]}
              onPress={() => onBudgetChange(opt.value)}
              accessibilityRole="radio"
              accessibilityLabel={`Presupuesto: ${opt.label} de pesos`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[stepStyles.quickChipText, isSelected && stepStyles.quickChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppInput
        label="Monto exacto en pesos (opcional)"
        value={budget}
        onChangeText={onBudgetChange}
        keyboardType="numeric"
        placeholder="3000000"
        leftIcon="cash-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  guestCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    minHeight: 44,
  },
  guestCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  guestLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate700,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  guestLabelActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
});
