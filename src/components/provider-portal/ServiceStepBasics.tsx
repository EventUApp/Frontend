import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { mockCategories } from '../../mocks';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { AppInput } from '../ui/AppInput';
import { ServiceCategoryId } from '../../types';

interface ServiceStepBasicsProps {
  name: string;
  onNameChange: (value: string) => void;
  category: ServiceCategoryId;
  onCategoryChange: (value: ServiceCategoryId) => void;
  price: string;
  onPriceChange: (value: string) => void;
  priceUnit: string;
  onPriceUnitChange: (value: string) => void;
}

/** Paso 1: nombre, categoría, precio y unidad (foco encadenado). */
export const ServiceStepBasics: React.FC<ServiceStepBasicsProps> = ({
  name,
  onNameChange,
  category,
  onCategoryChange,
  price,
  onPriceChange,
  priceUnit,
  onPriceUnitChange,
}) => {
  const nameRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const priceRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const unitRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  return (
    <View>
      <AppInput
        label="Nombre del Servicio"
        required
        value={name}
        onChangeText={onNameChange}
        placeholder="Ej: Cobertura Fotográfica Documental"
        returnKeyType="next"
        blurOnSubmit={false}
        inputRef={nameRef}
        onSubmitEditing={() => priceRef.current?.focus()}
      />

      <Text style={styles.label}>Categoría del Servicio</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {mockCategories.slice(0, 10).map((c) => {
          const isSelected = category === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onCategoryChange(c.id)}
              accessibilityRole="radio"
              accessibilityLabel={`Categoría: ${c.name}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.row}>
        <AppInput
          label="Precio base (COP)"
          required
          value={price}
          onChangeText={onPriceChange}
          keyboardType="numeric"
          placeholder="350000"
          containerStyle={styles.priceField}
          returnKeyType="next"
          blurOnSubmit={false}
          inputRef={priceRef}
          onSubmitEditing={() => unitRef.current?.focus()}
        />
        <AppInput
          label="Unidad de cobro"
          value={priceUnit}
          onChangeText={onPriceUnitChange}
          placeholder="por evento / por hora"
          containerStyle={styles.unitField}
          returnKeyType="done"
          inputRef={unitRef}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate700,
    marginBottom: Spacing.xs,
  },
  categoryScroll: {
    paddingBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginRight: Spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    fontWeight: Typography.weights.medium,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  row: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  priceField: {
    flex: 1.2,
    marginRight: Spacing.sm,
  },
  unitField: {
    flex: 1,
  },
});
