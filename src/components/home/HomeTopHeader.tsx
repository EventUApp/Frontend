import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface HomeTopHeaderProps {
  userName: string;
  cartCount: number;
}

/** Saludo + carrito + buscador falso que abre Explorar. */
export const HomeTopHeader: React.FC<HomeTopHeaderProps> = ({ userName, cartCount }) => {
  const hasItems = cartCount > 0;
  const badgeLabel = cartCount > 99 ? '99+' : String(cartCount);

  return (
    <View style={styles.header}>
      <View style={styles.welcomeRow}>
        <View>
          <Text style={styles.greeting}>¡Hola, {userName.split(' ')[0]}! 👋</Text>
          <Text style={styles.subtitle}>
            Organiza, cotiza y contrata tu evento soñado
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/cart')}
          accessibilityRole="button"
          accessibilityLabel={hasItems ? `Ver carrito, ${cartCount} servicios` : 'Ver carrito, vacío'}
        >
          <Ionicons name="cart-outline" size={24} color={Colors.primary} />
          {hasItems && (
            <View style={styles.badge}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {badgeLabel}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Buscador falso: no filtra aquí (libera memoria del Home),
          lleva directo a Explorar. */}
      <TouchableOpacity
        style={styles.fakeSearch}
        activeOpacity={0.7}
        onPress={() => router.push('/explore')}
        accessibilityRole="button"
        accessibilityLabel="Buscar servicios y proveedores"
        accessibilityHint="Abre el explorador con filtros y categorías"
      >
        <Ionicons name="search-outline" size={20} color={Colors.slate400} />
        <Text style={styles.fakeSearchText}>Buscar salones, fotógrafos, catering...</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
    marginTop: 2,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.secondary,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  fakeSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginTop: Spacing.xs,
    minHeight: 44,
  },
  fakeSearchText: {
    flex: 1,
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    color: Colors.slate400,
    marginLeft: Spacing.sm,
  },
});
