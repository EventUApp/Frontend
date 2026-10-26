import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { StatusBadge } from '../ui/StatusBadge';
import { PriceTag } from '../ui/PriceTag';
import { AppButton } from '../ui/AppButton';
import { formatCurrency } from '../../utils/format';
import { AppEvent } from '../../types';

interface EventSummaryTabProps {
  event: AppEvent;
  contractedPrice: number;
}

/** Pestaña Resumen: estado general, balance y acceso al chat. */
export const EventSummaryTab: React.FC<EventSummaryTabProps> = ({ event, contractedPrice }) => {
  return (
    <View>
      {/* Status & Overview Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Estado General</Text>
          <StatusBadge status={event.status} type="event" />
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Fecha:</Text>
            <Text style={styles.metaVal}>{event.date}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Lugar:</Text>
            <Text style={styles.metaVal}>{event.location}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Invitados:</Text>
            <Text style={styles.metaVal}>~{event.guestCount}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Tipo:</Text>
            <Text style={styles.metaVal}>{event.typeName}</Text>
          </View>
        </View>
      </View>

      {/* Financial Overview Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Balance Financiero</Text>

        <View style={styles.financeRow}>
          <Text style={styles.financeLabel}>Precio Total Contratado:</Text>
          <PriceTag price={contractedPrice} size="lg" color={Colors.primaryDark} />
        </View>

        <View style={styles.financeRow}>
          <Text style={styles.financeLabel}>Anticipo Pagado:</Text>
          <Text style={[styles.financeAmount, { color: Colors.success }]}>
            {formatCurrency(event.depositPaid)}
          </Text>
        </View>

        <View style={[styles.financeRow, styles.balanceRow]}>
          <Text style={styles.balanceLabel}>Saldo Pendiente:</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(event.balanceDue)}</Text>
        </View>

        {event.balanceDue > 0 && (
          <AppButton
            title="Abonar al Saldo"
            icon="card-outline"
            size="sm"
            onPress={() => router.push(`/checkout/${event.id}`)}
            style={styles.balanceBtn}
          />
        )}
      </View>

      {/* Quick Chat Shortcut */}
      <TouchableOpacity
        style={styles.chatBanner}
        onPress={() => router.push('/chats')}
        accessibilityRole="button"
        accessibilityLabel="Abrir canal de mensajería con los proveedores"
      >
        <Ionicons name="chatbubbles" size={24} color={Colors.white} />
        <View style={styles.chatBannerInfo}>
          <Text style={styles.chatBannerTitle}>Canal de Mensajería</Text>
          <Text style={styles.chatBannerSubtitle}>
            Comunícate en directo con los proveedores contratados
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaCol: {
    width: '50%',
    marginBottom: Spacing.sm,
  },
  metaLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  metaVal: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate800,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  financeLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
  },
  financeAmount: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
    paddingTop: Spacing.sm,
    marginTop: 4,
  },
  balanceLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  balanceAmount: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.danger,
  },
  balanceBtn: {
    marginTop: Spacing.md,
  },
  chatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  chatBannerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  chatBannerTitle: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
  },
  chatBannerSubtitle: {
    color: '#E0E7FF',
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
});
