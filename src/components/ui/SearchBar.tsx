import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar servicios, proveedores o planes...',
  onClear,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons
        name="search-outline"
        size={20}
        color={Colors.slate400}
        style={styles.icon}
        accessibilityElementsHidden
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.slate400}
        returnKeyType="search"
        accessibilityRole="search"
        accessibilityLabel="Buscar"
        accessibilityHint="Escribe para filtrar servicios, proveedores o planes"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.clearBtn}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <Ionicons name="close-circle" size={18} color={Colors.slate400} accessibilityElementsHidden />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  clearBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    color: Colors.slate900,
  },
});
