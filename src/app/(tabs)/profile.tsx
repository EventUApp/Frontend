import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { ScreenContainer, Avatar, AppButton } from '../../components';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';

export default function ProfileScreen() {
  const { currentUser, switchRole, events, claims } = useAppStore();
  const isProvider = currentUser.role === 'provider';
  const isGuest = currentUser.role === 'guest';

  const menuItems = isProvider
    ? [
        {
          id: 'dashboard',
          icon: 'grid-outline' as const,
          label: 'Dashboard de Operaciones',
          subtitle: 'Ingresos, métricas y solicitudes del negocio',
          onPress: () => router.push('/provider-dashboard'),
        },
        {
          id: 'services',
          icon: 'albums-outline' as const,
          label: 'Mis Servicios Publicados',
          subtitle: 'Crear, pausar y editar catálogo',
          onPress: () => router.push('/provider-services'),
        },
        {
          id: 'requests',
          icon: 'mail-unread-outline' as const,
          label: 'Solicitudes de Clientes',
          subtitle: 'Aceptar o rechazar contrataciones',
          onPress: () => router.push('/provider-requests'),
        },
        {
          id: 'update-price',
          icon: 'pricetags-outline' as const,
          label: 'Actualización de Precios',
          subtitle: 'Ajustar tarifas garantizando contratos vigentes',
          onPress: () => router.push('/provider-portal/update-price'),
        },
        {
          id: 'claims',
          icon: 'alert-circle-outline' as const,
          label: 'Gestión de Reclamos',
          subtitle: `${claims.length} reclamos registrados`,
          onPress: () => router.push('/claims'),
        },
      ]
    : [
        {
          id: 'events',
          icon: 'calendar-outline' as const,
          label: 'Mis Eventos',
          subtitle: `${events.length} eventos (borradores, cotizados, confirmados)`,
          onPress: () => router.push('/events'),
        },
        {
          id: 'quotes',
          icon: 'document-text-outline' as const,
          label: 'Mis Cotizaciones',
          subtitle: 'Planes guardados y presupuestos congelados',
          onPress: () => router.push('/events'),
        },
        {
          id: 'claims',
          icon: 'shield-checkmark-outline' as const,
          label: 'Mis Reclamos de Garantía',
          subtitle: 'Protección de pagos y garantía de cumplimiento',
          onPress: () => router.push('/claims'),
        },
        {
          id: 'chats',
          icon: 'chatbubbles-outline' as const,
          label: 'Mis Conversaciones',
          subtitle: 'Mensajería directa con proveedores',
          onPress: () => router.push('/chats'),
        },
      ];

  const handleSwitchToProvider = () => {
    switchRole('provider');
    router.replace('/provider-dashboard');
  };

  const handleSwitchToClient = () => {
    switchRole('client');
    router.replace('/');
  };

  const handleLogout = () => {
    switchRole('guest');
    router.replace('/');
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={Colors.slate50}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar
          source={currentUser.avatar}
          name={isGuest ? 'Invitado' : currentUser.name}
          size={76}
          verified={isProvider}
        />
        <Text style={styles.userName}>
          {isGuest ? 'Modo Invitado' : currentUser.name}
        </Text>
        <Text style={styles.userEmail}>
          {isGuest ? 'Explorando EventMarket' : currentUser.email}
        </Text>

        <View style={styles.roleBadge}>
          <Ionicons
            name={isProvider ? 'briefcase' : isGuest ? 'eye' : 'person'}
            size={12}
            color={Colors.primary}
          />
          <Text style={styles.roleBadgeText}>
            {isProvider
              ? 'Cuenta de Proveedor Verificado'
              : isGuest
              ? 'Visitante sin registrar'
              : 'Cuenta de Cliente • Organizador'}
          </Text>
        </View>

        {/* Panel Switcher Card: Permite cambiar de panel de forma natural */}
        {!isGuest && !isProvider && (
          <View style={styles.portalBanner}>
            <View style={styles.portalBannerLeft}>
              <View style={styles.portalIconBox}>
                <Ionicons name="briefcase-outline" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.portalTextBox}>
                <Text style={styles.portalTitle}>¿Ofreces servicios para eventos?</Text>
                <Text style={styles.portalSubtitle}>
                  Accede al panel para administrar servicios, solicitudes y cobros.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.portalActionBtn}
              onPress={handleSwitchToProvider}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Ir al Panel de Proveedor"
            >
              <Text style={styles.portalActionBtnText}>Panel Proveedor</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {isProvider && (
          <View style={styles.portalBanner}>
            <View style={styles.portalBannerLeft}>
              <View style={[styles.portalIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.portalTextBox}>
                <Text style={styles.portalTitle}>Vista de Cliente</Text>
                <Text style={styles.portalSubtitle}>
                  Explora paquetes y cotiza eventos como organizador.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.portalActionBtn, { backgroundColor: Colors.slate800 }]}
              onPress={handleSwitchToClient}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Ir al Panel de Cliente"
            >
              <Text style={styles.portalActionBtnText}>Modo Cliente</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {isGuest && (
          <View style={styles.portalBanner}>
            <View style={styles.portalBannerLeft}>
              <View style={[styles.portalIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="sparkles" size={20} color={Colors.success} />
              </View>
              <View style={styles.portalTextBox}>
                <Text style={styles.portalTitle}>Crea o Ingresa a tu Cuenta</Text>
                <Text style={styles.portalSubtitle}>
                  Guarda tus eventos o publica servicios profesionales.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.portalActionBtn, { backgroundColor: Colors.primary }]}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión o registrarse"
            >
              <Text style={styles.portalActionBtnText}>Iniciar Sesión</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionHeader}>GESTIÓN & ACCESOS RÁPIDOS</Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            style={styles.menuRow}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={20} color={Colors.primary} />
            </View>

            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={Colors.slate400} />
          </TouchableOpacity>
        ))}

        {/* Auth Links */}
        <Text style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
          CUENTA & SEGURIDAD
        </Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/auth/login')}
          accessibilityRole="button"
          accessibilityLabel="Iniciar sesión con otra cuenta"
        >
          <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="log-in-outline" size={20} color={Colors.slate700} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuLabel}>Iniciar Sesión</Text>
            <Text style={styles.menuSubtitle}>Cambiar de cuenta o rol</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.slate400} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/auth/register')}
          accessibilityRole="button"
          accessibilityLabel="Registrar nueva cuenta"
        >
          <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="person-add-outline" size={20} color={Colors.slate700} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuLabel}>Crear Cuenta</Text>
            <Text style={styles.menuSubtitle}>Registrar nuevo cliente o proveedor</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.slate400} />
        </TouchableOpacity>

        {!isGuest && (
          <View style={styles.logoutWrapper}>
            <AppButton
              title="Cerrar sesión"
              icon="log-out-outline"
              variant="ghost"
              onPress={handleLogout}
              textStyle={{ color: Colors.danger }}
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  header: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    lineHeight: Typography.lineHeights.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginTop: Spacing.sm,
  },
  userEmail: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
  portalBanner: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  portalBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  portalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  portalTextBox: {
    flex: 1,
  },
  portalTitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  portalSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  portalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  portalActionBtnText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  menuContainer: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  menuSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  logoutWrapper: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
});
