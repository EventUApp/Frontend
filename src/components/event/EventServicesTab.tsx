import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { formatCurrency } from '../../utils/format';
import { AppEvent } from '../../types';

interface EventServicesTabProps {
  event: AppEvent;
  isContracted: boolean;
}

/** Pestaña Servicios: proveedores asignados con chat y reclamos. */
export const EventServicesTab: React.FC<EventServicesTabProps> = ({ event, isContracted }) => {
  return (
    <View>
      <Text style={styles.heading}>Proveedores y Servicios Asignados</Text>

      {event.services.map((item, idx) => (
        <View key={item.id || idx} style={styles.card}>
          <View style={styles.serviceHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.categoryName}</Text>
            </View>
            <Text style={styles.serviceSubtotal}>
              {formatCurrency(item.subtotal)}
            </Text>
          </View>

          <Text style={styles.serviceName}>{item.serviceName}</Text>

          <View style={styles.providerRow}>
            <Avatar source={item.providerAvatar} name={item.providerName} size={32} />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{item.providerName}</Text>
              <Text style={styles.providerUnit}>
                Cant: {item.quantity} • {formatCurrency(item.unitPrice)} c/u
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push(`/chats`)}
              accessibilityRole="button"
              accessibilityLabel={`Chatear con ${item.providerName}`}
            >
              <Ionicons name="chatbubble-outline" size={14} color={Colors.primary} />
              <Text style={styles.actionBtnText}>Chat Proveedor</Text>
            </TouchableOpacity>

            {isContracted && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  router.push(
                    `/claims/create?eventId=${event.id}&serviceId=${item.serviceId}&providerId=${item.providerId}`
                  )
                }
                accessibilityRole="button"
                accessibilityLabel={`Radicar reclamo sobre ${item.serviceName}`}
              >
                <Ionicons name="alert-circle-outline" size={14} color={Colors.danger} />
                <Text style={[styles.actionBtnText, { color: Colors.danger }]}>
                  Radicar Reclamo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 4,
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
  },
  serviceSubtotal: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  serviceName: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.xs,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  providerInfo: {
    marginLeft: Spacing.sm,
  },
  providerName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate700,
  },
  providerUnit: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.slate100,
    marginLeft: Spacing.sm,
    minHeight: 44,
  },
  actionBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginLeft: 4,
  },
});
