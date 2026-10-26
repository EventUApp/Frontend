import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { mockPlans } from '../../mocks';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  PriceTag,
  Rating,
  AppButton,
  EmptyState,
} from '../../components';
import { formatCurrency } from '../../utils/format';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { clonePlanToCart } = useAppStore();

  const plan = mockPlans.find((p) => p.id === id);

  if (!plan) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Plan no encontrado" showBack />
        <EmptyState
            icon="alert-circle-outline"
            title="Plan no encontrado"
            description="El plan que buscas no existe o no está disponible."
            actionTitle="Volver al inicio"
            onActionPress={() => router.replace('/')}
          />
        </ScreenContainer>
      );
      }
  const handleUsePlan = () => {
      clonePlanToCart(plan);
      router.push('/cart');
    };

    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader
          title={plan.name}
          subtitle={plan.eventTypeName}
          showBack
          rightElement={
            <TouchableOpacity onPress={handleUsePlan}>
              <Ionicons name="copy-outline" size={22} color={Colors.primary} />
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Plan Hero Cover */}
          <View style={styles.imageBox}>
            <Image source={{ uri: plan.image }} style={styles.image} contentFit="cover" />
            <View style={styles.heroOverlay}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{plan.eventTypeName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            {/* Header & Rating */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{plan.name}</Text>
              <Rating score={plan.rating} size={15} />
            </View>

            <Text style={styles.description}>{plan.description}</Text>

            {/* Quick Metrics */}
            <View style={styles.statsCard}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Servicios</Text>
                <Text style={styles.statVal}>{plan.servicesCount}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Invitados</Text>
                <Text style={styles.statVal}>~{plan.guestCount}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Personalizable</Text>
                <Text style={styles.statVal}>100%</Text>
              </View>
            </View>

            {/* Itemized Services Breakdown */}
            <Text style={styles.sectionTitle}>Servicios Incluidos en este Plan</Text>
            <Text style={styles.sectionSubtitle}>
              Al copiar este plan a tu carrito podrás cambiar proveedores, agregar o quitar servicios.
            </Text>

            {plan.services.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                style={styles.serviceItemCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/service/${item.serviceId}`)}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemCategoryBadge}>
                    <Text style={styles.itemCategoryText}>{item.categoryName}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
                </View>

                <Text style={styles.itemServiceName}>{item.serviceName}</Text>

                <View style={styles.itemProviderRow}>
                  <Ionicons name="business-outline" size={13} color={Colors.slate500} />
                  <Text style={styles.itemProviderName}>Proveedor: {item.providerName}</Text>
                </View>

                <Text style={styles.itemSummary}>• {item.includesSummary}</Text>
                <Text style={styles.viewServiceLink}>Ver detalle del servicio →</Text>
              </TouchableOpacity>
            ))}

            {/* Total Breakdown Summary Card */}
            <View style={styles.totalSummaryCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Precio Estimado Total</Text>
                <PriceTag price={plan.estimatedPrice} size="xl" color={Colors.primaryDark} />
              </View>
              <Text style={styles.disclaimerText}>
                Incluye los {plan.servicesCount} servicios listados. Al usar este plan podrás recalcular la cotización al instante.
              </Text>
            </View>

            {/* Primary CTA */}
            <AppButton
              title="Usar este plan en mi evento"
              icon="copy-outline"
              onPress={handleUsePlan}
              size="lg"
              variant="primary"
              style={{ marginTop: Spacing.md }}
            />
          </View>
        </ScrollView>
    </ScreenContainer>
    );
  }

  const styles = StyleSheet.create({
    scrollContent: {
      paddingBottom: SCROLL_BOTTOM_PADDING,
    },
    imageBox: {
      height: 220,
      width: '100%',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      justifyContent: 'flex-end',
      padding: Spacing.md,
    },
    typeBadge: {
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      paddingHorizontal: Spacing.md,
      paddingVertical: 5,
      borderRadius: BorderRadius.full,
      alignSelf: 'flex-start',
    },
    typeText: {
      color: Colors.white,
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.bold,
    },
    body: {
      padding: Spacing.lg,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: Typography.sizes.xl,
      fontWeight: Typography.weights.extrabold,
      color: Colors.slate900,
      flex: 1,
      marginRight: Spacing.sm,
    },
    description: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      color: Colors.slate600,
      marginBottom: Spacing.md,
    },
    statsCard: {
      flexDirection: 'row',
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.slate200,
      marginBottom: Spacing.lg,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statCol: {
      alignItems: 'center',
    },
    divider: {
      width: 1,
      height: 30,
      backgroundColor: Colors.slate200,
    },
    statLabel: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
      marginBottom: 2,
    },
    statVal: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.lineHeights.md,
      fontWeight: Typography.weights.extrabold,
      color: Colors.slate900,
    },
    sectionTitle: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.lineHeights.md,
      fontWeight: Typography.weights.bold,
      color: Colors.slate900,
      marginBottom: 2,
    },
    sectionSubtitle: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
      marginBottom: Spacing.md,
    },
    serviceItemCard: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.slate200,
      ...Shadows.sm,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    itemCategoryBadge: {
      backgroundColor: Colors.primaryLight,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    itemCategoryText: {
      fontSize: Typography.sizes.xs,
      color: Colors.primaryDark,
      fontWeight: Typography.weights.bold,
      textTransform: 'uppercase',
    },
    itemPrice: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      fontWeight: Typography.weights.bold,
      color: Colors.slate900,
    },
    itemServiceName: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.lineHeights.md,
      fontWeight: Typography.weights.bold,
      color: Colors.slate900,
      marginBottom: 4,
    },
    itemProviderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    itemProviderName: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate600,
      marginLeft: 4,
    },
    itemSummary: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
    },
    viewServiceLink: {
      fontSize: Typography.sizes.xs,
      lineHeight: Typography.lineHeights.xs,
      color: Colors.primary,
      fontWeight: Typography.weights.semibold,
      marginTop: 4,
    },
    totalSummaryCard: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginTop: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.slate200,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: Spacing.xs,
    },
    totalLabel: {
      fontSize: Typography.sizes.md,
      lineHeight: Typography.lineHeights.md,
      fontWeight: Typography.weights.bold,
      color: Colors.slate800,
    },
    disclaimerText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
    },
  });
