import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { ActiveCart } from '../../store/useAppStore';

interface HomeEventStatusProps {
  cart: ActiveCart;
}

/** Tarjeta de "Evento en Armado" o invitación si el carrito está vacío. */
export const HomeEventStatus: React.FC<HomeEventStatusProps> = ({ cart }) => {
  const hasServices = cart.services.length > 0;

  if (hasServices) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.activeCard}
        onPress={() => router.push('/cart')}
        accessibilityRole="button"
        accessibilityLabel={`Evento en armado: ${cart.name}, ${cart.services.length} servicios en carrito. Ver cotización.`}
      >
        <View style={styles.activeHeader}>
          <View style={styles.activePill}>
            <View style={styles.pulseDot} />
            <Text style={styles.activePillText}>Evento en Armado</Text>
          </View>
          <Text style={styles.activeDate}>{cart.date || 'Sin fecha fija'}</Text>
        </View>

        <Text style={styles.activeTitle}>{cart.name}</Text>

        <View style={styles.activeFooter}>
          <Text style={styles.activeCount}>
            🛒 {cart.services.length} servicios en carrito
          </Text>
          <View style={styles.activeAction}>
            <Text style={styles.activeActionText}>Ver cotización</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.emptyCard}
      onPress={() => router.push('/create-event')}
      accessibilityRole="button"
      accessibilityLabel="Aún no tienes un evento en armado. Comienza a armar tu evento ahora."
    >
      <View style={styles.emptyIcon}>
        <Ionicons name="calendar-outline" size={26} color={Colors.primary} />
      </View>
      <View style={styles.emptyTextCol}>
        <Text style={styles.emptyTitle}>
          ¡Comienza a armar tu evento ahora!
        </Text>
        <Text style={styles.emptyDesc}>
          Cuéntanos la ocasión y te sugerimos proveedores y planes.
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.slate400} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activeCard: {
    backgroundColor: Colors.slate900,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    ...Shadows.md,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  activePillText: {
    color: '#E0E7FF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  activeDate: {
    color: Colors.slate400,
    fontSize: Typography.sizes.xs,
  },
  activeTitle: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  activeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Spacing.sm,
  },
  activeCount: {
    color: Colors.slate300,
    fontSize: Typography.sizes.xs,
  },
  activeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  activeActionText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginRight: 4,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderStyle: 'dashed',
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  emptyTextCol: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 2,
  },
  emptyDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
});
