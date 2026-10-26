import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockEventTypes } from '../../mocks';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { AppInput } from '../ui/AppInput';
import { stepStyles } from './stepStyles';

type EventType = (typeof mockEventTypes)[number];

interface StepBasicsProps {
  selectedType: EventType;
  onSelectType: (type: EventType) => void;
  name: string;
  onNameChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
}

const DATE_OPTIONS = [
  { label: 'En 2 semanas', days: 14 },
  { label: 'En 1 mes', days: 30 },
  { label: 'En 3 meses', days: 90 },
];

const CITY_OPTIONS = ['Cali', 'Medellín', 'Bogotá', 'Cartagena'];

/** Fecha AAAA-MM-DD dentro de `days` días. */
const dateInDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

/** Paso 1: lo básico. Fecha y ubicación son chips; el teclado solo
    aparece si se elige "Otro". */
export const StepBasics: React.FC<StepBasicsProps> = ({
  selectedType,
  onSelectType,
  name,
  onNameChange,
  date,
  onDateChange,
  location,
  onLocationChange,
}) => {
  const [customDate, setCustomDate] = useState(false);
  const [customLocation, setCustomLocation] = useState(false);

  const dateIsPreset = DATE_OPTIONS.some((o) => dateInDays(o.days) === date);
  const showDateInput = customDate || !dateIsPreset;
  const locationIsPreset = CITY_OPTIONS.includes(location);
  const showLocationInput = customLocation || !locationIsPreset;

  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Lo básico de tu evento</Text>
      <Text style={stepStyles.desc}>
        Tipo, nombre, fecha y ciudad. Toca y avanza, sin formularios eternos.
      </Text>

      <Text style={stepStyles.fieldLabel}>Tipo de evento</Text>
      <View style={styles.grid2}>
        {mockEventTypes.map((t) => {
          const isSelected = selectedType.id === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.typeCard, isSelected && styles.typeCardActive]}
              onPress={() => onSelectType(t)}
              accessibilityRole="radio"
              accessibilityLabel={`Tipo de evento: ${t.name}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Ionicons
                name={t.icon as any}
                size={28}
                color={isSelected ? Colors.primary : Colors.slate500}
              />
              <Text style={[styles.typeName, isSelected && styles.typeNameActive]}>
                {t.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppInput
        label="Nombre del evento"
        value={name}
        onChangeText={onNameChange}
        placeholder="Ej: Primera Comunión Martín"
      />

      <Text style={stepStyles.fieldLabel}>Fecha (opcional por ahora)</Text>
      <View style={stepStyles.quickRow}>
        {DATE_OPTIONS.map((opt) => {
          const value = dateInDays(opt.days);
          const isSelected = date === value;
          return (
            <TouchableOpacity
              key={opt.label}
              style={[stepStyles.quickChip, isSelected && stepStyles.quickChipActive]}
              onPress={() => {
                onDateChange(value);
                setCustomDate(false);
              }}
              accessibilityRole="radio"
              accessibilityLabel={`Fecha: ${opt.label}, ${value}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[stepStyles.quickChipText, isSelected && stepStyles.quickChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[stepStyles.quickChip, showDateInput && stepStyles.quickChipActive]}
          onPress={() => setCustomDate(true)}
          accessibilityRole="radio"
          accessibilityLabel="Otra fecha, escribir manualmente"
          accessibilityState={{ selected: showDateInput }}
        >
          <Text style={[stepStyles.quickChipText, showDateInput && stepStyles.quickChipTextActive]}>
            Otro
          </Text>
        </TouchableOpacity>
      </View>
      {showDateInput && (
        <AppInput
          label="Fecha exacta (AAAA-MM-DD)"
          value={date}
          onChangeText={onDateChange}
          placeholder="2026-11-20"
          leftIcon="calendar-outline"
        />
      )}

      <Text style={stepStyles.fieldLabel}>Ubicación (opcional por ahora)</Text>
      <View style={stepStyles.quickRow}>
        {CITY_OPTIONS.map((city) => {
          const isSelected = location === city;
          return (
            <TouchableOpacity
              key={city}
              style={[stepStyles.quickChip, isSelected && stepStyles.quickChipActive]}
              onPress={() => {
                onLocationChange(city);
                setCustomLocation(false);
              }}
              accessibilityRole="radio"
              accessibilityLabel={`Ubicación: ${city}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[stepStyles.quickChipText, isSelected && stepStyles.quickChipTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[stepStyles.quickChip, showLocationInput && stepStyles.quickChipActive]}
          onPress={() => setCustomLocation(true)}
          accessibilityRole="radio"
          accessibilityLabel="Otra ubicación, escribir manualmente"
          accessibilityState={{ selected: showLocationInput }}
        >
          <Text style={[stepStyles.quickChipText, showLocationInput && stepStyles.quickChipTextActive]}>
            Otro
          </Text>
        </TouchableOpacity>
      </View>
      {showLocationInput && (
        <AppInput
          label="Ciudad / Ubicación"
          value={location}
          onChangeText={onLocationChange}
          placeholder="Ej: Envigado, Valle del Cauca"
          leftIcon="location-outline"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  typeCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
  },
  typeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  typeName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate700,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  typeNameActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
});
