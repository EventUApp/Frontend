import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';
import { EventPlanItem } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { formatCurrency } from '../../utils/format';
import { Avatar } from '../ui/Avatar';

interface ServiceCartItemProps {
  item: EventPlanItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onChangeProvider?: () => void;
  onViewDetail?: () => void;
}

export const ServiceCartItem: React.FC<ServiceCartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onChangeProvider,
  onViewDetail,
}) => {
  // Acción revelada al deslizar la tarjeta hacia la izquierda.
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.swipeDeleteBtn}
      onPress={onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Eliminar ${item.serviceName} del carrito`}
      accessibilityHint="Elimina el servicio y recalcula la cotización"
    >
      <Ionicons
        name="trash-outline"
        size={22}
        color={Colors.white}
        accessibilityElementsHidden
      />
      <Text style={styles.swipeDeleteText}>Eliminar</Text>
    </TouchableOpacity>
  );

  return (
    <ReanimatedSwipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
    <View style={styles.card}>
      {/* Category badge (el borrado vive en el swipe, no ocupa espacio fijo) */}
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.categoryName}</Text>
        </View>
      </View>

      {/* Service Title */}
      {onViewDetail ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewDetail}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${item.serviceName}`}
        >
          <Text style={styles.serviceName}>{item.serviceName}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.serviceName}>{item.serviceName}</Text>
      )}

      {/* Provider Details */}
      <View style={styles.providerRow}>
        <Avatar source={item.providerAvatar} name={item.providerName} size={24} />
        <Text style={styles.providerName}>{item.providerName}</Text>

        {onChangeProvider && (
          <TouchableOpacity
            style={styles.changeProviderBtn}
            onPress={onChangeProvider}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar proveedor de ${item.serviceName}`}
          >
            <Ionicons
              name="swap-horizontal"
              size={13}
              color={Colors.primary}
              accessibilityElementsHidden
            />
            <Text style={styles.changeProviderText}>Cambiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unit price and quantity control */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.unitPriceLabel}>
            {formatCurrency(item.unitPrice)} {item.priceUnit ? `/${item.priceUnit}` : ''}
          </Text>
          <Text style={styles.subtotalText}>
            Subtotal: <Text style={styles.subtotalAmount}>{formatCurrency(item.subtotal)}</Text>
          </Text>
        </View>

        {/* Quantity counter */}
        <View style={styles.counterBox}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.counterBtn}
            onPress={onDecrement}
            accessibilityRole="button"
            accessibilityLabel={
              item.quantity > 1
                ? `Disminuir cantidad de ${item.serviceName}`
                : `Eliminar ${item.serviceName} del carrito`
            }
            accessibilityHint={
              item.quantity > 1
                ? `Cantidad actual: ${item.quantity}`
                : 'La cantidad es 1, se eliminará el servicio'
            }
          >
            <Ionicons
              name={item.quantity > 1 ? 'remove' : 'trash'}
              size={14}
              color={Colors.slate700}
              accessibilityElementsHidden
            />
          </TouchableOpacity>

          <Text
            style={styles.quantityText}
            accessibilityLabel={`Cantidad: ${item.quantity}`}
          >
            {item.quantity}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.counterBtn}
            onPress={onIncrement}
            accessibilityRole="button"
            accessibilityLabel={`Aumentar cantidad de ${item.serviceName}`}
            accessibilityHint={`Cantidad actual: ${item.quantity}`}
          >
            <Ionicons name="add" size={14} color={Colors.slate700} accessibilityElementsHidden />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  // El margen vive en el contenedor del Swipeable para que la acción
  // de borrado ocupe exactamente el alto de la tarjeta.
  swipeContainer: {
    marginBottom: Spacing.md,
  },
  swipeDeleteBtn: {
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    marginLeft: Spacing.sm,
  },
  swipeDeleteText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
  },
  serviceName: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.xs,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  providerName: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  changeProviderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate100,
    paddingHorizontal: Spacing.sm,
    minHeight: 44,
    borderRadius: BorderRadius.sm,
  },
  changeProviderText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    marginLeft: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
  },
  unitPriceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  subtotalText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginTop: 2,
  },
  subtotalAmount: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate100,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  counterBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    minWidth: 24,
    textAlign: 'center',
  },
});
