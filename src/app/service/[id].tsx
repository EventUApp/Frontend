import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import {
  ScreenContainer,
  AppHeader,
  PriceTag,
  EmptyState,
} from '../../components';
import { ServiceGallery } from '../../components/service/ServiceGallery';
import { ServiceHero } from '../../components/service/ServiceHero';
import { ServicePriceCard } from '../../components/service/ServicePriceCard';
import { ServiceProviderRow } from '../../components/service/ServiceProviderRow';
import { ServiceDescription } from '../../components/service/ServiceDescription';
import { ServiceToast } from '../../components/service/ServiceToast';

/** Controlador del detalle: estado del CTA + toast. El contenido vive
    en `src/components/service/`. */
export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeCart, addServiceToCart, providerServices } = useAppStore();
  const insets = useSafeAreaInsets();

  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const btnScale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const service = providerServices.find((s) => s.id === id);

  if (!service) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Servicio no encontrado" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Servicio no encontrado"
          description="El servicio que buscas no existe o no está disponible."
          actionTitle="Volver al inicio"
          onActionPress={() => router.replace('/')}
        />
      </ScreenContainer>
    );
  }

  const isInCart = activeCart.services.some((s) => s.serviceId === service.id);

  const handleAddToCart = () => {
    btnScale.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withSpring(1, { damping: 10, stiffness: 220 })
    );
    if (isInCart) {
      router.push('/cart');
      return;
    }
    addServiceToCart(service, 1);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 2400);
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader title={service.name} subtitle={service.categoryName} showBack />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <ServiceGallery service={service} />
        <View style={styles.body}>
          <ServiceHero service={service} />
          <ServicePriceCard service={service} />
          <ServiceProviderRow service={service} />
          <ServiceDescription service={service} />
        </View>
      </ScrollView>

      {showToast && <ServiceToast bottomOffset={84 + insets.bottom} />}

      {/* Sticky Bottom CTA */}
      <View style={[styles.stickyBar, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Total del servicio</Text>
          <PriceTag price={service.price} unit={service.priceUnit} size="lg" color={Colors.primaryDark} />
        </View>
        <Animated.View style={[styles.btnCol, animatedBtnStyle]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.ctaBtn, isInCart && styles.ctaBtnInCart]}
            onPress={handleAddToCart}
            accessibilityRole="button"
            accessibilityLabel={isInCart ? 'Servicio ya agregado, ir a mi evento' : 'Agregar servicio a mi evento'}
          >
            <Ionicons
              name={isInCart ? 'cart' : 'add-circle'}
              size={18}
              color={Colors.white}
              style={styles.ctaIcon}
            />
            <Text style={styles.ctaText}>{isInCart ? 'En tu evento ✓' : 'Agregar al evento'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  body: {
    padding: Spacing.lg,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  priceCol: {
    flex: 1,
    marginRight: Spacing.md,
  },
  priceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: 1,
  },
  btnCol: {
    flexShrink: 0,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  ctaBtnInCart: {
    backgroundColor: Colors.secondary,
  },
  ctaIcon: {
    marginRight: 6,
  },
  ctaText: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
});
