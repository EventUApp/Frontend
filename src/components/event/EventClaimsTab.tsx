import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { StatusBadge } from '../ui/StatusBadge';
import { AppButton } from '../ui/AppButton';
import { AppEvent, Claim } from '../../types';

interface EventClaimsTabProps {
  event: AppEvent;
  eventClaims: Claim[];
  isContracted: boolean;
}

/** Pestaña Reclamos: radicados del evento o estado vacío. */
export const EventClaimsTab: React.FC<EventClaimsTabProps> = ({
  event,
  eventClaims,
  isContracted,
}) => {
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Reclamos del Evento</Text>
        {isContracted && (
          <AppButton
            title="+ Radicar Reclamo"
            size="sm"
            variant="outline"
            onPress={() => router.push(`/claims/create?eventId=${event.id}`)}
          />
        )}
      </View>

      {eventClaims.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="shield-checkmark-outline" size={40} color={Colors.success} />
          <Text style={styles.emptyTitle}>Sin Reclamos Registrados</Text>
          <Text style={styles.emptyText}>
            Todos los servicios contratados se encuentran en orden. Si detectas algún incumplimiento, puedes radicar un reclamo con respaldo de la plataforma.
          </Text>
        </View>
      ) : (
        eventClaims.map((claim) => (
          <TouchableOpacity
            key={claim.id}
            style={styles.card}
            onPress={() => router.push(`/claims/${claim.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Reclamo sobre ${claim.serviceName}: ${claim.reason}`}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.claimService}>{claim.serviceName}</Text>
              <StatusBadge status={claim.status} type="claim" />
            </View>
            <Text style={styles.claimReason}>{claim.reason}</Text>
            <Text style={styles.claimDesc} numberOfLines={2}>
              {claim.description}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginVertical: 4,
  },
  emptyText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    lineHeight: 18,
  },
  claimService: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  claimReason: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginVertical: 2,
  },
  claimDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    lineHeight: 18,
  },
});
