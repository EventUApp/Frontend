import React, { useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import { ScreenContainer, SectionHeader } from '../../components';
import { ProviderHeader } from '../../components/provider/ProviderHeader';
import { ProviderKpis } from '../../components/provider/ProviderKpis';
import { ProviderQuickActions } from '../../components/provider/ProviderQuickActions';
import { formatCurrency } from '../../utils/format';
import { useSimulatedRefresh } from '../../hooks/useSimulatedRefresh';

/** Layout del dashboard: RefreshControl + componentes de `components/provider/`. */
export default function ProviderDashboardScreen() {
  const { providerServices, providerRequests, claims, currentUser, updateRequestStatus } = useAppStore();
  const { refreshing, onRefresh } = useSimulatedRefresh();

  useEffect(() => {
    if (currentUser.role !== 'provider') {
      router.replace('/');
    }
  }, [currentUser.role]);

  const activeServicesCount = providerServices.filter((s) => s.available).length;
  const newRequestsCount = providerRequests.filter((r) => r.status === 'pending').length;
  const confirmedContracts = providerRequests.filter((r) => r.status === 'confirmed').length;
  const openClaimsCount = claims.filter((c) => c.status !== 'resolved' && c.status !== 'rejected').length;

  const mockRevenue = providerRequests
    .filter((r) => r.status === 'confirmed')
    .reduce((acc, curr) => acc + curr.price, 0);

  if (currentUser.role !== 'provider') {
    return null;
  }

  return (
    <ScreenContainer
      scrollable
      backgroundColor={Colors.slate50}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <ProviderHeader revenue={mockRevenue} />

      <View style={styles.content}>
        <ProviderKpis
          activeServices={activeServicesCount}
          newRequests={newRequestsCount}
          confirmedContracts={confirmedContracts}
          openClaims={openClaimsCount}
        />

        <ProviderQuickActions />

        {/* Recent Requests Section */}
        <SectionHeader
          title="Últimas Solicitudes"
          actionText="Ver todas"
          onActionPress={() => router.push('/provider-requests')}
        />

        {providerRequests.slice(0, 3).map((req) => (
          <View key={req.id} style={styles.requestMiniCard}>
            <View style={styles.reqHeader}>
              <Text style={styles.reqClient}>{req.clientName}</Text>
              <Text style={styles.reqPrice}>{formatCurrency(req.price)}</Text>
            </View>
            <Text style={styles.reqEvent}>
              {req.eventName} • {req.eventDate}
            </Text>
            <Text style={styles.reqService}>{req.serviceName}</Text>

            {req.status === 'pending' ? (
              <View style={styles.reqActionsRow}>
                <TouchableOpacity
                  style={[styles.reqBtn, styles.reqBtnAccept]}
                  onPress={() => updateRequestStatus(req.id, 'confirmed')}
                  accessibilityRole="button"
                  accessibilityLabel={`Aceptar solicitud de ${req.clientName}`}
                >
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                  <Text style={styles.reqBtnAcceptText}>Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.reqBtn, styles.reqBtnReject]}
                  onPress={() => updateRequestStatus(req.id, 'rejected')}
                  accessibilityRole="button"
                  accessibilityLabel={`Rechazar solicitud de ${req.clientName}`}
                >
                  <Ionicons name="close" size={14} color={Colors.slate600} />
                  <Text style={styles.reqBtnRejectText}>Rechazar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.reqBtn, styles.reqBtnDetails]}
                  onPress={() => router.push('/provider-requests')}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalle de ${req.clientName}`}
                >
                  <Text style={styles.reqBtnDetailsText}>Detalle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.statusRow}>
                <Text style={[
                  styles.statusLabel,
                  req.status === 'confirmed' ? styles.statusConfirmed : styles.statusRejected
                ]}>
                  {req.status === 'confirmed' ? '✓ Contrato Confirmado' : '✗ Solicitud Declinada'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  content: {
    padding: Spacing.lg,
  },
  requestMiniCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  reqClient: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  reqPrice: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  reqEvent: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: 2,
  },
  reqService: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginBottom: Spacing.xs,
  },
  reqActionsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  reqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
  },
  reqBtnAccept: {
    backgroundColor: Colors.success,
  },
  reqBtnAcceptText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginLeft: 3,
  },
  reqBtnReject: {
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.slate300,
  },
  reqBtnRejectText: {
    color: Colors.slate700,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    marginLeft: 2,
  },
  reqBtnDetails: {
    backgroundColor: Colors.primaryLight,
    marginLeft: 'auto',
  },
  reqBtnDetailsText: {
    color: Colors.primaryDark,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  statusRow: {
    marginTop: Spacing.xs,
  },
  statusLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  statusConfirmed: {
    color: Colors.success,
  },
  statusRejected: {
    color: Colors.danger,
  },
});
