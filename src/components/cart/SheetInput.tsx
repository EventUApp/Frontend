import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface SheetInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

/**
 * Equivalente a AppInput para usar dentro de un BottomSheetModal.
 * Un TextInput nativo pierde la gestión de foco/teclado dentro del sheet
 * (el teclado tapa el formulario en Android e iOS); BottomSheetTextInput
 * está conectado al sheet y evita ese problema.
 */
export const SheetInput: React.FC<SheetInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label} accessibilityElementsHidden>
          {label}
        </Text>
      )}
      <View style={styles.wrapper}>
        <BottomSheetTextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.slate400}
          keyboardType={keyboardType}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate700,
    marginBottom: Spacing.xs,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: Colors.slate200,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    color: Colors.slate900,
  },
});
