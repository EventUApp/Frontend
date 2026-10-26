import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockCategories, mockServices } from '../../mocks';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { PriceTag } from '../ui/PriceTag';
import { stepStyles } from './stepStyles';
import { Service } from '../../types';

interface StepServicesProps {
  selectedCategories: string[];
  onToggleCategory: (catId: string) => void;
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
}

/** Paso 3: categorías necesitadas + servicios de proveedores. */
export const StepServices: React.FC<StepServicesProps> = ({
  selectedCategories,
  onToggleCategory,
  selectedServices,
  onToggleService,
}) => {
  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>¿Qué necesitas?</Text>
      <Text style={stepStyles.desc}>
        Marca categorías y elige los servicios de tu cotización automática.
      </Text>

      <Text style={stepStyles.fieldLabel}>Categorías</Text>
      <View style={styles.chipsWrap}>
        {mockCategories.slice(0, 14).map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
              onPress={() => onToggleCategory(cat.id)}
              accessibilityRole="checkbox"
              accessibilityLabel={cat.name}
              accessibilityState={{ checked: isSelected }}
            >
              <Ionicons
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={16}
                color={isSelected ? Colors.white : Colors.slate500}
              />
              <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={stepStyles.fieldLabel}>Servicios ({selectedServices.length} elegidos)</Text>
      {mockServices.map((srv) => {
        const isSelected = selectedServices.some((s) => s.id === srv.id);
        return (
          <TouchableOpacity
            key={srv.id}
            style={[styles.srvCard, isSelected && styles.srvCardActive]}
            onPress={() => onToggleService(srv)}
            accessibilityRole="checkbox"
            accessibilityLabel={`${srv.name}, ${srv.providerName}`}
            accessibilityState={{ checked: isSelected }}
          >
            <View style={styles.srvHeader}>
              <Text style={styles.srvName}>{srv.name}</Text>
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isSelected ? Colors.primary : Colors.slate300}
              />
            </View>
            <Text style={styles.srvProvider}>
              {srv.providerName} • {srv.categoryName}
            </Text>
            <PriceTag price={srv.price} unit={srv.priceUnit} size="sm" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    minHeight: 44,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  srvCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  srvCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FAF5FF',
  },
  srvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  srvName: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    flex: 1,
  },
  srvProvider: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: Spacing.xs,
  },
});
