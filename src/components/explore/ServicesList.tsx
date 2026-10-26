import React from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  type RefreshControlProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { LayoutAnimation, stagger } from '../../constants/animations';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import { ServiceCard } from '../domain/ServiceCard';
import { listStyles } from './listStyles';
import { Service } from '../../types';

interface ServicesListProps {
  services: Service[];
  cartServiceIds: string[];
  compareIds: string[];
  extraBottomPadding: boolean;
  refreshControl: React.ReactElement<RefreshControlProps>;
  listRef: React.Ref<FlatList>;
  onServicePress: (service: Service) => void;
  onAddToCart: (service: Service) => void;
  onToggleCompare: (service: Service) => void;
  renderEmpty: () => React.ReactElement | null;
}

/** Lista virtualizada de servicios con botón de comparar por tarjeta. */
export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  cartServiceIds,
  compareIds,
  extraBottomPadding,
  refreshControl,
  listRef,
  onServicePress,
  onAddToCart,
  onToggleCompare,
  renderEmpty,
}) => {
  return (
    <FlatList
      ref={listRef}
      data={services}
      keyExtractor={(item) => item.id}
      renderItem={({ item: service, index }) => {
        const isInCart = cartServiceIds.includes(service.id);
        const isComparing = compareIds.includes(service.id);
        return (
          // Layout y entrada en nodos separados: mezclarlos sobrescribe
          // el `transform` (warning de Reanimated).
          <Animated.View layout={LayoutAnimation} style={styles.itemWrapper}>
            <Animated.View entering={stagger(index % 8)}>
              <ServiceCard
                service={service}
                onPress={() => onServicePress(service)}
                onAddToCart={() => onAddToCart(service)}
                isInCart={isInCart}
              />
              <TouchableOpacity
                style={[styles.compareBtn, isComparing && styles.compareBtnActive]}
                onPress={() => onToggleCompare(service)}
                accessibilityRole="button"
                accessibilityLabel={
                  isComparing
                    ? `Quitar ${service.name} de la comparación`
                    : `Seleccionar ${service.name} para comparar`
                }
                accessibilityState={{ selected: isComparing }}
              >
                <Ionicons
                  name={isComparing ? 'checkmark-circle' : 'git-compare-outline'}
                  size={14}
                  color={isComparing ? Colors.white : Colors.slate600}
                />
                <Text style={[styles.compareText, isComparing && styles.compareTextActive]}>
                  {isComparing ? 'Seleccionado para comparar' : 'Comparar'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        );
      }}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={[
        listStyles.listContent,
        extraBottomPadding && styles.listWithCompareBar,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  // Reserva espacio para la barra flotante cuando está visible.
  listWithCompareBar: {
    paddingBottom: SCROLL_BOTTOM_PADDING + 76,
  },
  itemWrapper: {
    marginBottom: Spacing.md,
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate300,
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
    marginTop: -Spacing.xs,
    marginBottom: Spacing.sm,
    minHeight: 44,
  },
  compareBtnActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  compareText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginLeft: 4,
    fontWeight: Typography.weights.medium,
  },
  compareTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
});
