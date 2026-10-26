import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  EmptyState,
} from '../../components';
import { EventSummaryTab } from '../../components/event/EventSummaryTab';
import { EventServicesTab } from '../../components/event/EventServicesTab';
import { EventTimelineTab } from '../../components/event/EventTimelineTab';
import { EventPaymentsTab } from '../../components/event/EventPaymentsTab';
import { EventClaimsTab } from '../../components/event/EventClaimsTab';

type InternalTab = 'resumen' | 'servicios' | 'cronograma' | 'pagos' | 'reclamos';

const TABS: { key: InternalTab; label: (services: number, claims: number) => string }[] = [
  { key: 'resumen', label: () => 'Resumen' },
  { key: 'servicios', label: (services) => `Servicios (${services})` },
  { key: 'cronograma', label: () => 'Cronograma' },
  { key: 'pagos', label: () => 'Pagos' },
  { key: 'reclamos', label: (_, claims) => `Reclamos (${claims})` },
];

/** Controlador del detalle: navegación superior por pestañas internas.
    Cada pestaña vive en `src/components/event/` y solo se monta la activa,
    así cambiar de tab no mantiene las demás vistas en memoria. */
export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, claims } = useAppStore();

  const [activeTab, setActiveTab] = useState<InternalTab>('resumen');

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Evento no encontrado" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Evento no encontrado"
          description="El evento que buscas no existe o no tienes permiso para verlo."
          actionTitle="Volver a eventos"
          onActionPress={() => router.replace('/events')}
        />
      </ScreenContainer>
    );
  }

  const isContracted = event.status === 'confirmed' || event.status === 'in_progress';
  const eventClaims = claims.filter((c) => c.eventId === event.id);
  const contractedPrice = event.contractedPrice || event.quotedPrice;

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title={event.name}
        subtitle={event.typeName}
        showBack
        rightElement={
          <TouchableOpacity
            onPress={() => router.push('/chats')}
            accessibilityRole="button"
            accessibilityLabel="Ir a mis chats"
          >
            <Ionicons name="chatbubbles-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      {/* Internal Tabs Bar */}
      <View style={styles.tabsHeader}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            const label = t.label(event.services.length, eventClaims.length);
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(t.key)}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'resumen' && (
          <EventSummaryTab event={event} contractedPrice={contractedPrice} />
        )}
        {activeTab === 'servicios' && (
          <EventServicesTab event={event} isContracted={isContracted} />
        )}
        {activeTab === 'cronograma' && <EventTimelineTab event={event} />}
        {activeTab === 'pagos' && <EventPaymentsTab event={event} />}
        {activeTab === 'reclamos' && (
          <EventClaimsTab event={event} eventClaims={eventClaims} isContracted={isContracted} />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabsHeader: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.md,
  },
  tabItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: 44,
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
    fontWeight: Typography.weights.medium,
  },
  tabLabelActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
});
