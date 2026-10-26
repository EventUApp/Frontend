import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SectionHeader } from '../ui/SectionHeader';

export const ProviderQuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Nuevo Servicio',
      icon: 'add-circle-outline' as const,
      route: '/provider-portal/service-edit',
      color: Colors.primary,
      bg: Colors.primaryLight,
    },
    {
      title: 'Precios',
      icon: 'pricetag-outline' as const,
      route: '/provider-portal/update-price',
      color: Colors.accent,
      bg: '#FEF3C7',
    },
    {
      title: 'Solicitudes',
      icon: 'mail-outline' as const,
      route: '/provider-requests',
      color: Colors.secondary,
      bg: '#E0E7FF', // subtle secondary light
    },
    {
      title: 'Reclamos',
      icon: 'alert-circle-outline' as const,
      route: '/claims',
      color: Colors.danger,
      bg: '#FEF2F2',
    },
  ];

  return (
    <View style={styles.container}>
      <SectionHeader title="Acceso Rápido" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.actionSquare}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={action.title}
          >
            <View style={[styles.iconBox, { backgroundColor: action.bg }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing.xs,
  },
  actionSquare: {
    width: 80,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
});
