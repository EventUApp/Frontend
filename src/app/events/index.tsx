import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import Animated from 'react-native-reanimated';
import { LayoutAnimation } from '../../constants/animations';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import { ScreenContainer, AppHeader, EventCard, EmptyState, AppButton } from '../../components';
import { AppEvent, EventStatus } from '../../types';
import { formatCurrency, formatShortDate } from '../../utils/format';

type EventFilter = EventStatus | 'todos';

const ACTIVE_STATUSES: EventStatus[] = ['quoted', 'confirmed', 'in_progress'];

const FILTER_TABS: { key: EventFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'draft', label: 'Borradores' },
  { key: 'quoted', label: 'Cotizados' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'in_progress', label: 'En ejecución' },
  { key: 'completed', label: 'Finalizados' },
];

interface EmptyConfig {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle: string;
}

const EMPTY_STATES: Record<EventFilter, EmptyConfig> = {
  todos: {
    icon: 'calendar-outline',
    title: 'Aún no tienes eventos',
    description: 'Crea tu primer evento y organiza todo en minutos.',
    actionTitle: '+ Crear Evento',
  },
  draft: {
    icon: 'create-outline',
    title: 'Sin borradores',
    description: 'No tienes eventos en borrador. ¿Quieres crear uno nuevo?',
    actionTitle: '+ Crear Evento',
  },
  quoted: {
    icon: 'receipt-outline',
    title: 'Sin cotizaciones por revisar',
    description: 'Cuando pidas una cotización aparecerá aquí con tarifa protegida.',
    actionTitle: '+ Crear Evento',
  },
  confirmed: {
    icon: 'checkmark-circle-outline',
    title: 'Sin eventos confirmados',
    description: 'Confirma una cotización para ver tu hoja de ruta aquí.',
    actionTitle: '+ Crear Evento',
  },
  in_progress: {
    icon: 'sync-outline',
    title: 'Sin eventos en ejecución',
    description: 'Tus eventos activos aparecerán aquí el día de la celebración.',
    actionTitle: '+ Crear Evento',
  },
  completed: {
    icon: 'trophy-outline',
    title: 'Sin eventos finalizados',
    description: 'Tu historial y garantías aparecerán aquí al cerrar un evento.',
    actionTitle: '+ Crear Evento',
  },
  cancelled: {
    icon: 'ban-outline',
    title: 'Sin eventos cancelados',
    description: 'No hay eventos cancelados por mostrar.',
    actionTitle: '+ Crear Evento',
  },
};

function handleCardPress(item: AppEvent) {
  if (item.status === 'draft') {
    router.push('/cart');
  } else if (item.status === 'quoted') {
    router.push(`/quote/${item.id}`);
  } else {
    router.push(`/event/${item.id}`);
  }
}

function handlePrimaryAction(item: AppEvent) {
  switch (item.status) {
    case 'draft':
      router.push('/cart');
      break;
    case 'quoted':
      router.push(`/quote/${item.id}`);
      break;
    case 'confirmed':
      router.push(`/event/${item.id}`);
      break;
    case 'in_progress':
      router.push('/chats');
      break;
    default:
      router.push(`/event/${item.id}`);
      break;
  }
}

export default function MyEventsScreen() {
  const { events } = useAppStore();
  const [filter, setFilter] = useState<EventFilter>('todos');
  const counts = useMemo(() => {
    const next: Record<EventFilter, number> = {
      todos: events.length,
      draft: 0,
      quoted: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const event of events) {
      next[event.status] += 1;
    }
    return next;
  }, [events]);
  const filtered = useMemo(() => {
    if (filter === 'todos') {
      return events;
    }
    return events.filter((e) => e.status === filter);
  }, [events, filter]);
  const kpi = useMemo(() => {
    const active = events.filter((e) => ACTIVE_STATUSES.includes(e.status));
    const upcoming = active
      .map((e) => e.date)
      .filter(Boolean)
      .sort();
    const pendingBalance = active.reduce((sum, e) => sum + e.balanceDue, 0);
    return {
      activeCount: active.length,
      nextDate: upcoming.length > 0 ? upcoming[0] : '',
      pendingBalance,
    };
  }, [events]);
  const empty = EMPTY_STATES[filter];

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title="Mis Eventos"
        subtitle="Administra tus borradores, cotizaciones y eventos contratados"
        showBack
        rightElement={
          <AppButton
            title="+ Nuevo"
            size="sm"
            onPress={() => router.push('/create-event')}
          />
        }
      />

      {/* Resumen ejecutivo: activos, proxima fecha y saldo por liquidar */}
      <View
        accessible
        accessibilityLabel={`Resumen: ${kpi.activeCount} eventos activos. Próxima fecha ${formatShortDate(kpi.nextDate)}. Saldo pendiente ${formatCurrency(kpi.pendingBalance)}`}
        style={styles.kpiBar}
      >
        <View style={styles.kpiItem}>
          <Ionicons name="layers-outline" size={16} color={Colors.primary} />
          <Text style={styles.kpiValue} numberOfLines={1}>
            {kpi.activeCount}
          </Text>
          <Text style={styles.kpiLabel}>Activos</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.kpiValue} numberOfLines={1}>
            {kpi.nextDate ? formatShortDate(kpi.nextDate) : '—'}
          </Text>
          <Text style={styles.kpiLabel}>Próxima fecha</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiItem}>
          <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
          <Text style={styles.kpiValue} numberOfLines={1}>
            {formatCurrency(kpi.pendingBalance)}
          </Text>
          <Text style={styles.kpiLabel}>Saldo pendiente</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <Animated.FlatList
          itemLayoutAnimation={LayoutAnimation}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TABS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filter === item.key && styles.filterChipActive,
                counts[item.key] === 0 && styles.filterChipEmpty,
              ]}
              onPress={() => setFilter(item.key)}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por ${item.label}, ${counts[item.key]} eventos`}
              accessibilityState={{ selected: filter === item.key }}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label} ({counts[item.key]})
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: Spacing.md }}
        />
      </View>

      {/* Events List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => handleCardPress(item)}
            onPrimaryAction={() => handlePrimaryAction(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            description={empty.description}
            actionTitle={empty.actionTitle}
            onActionPress={() => router.push('/create-event')}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  kpiBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginTop: 2,
  },
  kpiLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  kpiDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.slate200,
    marginHorizontal: Spacing.xs,
  },
  filterBar: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.slate100,
    marginRight: Spacing.xs,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipEmpty: {
    opacity: 0.55,
  },
  filterText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.slate600,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
});
