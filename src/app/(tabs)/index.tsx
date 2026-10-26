import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { mockPlans, mockProviders } from '../../mocks';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import { ScreenContainer, SectionHeader } from '../../components';
import { PopularPlansCarousel } from '../../components/home/PopularPlansCarousel';
import { FeaturedProvidersCarousel } from '../../components/home/FeaturedProvidersCarousel';

export default function HomeScreen() {
  const { currentUser, activeCart, clonePlanToCart } = useAppStore();

  useEffect(() => {
    if (currentUser.role === 'provider') {
      router.replace('/provider-dashboard');
    }
  }, [currentUser.role]);

  const hasActiveServices = activeCart.services.length > 0;
  const cartBadgeLabel = activeCart.services.length > 99 ? '99+' : String(activeCart.services.length);

  const popularPlans = mockPlans.filter((p) => p.popular).slice(0, 5);
  const featuredProviders = mockProviders.slice(0, 5);

  const clientActions = [
    {
      icon: 'add-circle-outline' as const,
      title: 'Crear Evento',
      route: '/create-event',
      color: Colors.primary,
      bg: '#EEF2FF',
    },
    {
      icon: 'calendar-outline' as const,
      title: 'Mis Eventos',
      route: '/events',
      color: Colors.secondary,
      bg: '#F5F3FF',
    },
    {
      icon: 'search-outline' as const,
      title: 'Explorar',
      route: '/explore',
      color: Colors.accent,
      bg: '#FFFBEB',
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Garantías',
      route: '/claims',
      color: Colors.success,
      bg: '#ECFDF5',
    },
  ];

  const handleUsePlan = (plan: typeof mockPlans[0]) => {
    clonePlanToCart(plan);
    router.push('/cart');
  };

  if (currentUser.role === 'provider') {
    return null;
  }

  return (
    <ScreenContainer
      scrollable
      backgroundColor={Colors.slate50}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.topHeader}>
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeTextCol}>
            <Text style={styles.greetingText}>
              ¡Hola, {currentUser.name.split(' ')[0]}! 👋
            </Text>
            <Text style={styles.subtitleText}>
              Gestiona tu evento y contrata proveedores seguros
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cartIconBadge}
            onPress={() => router.push('/cart')}
            accessibilityRole="button"
            accessibilityLabel="Mi carrito y servicios del evento"
          >
            <Ionicons name="cart-outline" size={24} color={Colors.primary} />
            {hasActiveServices && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText} numberOfLines={1}>{cartBadgeLabel}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Read-only Search Bar -> redirects to Explore */}
        <TouchableOpacity
          style={styles.fakeSearchBar}
          activeOpacity={0.9}
          onPress={() => router.push('/explore')}
          accessibilityRole="button"
          accessibilityLabel="Buscar fotógrafos, catering, salones"
        >
          <Ionicons name="search" size={20} color={Colors.slate400} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Buscar fotógrafos, catering, salones...</Text>
        </TouchableOpacity>
      </View>

      <View>
        {/* HERO CTA: Una sola decisión clara para el usuario */}
        {hasActiveServices ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.activeEventCard}
            onPress={() => router.push('/cart')}
            accessibilityRole="button"
            accessibilityLabel={`Gestionar evento en curso: ${activeCart.name}`}
          >
            <View style={styles.activeEventHeader}>
              <View style={styles.activePill}>
                <View style={styles.pulseDot} />
                <Text style={styles.activePillText}>En Armado</Text>
              </View>
              <Text style={styles.activeDate}>{activeCart.date || 'Sin fecha fija'}</Text>
            </View>
            <Text style={styles.activeEventTitle}>{activeCart.name}</Text>
            <View style={styles.activeEventFooter}>
              <Text style={styles.activeServicesCount}>🛒 {activeCart.services.length} servicios guardados</Text>
              <View style={styles.activeEventAction}>
                <Text style={styles.activeEventActionText}>Ver cotización</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.heroWizardCard}
            onPress={() => router.push('/create-event')}
            accessibilityRole="button"
            accessibilityLabel="Iniciar asistente para organizar tu evento"
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroIconBadge}>
                <Ionicons name="sparkles" size={24} color={Colors.primaryDark} />
              </View>
              <Text style={styles.heroTitle}>¿Qué vamos a celebrar hoy?</Text>
              <Text style={styles.heroSubtitle}>Usa nuestro asistente paso a paso y organiza todo en minutos.</Text>
              <View style={styles.heroBtn}>
                <Text style={styles.heroBtnText}>Iniciar Asistente</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Acciones Rápidas del Cliente */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsHeader}>PANEL DE CONTROL</Text>
          <View style={styles.quickActionsRow}>
            {clientActions.map((act) => (
              <TouchableOpacity
                key={act.title}
                style={styles.quickActionCard}
                onPress={() => router.push(act.route as any)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={act.title}
              >
                <View style={[styles.quickActionIconBox, { backgroundColor: act.bg }]}>
                  <Ionicons name={act.icon} size={20} color={act.color} />
                </View>
                <Text style={styles.quickActionTitle}>{act.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* INSPIRACIÓN: Carruseles Horizontales limpios */}
        <View style={styles.sectionMargin}>
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <SectionHeader
              title="Paquetes Todo Incluido"
              subtitle="Planes populares listos para usar"
              actionText="Ver todos"
              onActionPress={() => router.push('/explore')}
            />
          </View>
          <PopularPlansCarousel
            plans={popularPlans}
            onPlanPress={(plan) => router.push(`/plan/${plan.id}`)}
            onUsePlan={handleUsePlan}
          />
        </View>

        <View style={styles.sectionMargin}>
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <SectionHeader
              title="Proveedores Top"
              subtitle="Los expertos mejor calificados"
              actionText="Ver directorio"
              onActionPress={() => router.push('/explore')}
            />
          </View>
          <FeaturedProvidersCarousel
            providers={featuredProviders}
            onProviderPress={(provider) => router.push(`/provider/${provider.id}`)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
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
  welcomeTextCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  greetingText: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
  },
  subtitleText: {
    fontSize: Typography.sizes.sm,
    color: Colors.slate500,
    marginTop: 2,
  },
  cartIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCount: {
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
  badgeCountText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  fakeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate100,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchPlaceholder: {
    color: Colors.slate400,
    fontSize: Typography.sizes.md,
  },
  contentContainer: {
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  heroWizardCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.primaryDark,
    opacity: 0.8,
  },
  heroContent: {
    padding: Spacing.xl,
    alignItems: 'flex-start',
  },
  heroIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeights.xxl,
  },
  heroSubtitle: {
    color: '#E0E7FF',
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    marginBottom: Spacing.lg,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  heroBtnText: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm,
    marginRight: Spacing.xs,
  },
  activeEventCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.slate900,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  activeEventHeader: {
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
  activeEventTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  activeEventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Spacing.sm,
  },
  activeServicesCount: {
    color: Colors.slate300,
    fontSize: Typography.sizes.xs,
  },
  activeEventAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  activeEventActionText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginRight: 4,
  },
  sectionMargin: {
    marginBottom: Spacing.xl,
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickActionsHeader: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate500,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  quickActionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate700,
    textAlign: 'center',
  },
});
