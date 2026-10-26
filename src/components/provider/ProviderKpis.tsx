import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { stagger } from '../../constants/animations';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';

interface ProviderKpisProps {
  activeServices: number;
  newRequests: number;
  confirmedContracts: number;
  openClaims: number;
}

interface KpiDef {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
  route: string;
  accessibilityLabel: string;
}

export const ProviderKpis: React.FC<ProviderKpisProps> = ({
  activeServices,
  newRequests,
  confirmedContracts,
  openClaims,
}) => {
  const kpis: KpiDef[] = [
    {
      icon: 'mail-unread',
      iconBg: '#FEF3C7',
      iconColor: Colors.accent,
      value: newRequests,
      label: 'Nuevas\nSolicitudes',
      route: '/provider-requests',
      accessibilityLabel: `Solicitudes nuevas: ${newRequests}. Ver solicitudes`,
    },
    {
      icon: 'checkmark-done-circle',
      iconBg: '#ECFDF5',
      iconColor: Colors.success,
      value: confirmedContracts,
      label: 'Eventos\nContratados',
      route: '/provider-requests',
      accessibilityLabel: `Eventos contratados: ${confirmedContracts}. Ver solicitudes`,
    },
    {
      icon: 'albums',
      iconBg: '#EEF2FF',
      iconColor: Colors.primary,
      value: activeServices,
      label: 'Servicios\nActivos',
      route: '/provider-services',
      accessibilityLabel: `Servicios activos: ${activeServices}. Ver mis servicios`,
    },
    {
      icon: 'alert-circle',
      iconBg: '#FEF2F2',
      iconColor: Colors.danger,
      value: openClaims,
      label: 'Reclamos\nAbiertos',
      route: '/claims',
      accessibilityLabel: `Reclamos abiertos: ${openClaims}. Ver reclamos`,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MÉTRICAS CLAVE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {kpis.map((kpi, index) => (
          <Animated.View key={kpi.label} entering={stagger(index)}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(kpi.route as any)}
              accessibilityRole="button"
              accessibilityLabel={kpi.accessibilityLabel}
            >
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: kpi.iconBg }]}>
                  <Ionicons name={kpi.icon} size={18} color={kpi.iconColor} />
                </View>
                <Text style={styles.value}>{kpi.value}</Text>
              </View>
              <Text style={styles.label}>{kpi.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate500,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  scrollContainer: {
    paddingBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginRight: Spacing.sm,
    width: 140,
    ...Shadows.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
  },
  label: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: Typography.weights.medium,
  },
});
