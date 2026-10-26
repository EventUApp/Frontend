import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import Animated from 'react-native-reanimated';
import { LayoutAnimation } from '../../constants/animations';
import { ScreenContainer, Avatar, AppButton } from '../../components';
import { formatCurrency } from '../../utils/format';
import { ProviderRequest } from '../../types';

export default function ProviderRequestsScreen() {
  const { providerRequests, updateRequestStatus, currentUser } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  useEffect(() => {
    if (currentUser.role !== 'provider') {
      router.replace('/');
    }
  }, [currentUser.role]);

  const filtered = providerRequests.filter((r) => {
    if (filterStatus === 'todos') return true;
    return r.status === filterStatus;
  });

  const getStatusBadge = (status: ProviderRequest['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', bg: '#FEF3C7', text: '#B45309' };
      case 'accepted':
        return { label: 'Aceptada', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'confirmed':
        return { label: 'Confirmada / Pagada', bg: '#D1FAE5', text: '#047857' };
      case 'rejected':
        return { label: 'Rechazada', bg: '#FEE2E2', text: '#B91C1C' };
    }
  };

  const renderRequestItem = ({ item }: { item: ProviderRequest }) => {
    const badge = getStatusBadge(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.clientRow}>
            <Avatar source={item.clientAvatar} name={item.clientName} size={40} />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{item.clientName}</Text>
              <Text style={styles.eventText}>🎉 {item.eventName}</Text>
            </View>
          </View>

          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Servicio:</Text>
            <Text style={styles.detailValue}>{item.serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha del evento:</Text>
            <Text style={styles.detailValue}>{item.eventDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monto de cotización:</Text>
            <Text style={styles.priceValue}>{formatCurrency(item.price)}</Text>
          </View>
          {item.notes ? (
            <View style={styles.notesBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={13} color={Colors.slate500} />
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons for Pending or Accepted */}
        {item.status === 'pending' && (
          <View style={styles.actionsRow}>
            <AppButton
              title="Aceptar"
              size="sm"
              variant="primary"
              onPress={() => updateRequestStatus(item.id, 'accepted')}
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
            <AppButton
              title="Rechazar"
              size="sm"
              variant="ghost"
              onPress={() => updateRequestStatus(item.id, 'rejected')}
              textStyle={{ color: Colors.danger }}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {item.status === 'accepted' && (
          <View style={styles.actionsRow}>
            <AppButton
              title="Marcar como Confirmado"
              size="sm"
              variant="success"
              onPress={() => updateRequestStatus(item.id, 'confirmed')}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    );
  };

  if (currentUser.role !== 'provider') {
    return null;
  }

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitudes de Clientes</Text>
        <Text style={styles.headerSubtitle}>
          Recibe y gestiona órdenes para tus servicios
        </Text>

        {/* Status Filters */}
        <View style={styles.filterBar}>
          {(['todos', 'pending', 'accepted', 'confirmed', 'rejected'] as const).map((st) => (
            <TouchableOpacity
              key={st}
              style={[
                styles.filterChip,
                filterStatus === st && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus(st)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterStatus === st && styles.filterTextActive,
                ]}
              >
                {st === 'todos'
                  ? 'Todas'
                  : st === 'pending'
                  ? 'Pendientes'
                  : st === 'accepted'
                  ? 'Aceptadas'
                  : st === 'confirmed'
                  ? 'Confirmadas'
                  : 'Rechazadas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.FlatList
        itemLayoutAnimation={LayoutAnimation}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.list}
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
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.slate100,
    marginRight: Spacing.xs,
    marginBottom: 4,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  clientName: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  eventText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  detailsBox: {
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  detailValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate800,
  },
  priceValue: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  notesText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginLeft: 4,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
});
