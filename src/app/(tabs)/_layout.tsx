import React from 'react';
import { Pressable, Platform, type ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Typography } from '../../theme';
import {
  BOTTOM_TAB_BAR_HEIGHT,
  TAB_BAR_ICON_SIZE,
  TAB_BAR_PADDING_TOP,
  TAB_BAR_PADDING_BOTTOM,
} from '../../constants/layout';

type IonIconName = keyof typeof Ionicons.glyphMap;

/** Boton de tab personalizado que anula el efecto de circulo/ripple desbordado en Android. */
const TabBarButton = (props: any) => {
  return (
    <Pressable
      {...props}
      android_ripple={null}
      style={({ pressed }) => [
        props.style,
        { overflow: 'hidden' },
        pressed && { opacity: 0.65 },
      ]}
    />
  );
};

/** Icono solido cuando la pestana esta activa, delineado en reposo. */
function TabIcon({ active, inactive, color, focused }: {
  active: IonIconName;
  inactive: IonIconName;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? active : inactive}
      size={TAB_BAR_ICON_SIZE}
      color={typeof color === 'number' ? Colors.slate500 : color ?? Colors.slate500}
    />
  );
}

export default function TabsLayout() {
  const { currentUser, activeCart, providerRequests } = useAppStore();
  const insets = useSafeAreaInsets();
  const isProvider = currentUser.role === 'provider';

  const cartItemCount = activeCart.services.length;
  const pendingRequestsCount = providerRequests.filter((r) => r.status === 'pending').length;

  const bottomInset = insets.bottom > 0 ? insets.bottom : TAB_BAR_PADDING_BOTTOM;
  const tabBarHeight = BOTTOM_TAB_BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.slate500,
        tabBarButton: TabBarButton,
        tabBarItemStyle: {
          overflow: 'hidden',
        },
        // Etiquetas visibles estilo e-commerce (Mercado Libre):
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: Typography.sizes.xs,
          fontWeight: Typography.weights.semibold,
          marginTop: -2,
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
        // Barra fija de ancho completo estilo Mercado Libre:
        tabBarStyle: {
          height: tabBarHeight,
          paddingTop: TAB_BAR_PADDING_TOP,
          paddingBottom: bottomInset,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.slate200,
          borderRadius: 0,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      {/* ================= CLIENT TABS ================= */}
      {/* `href: null` oculta la pestaña a nivel de Router (no solo visual):
          no aparece en el tab bar ni es alcanzable por deep link de tabs. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          href: isProvider ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="home" inactive="home-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Categorías',
          tabBarLabel: 'Categorías',
          href: isProvider ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="grid" inactive="grid-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarLabel: 'Carrito',
          href: isProvider ? null : undefined,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.secondary,
            fontSize: Typography.sizes.xs,
          },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="cart" inactive="cart-outline" color={color} focused={focused} />
          ),
        }}
      />

      {/* ================= PROVIDER TABS ================= */}
      <Tabs.Screen
        name="provider-dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          href: !isProvider ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="stats-chart" inactive="stats-chart-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="provider-services"
        options={{
          title: 'Servicios',
          tabBarLabel: 'Servicios',
          href: !isProvider ? null : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="albums" inactive="albums-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="provider-requests"
        options={{
          title: 'Solicitudes',
          tabBarLabel: 'Solicitudes',
          href: !isProvider ? null : undefined,
          tabBarBadge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.accent,
            fontSize: Typography.sizes.xs,
          },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="mail-unread" inactive="mail-outline" color={color} focused={focused} />
          ),
        }}
      />

      {/* ================= SHARED TABS ================= */}
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Mensajes',
          tabBarLabel: 'Mensajes',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="chatbubbles" inactive="chatbubbles-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Más',
          tabBarLabel: 'Más',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon active="menu" inactive="menu-outline" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
