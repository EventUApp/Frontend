import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { BottomEnter } from '../../constants/animations';
import { useAppStore } from '../../store/useAppStore';
import {
  mockCategories,
  mockProviders,
  mockPlans,
} from '../../mocks';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { BOTTOM_TAB_BAR_HEIGHT } from '../../constants/layout';
import {
  ScreenContainer,
  SearchBar,
  CategoryChip,
  EmptyState,
} from '../../components';
import { Service } from '../../types';
import {
  useDebouncedValue,
  normalizeSearchText,
} from '../../hooks/useDebouncedValue';
import { useSimulatedRefresh } from '../../hooks/useSimulatedRefresh';
import { ServicesList } from '../../components/explore/ServicesList';
import { ProvidersList } from '../../components/explore/ProvidersList';
import { PlansList } from '../../components/explore/PlansList';
import { CompareModal } from '../../components/explore/CompareModal';

type ExploreTab = 'services' | 'providers' | 'plans';

const TAB_META: { id: ExploreTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'services', label: 'Servicios', icon: 'sparkles-outline' },
  { id: 'providers', label: 'Proveedores', icon: 'business-outline' },
  { id: 'plans', label: 'Planes', icon: 'albums-outline' },
];

/** Controlador: tab activo, búsqueda con debounce y comparativa.
    Listas y modal viven en `src/components/explore/`. */
export default function ExploreScreen() {
  const { activeCart, addServiceToCart, clonePlanToCart, providerServices } = useAppStore();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<ExploreTab>('services');
  const [selectedCat, setSelectedCat] = useState<string>('todos');
  const [compareItems, setCompareItems] = useState<Service[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const listRef = useRef<FlatList>(null);
  const { refreshing, onRefresh } = useSimulatedRefresh();

  // El filtrado corre sobre el valor con debounce (300ms): escribir rápido
  // no dispara un filtrado por cada pulsación.
  const debouncedSearch = useDebouncedValue(search, 300);
  const normalizedQuery = useMemo(
    () => normalizeSearchText(debouncedSearch),
    [debouncedSearch]
  );

  const matchesQuery = (haystack: string) =>
    normalizedQuery === '' ||
    normalizeSearchText(haystack).includes(normalizedQuery);

  const filteredServices = useMemo(() => {
    return providerServices.filter((s) => {
      const matchCat = selectedCat === 'todos' || s.category === selectedCat;
      const matchSearch = matchesQuery(`${s.name} ${s.providerName} ${s.categoryName}`);
      return matchCat && matchSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery, selectedCat, providerServices]);

  const filteredProviders = useMemo(() => {
    return mockProviders.filter((p) => {
      return matchesQuery(`${p.name} ${p.category} ${p.location}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery]);

  const filteredPlans = useMemo(() => {
    return mockPlans.filter((p) => {
      return matchesQuery(`${p.name} ${p.description}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery]);

  const counts: Record<ExploreTab, number> = {
    services: filteredServices.length,
    providers: filteredProviders.length,
    plans: filteredPlans.length,
  };

  const cartServiceIds = useMemo(
    () => activeCart.services.map((s) => s.serviceId),
    [activeCart.services]
  );
  const compareIds = useMemo(() => compareItems.map((s) => s.id), [compareItems]);

  const handleTabChange = (next: ExploreTab) => {
    if (next === tab) return;
    setTab(next);
    // Cada pestaña es una lista distinta: volver arriba evita aparecer
    // a mitad de la nueva lista por el scroll heredado.
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const clearSearch = () => {
    setSearch('');
    setSelectedCat('todos');
  };

  const hasActiveSearch = search.trim() !== '' || selectedCat !== 'todos';

  const toggleCompare = (service: Service) => {
    if (compareItems.some((s) => s.id === service.id)) {
      setCompareItems(compareItems.filter((s) => s.id !== service.id));
    } else {
      // Solo al añadir: confirmación física sutil de la selección.
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (compareItems.length >= 2) {
        setCompareItems([compareItems[1], service]);
      } else {
        setCompareItems([...compareItems, service]);
      }
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
    setCompareModalVisible(false);
  };

  const handleChooseService = (service: Service) => {
    addServiceToCart(service, 1);
    setCompareModalVisible(false);
    router.push('/cart');
  };

  // La barra flotante vive directamente encima del tab bar fijo.
  const floatingBarBottom = Spacing.sm;

  // Un solo elemento compartido: solo una de las tres listas está montada.
  const listRefreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[Colors.primary]}
        tintColor={Colors.primary}
      />
    ),
    [refreshing, onRefresh]
  );

  const renderEmptyState = () => {
    if (tab === 'services') {
      return (
        <EmptyState
          icon="search-outline"
          title="Sin resultados"
          description="No encontramos servicios con ese criterio de búsqueda o categoría."
          actionTitle={hasActiveSearch ? 'Limpiar búsqueda' : undefined}
          onActionPress={hasActiveSearch ? clearSearch : undefined}
        />
      );
    }
    if (tab === 'providers') {
      return (
        <EmptyState
          icon="business-outline"
          title="Sin proveedores"
          description="No se encontraron proveedores que coincidan con la búsqueda."
          actionTitle={hasActiveSearch ? 'Limpiar búsqueda' : undefined}
          onActionPress={hasActiveSearch ? clearSearch : undefined}
        />
      );
    }
    return (
      <EmptyState
        icon="albums-outline"
        title="Sin planes"
        description="No se encontraron paquetes con ese criterio."
        actionTitle={hasActiveSearch ? 'Limpiar búsqueda' : undefined}
        onActionPress={hasActiveSearch ? clearSearch : undefined}
      />
    );
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Marketplace</Text>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar servicios, proveedores o planes..."
        />

        {/* Tab Switcher */}
        <View
          style={styles.tabsRow}
          accessibilityRole="tablist"
          accessibilityLabel="Categorías del marketplace"
        >
          {TAB_META.map((t) => {
            const isActive = tab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => handleTabChange(t.id)}
                accessibilityRole="tab"
                accessibilityLabel={`${t.label}, ${counts[t.id]} resultados`}
                accessibilityState={{ selected: isActive }}
                accessibilityHint={isActive ? 'Pestaña activa' : `Ver ${t.label.toLowerCase()}`}
              >
                <Ionicons
                  name={t.icon}
                  size={15}
                  color={isActive ? Colors.white : Colors.slate600}
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {t.label} ({counts[t.id]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Categories Bar (when in services tab) */}
        {tab === 'services' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsList}
          >
            <CategoryChip
              label="Todos"
              icon="apps-outline"
              badgeCount={providerServices.length}
              selected={selectedCat === 'todos'}
              onPress={() => setSelectedCat('todos')}
            />
            {mockCategories.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.name}
                icon={c.icon as keyof typeof Ionicons.glyphMap}
                badgeCount={c.count}
                selected={selectedCat === c.id}
                onPress={() => setSelectedCat(c.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {tab === 'services' && (
        <ServicesList
          services={filteredServices}
          cartServiceIds={cartServiceIds}
          compareIds={compareIds}
          extraBottomPadding={compareItems.length > 0}
          refreshControl={listRefreshControl}
          listRef={listRef}
          onServicePress={(s) => router.push(`/service/${s.id}`)}
          onAddToCart={(s) => addServiceToCart(s, 1)}
          onToggleCompare={toggleCompare}
          renderEmpty={renderEmptyState}
        />
      )}

      {tab === 'providers' && (
        <ProvidersList
          providers={filteredProviders}
          refreshControl={listRefreshControl}
          listRef={listRef}
          onProviderPress={(p) => router.push(`/provider/${p.id}`)}
          renderEmpty={renderEmptyState}
        />
      )}

      {tab === 'plans' && (
        <PlansList
          plans={filteredPlans}
          refreshControl={listRefreshControl}
          listRef={listRef}
          onPlanPress={(p) => router.push(`/plan/${p.id}`)}
          onUsePlan={(p) => {
            clonePlanToCart(p);
            router.push('/cart');
          }}
          renderEmpty={renderEmptyState}
        />
      )}

      {/* Floating Compare Bar: entra deslizándose desde abajo. */}
      {compareItems.length > 0 && (
        <Animated.View
          entering={BottomEnter}
          style={[styles.floatingCompareBar, { bottom: floatingBarBottom }]}
        >
          <View style={styles.compareCountBox}>
            <Ionicons name="git-compare-outline" size={18} color={Colors.white} />
            <Text style={styles.compareCountText} numberOfLines={1}>
              {compareItems.length} {compareItems.length === 1 ? 'servicio' : 'servicios'} para comparar
            </Text>
          </View>
          <View style={styles.compareActions}>
            <TouchableOpacity
              style={styles.clearCompareBtn}
              onPress={clearCompare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Limpiar comparativa"
              accessibilityHint="Quita todos los servicios seleccionados para comparar"
            >
              <Ionicons name="trash-outline" size={16} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.openCompareBtn}
              onPress={() => setCompareModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`Ver comparativa de ${compareItems.length} servicios`}
            >
              <Text style={styles.openCompareBtnText}>Ver comparativa</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <CompareModal
        visible={compareModalVisible}
        items={compareItems}
        onClose={() => setCompareModalVisible(false)}
        onClear={clearCompare}
        onToggleItem={toggleCompare}
        onChoose={handleChooseService}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.slate100,
    padding: 3,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: BorderRadius.sm,
    minHeight: 44,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: Typography.weights.medium,
    marginLeft: 4,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  categoryChipsList: {
    paddingVertical: Spacing.xs,
  },
  floatingCompareBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: Colors.slate900,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    elevation: 8,
  },
  compareCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  compareCountText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    marginLeft: 6,
    flexShrink: 1,
  },
  compareActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearCompareBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  openCompareBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    minHeight: 44,
    justifyContent: 'center',
  },
  openCompareBtnText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
