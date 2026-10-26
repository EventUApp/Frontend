import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import Animated from 'react-native-reanimated';
import { LayoutAnimation } from '../../constants/animations';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import { ScreenContainer, AppHeader, StatusBadge, EmptyState, AppButton } from '../../components';
import { Claim, ClaimStatus } from '../../types';

type ClaimFilter = ClaimStatus | 'todos';

const FILTERS: { key: ClaimFilter; label: string; dotColor: string }[] = [
  { key: 'todos', label: 'Todos', dotColor: Colors.slate400 },
  { key: 'open', label: 'Abiertos', dotColor: Colors.warning },
  { key: 'awaiting_provider', label: 'Esperando prov.', dotColor: Colors.secondary },
  { key: 'in_review', label: 'En revisión', dotColor: Colors.info },
  { key: 'resolved', label: 'Resueltos', dotColor: Colors.success },
];

/** Tiempo transcurrido compacto: hoy, ayer, hace N días. */
function timeAgo(isoDate: string): string {
  const elapsed = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(elapsed / 86400000);
  if (Number.isNaN(days)) {
    return isoDate;
  }
  if (days <= 0) {
    return 'hoy';
  }
  if (days === 1) {
    return 'ayer';
  }
  if (days < 30) {
    return `hace ${days} días`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
}

export default function ClaimsListScreen() {
  const { claims, currentUser } = useAppStore();
  const [filter, setFilter] = useState<ClaimFilter>('todos');

  const isProvider = currentUser.role === 'provider';

  const counts = useMemo(() => {
    const next: Record<ClaimFilter, number> = {
      todos: claims.length,
      open: 0,
      in_review: 0,
      awaiting_provider: 0,
      awaiting_client: 0,
      resolved: 0,
      rejected: 0,
    };
    for (const claim of claims) {
      next[claim.status] += 1;
    }
    return next;
  }, [claims]);
  const filteredClaims = useMemo(() => {
    if (filter === 'todos') {
      return claims;
    }
    return claims.filter((c) => c.status === filter);
  }, [claims, filter]);

  const renderClaim = ({ item }: { item: Claim }) => {
    const counterpart = isProvider ? item.clientName : item.providerName;
    const counterpartRole = isProvider ? 'Cliente' : 'Proveedor';
    const goToMediation = () => router.push(`/claims/${item.id}`);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={goToMediation}
          accessibilityRole="button"
          accessibilityLabel={`Reclamo ${item.id.toUpperCase()} de ${item.serviceName}, estado ${item.status}`}
          accessibilityHint={`${item.responses.length} respuestas de mediación`}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.caseCode}>#{item.id.toUpperCase()}</Text>
            <StatusBadge status={item.status} type="claim" />
          </View>
          <Text style={styles.elapsedText}>Radicado {timeAgo(item.createdAt)}</Text>

          <View style={styles.serviceRow}>
            <Ionicons name="briefcase-outline" size={14} color={Colors.primary} />
            <Text style={styles.serviceName} numberOfLines={1}>
              {item.serviceName}
            </Text>
          </View>
          <Text style={styles.providerName} numberOfLines={1}>
            {counterpartRole}: {counterpart}
          </Text>

          <Text style={styles.eventNameText} numberOfLines={1}>
            🎉 {item.eventName}
          </Text>
          <Text style={styles.reasonText}>{item.reason}</Text>
          <Text style={styles.descText} numberOfLines={2}>
            {item.description}
          </Text>
        </TouchableOpacity>

        <View style={styles.cardFooter}>
          <View style={styles.responsesBadge}>
            <Text style={styles.responsesEmoji} accessibilityElementsHidden>
              💬
            </Text>
            <Text style={styles.responsesCount}>
              {item.responses.length} respuestas
            </Text>
          </View>
          <AppButton
            title="Ver Mediación"
            icon="arrow-forward"
            iconPosition="right"
            size="sm"
            variant="primary"
            onPress={goToMediation}
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title={isProvider ? 'Gestión de Reclamos' : 'Mis Reclamos y Garantías'}
        subtitle={
          isProvider
            ? 'Incidencias reportadas por clientes y mediación'
            : 'Protección de pagos Escrow y garantía de cumplimiento'
        }
        showBack
        rightElement={
          isProvider ? undefined : (
            <AppButton
              title="+ Radicar Reclamo"
              size="sm"
              variant="primary"
              onPress={() => router.push('/claims/create')}
            />
          )
        }
      />

      {/* Banner de confianza: fondos custodiados hasta la conformidad. */}
      <View
        style={styles.escrowBanner}
        accessibilityRole="summary"
        accessibilityLabel="Garantía de Cumplimiento y Pagos Protegidos. Los fondos de tus contratos están custodiados hasta la conformidad del servicio."
      >
        <View style={styles.escrowIconBox}>
          <Ionicons name="shield-checkmark" size={22} color={Colors.successText} />
        </View>
        <View style={styles.escrowTexts}>
          <Text style={styles.escrowTitle}>
            Garantía de Cumplimiento & Pagos Protegidos
          </Text>
          <Text style={styles.escrowSubtitle}>
            Los fondos de tus contratos están custodiados hasta la conformidad del servicio.
          </Text>
        </View>
      </View>

      {/* Filter Tabs con scroll: 5 estados + conteos, sin aplastar. */}
      <View style={styles.filtersBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((st) => (
            <TouchableOpacity
              key={st.key}
              style={[
                styles.filterChip,
                filter === st.key && styles.filterChipActive,
                counts[st.key] === 0 && styles.filterChipEmpty,
              ]}
              onPress={() => setFilter(st.key)}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar reclamos por ${st.label}, ${counts[st.key]} casos`}
              accessibilityState={{ selected: filter === st.key }}
            >
              <View
                style={[styles.statusDot, { backgroundColor: st.dotColor }]}
                accessibilityElementsHidden
              />
              <Text style={[styles.filterText, filter === st.key && styles.filterTextActive]}>
                {st.label} ({counts[st.key]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Animated.FlatList
        itemLayoutAnimation={LayoutAnimation}
        data={filteredClaims}
        keyExtractor={(item) => item.id}
        renderItem={renderClaim}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="shield-checkmark-outline"
            title="Sin reclamos en esta categoría"
            description="Todos tus servicios contratados se encuentran en perfecto estado."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  escrowIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  escrowTexts: {
    flex: 1,
  },
  escrowTitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.successText,
  },
  escrowSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginTop: 2,
  },
  filtersBar: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
    marginTop: Spacing.md,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  filterText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: Typography.weights.medium,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseCode: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  elapsedText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginLeft: 4,
    flex: 1,
  },
  providerName: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  eventNameText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.medium,
    marginVertical: 2,
  },
  reasonText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginVertical: 4,
  },
  descText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    lineHeight: Typography.lineHeights.xs,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
  },
  responsesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responsesEmoji: {
    fontSize: Typography.sizes.sm,
  },
  responsesCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    marginLeft: 4,
    fontWeight: Typography.weights.semibold,
  },
});
