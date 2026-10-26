import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  AppInput,
  AppButton,
  PriceTag,
  EmptyState,
} from '../../components';
import { formatCurrency } from '../../utils/format';

export default function UpdatePriceScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();
  const { providerServices, updateServicePrice } = useAppStore();

  const [selectedId, setSelectedId] = useState<string>(
    serviceId || (providerServices[0]?.id || '')
  );

  const selectedService =
    providerServices.find((s) => s.id === selectedId) || providerServices[0];

  const [newPrice, setNewPrice] = useState(selectedService ? selectedService.price.toString() : '');
  const updateDate = new Date().toISOString().split('T')[0];

  if (!selectedService) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader
          title="Actualización de Precios"
          subtitle="Modifica tus tarifas públicas"
          showBack
        />
        <EmptyState
          icon="pricetag-outline"
          title="Sin servicios publicados"
          description="Aún no tienes servicios en tu catálogo. Crea tu primer servicio antes de modificar tarifas."
          actionTitle="Crear Servicio"
          onActionPress={() => router.replace('/provider-portal/service-edit')}
        />
      </ScreenContainer>
    );
  }

  const handleUpdate = () => {
    const parsed = parseInt(newPrice, 10);
    if (!parsed || isNaN(parsed)) {
      Alert.alert('Precio inválido', 'Por favor ingresa un número válido.');
      return;
    }

    updateServicePrice(selectedService.id, parsed);

    Alert.alert(
      'Precio Actualizado',
      `El nuevo precio para "${selectedService.name}" ha sido establecido en ${formatCurrency(parsed)}. Las contrataciones previas conservan su precio original congelado.`,
      [{ text: 'Aceptar', onPress: () => router.back() }]
    );
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
          title="Actualización de Precios"
          subtitle="Modifica tus tarifas públicas"
          showBack
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Service Selector */}
          <Text style={styles.sectionTitle}>Selecciona el Servicio a Modificar:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.serviceSelectorScroll}
          >
            {providerServices.map((s) => {
              const isSelected = s.id === selectedService?.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceChip, isSelected && styles.serviceChipActive]}
                  onPress={() => {
                    setSelectedId(s.id);
                    setNewPrice(s.price.toString());
                  }}
                >
                  <Text style={[styles.serviceChipText, isSelected && styles.serviceChipTextActive]}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Pricing Card */}
          <View style={styles.card}>
            <Text style={styles.serviceTitle}>{selectedService.name}</Text>
            <Text style={styles.serviceCategory}>
              {selectedService.categoryName} • {selectedService.priceUnit}
            </Text>

            <View style={styles.priceComparisonBox}>
              <View style={styles.priceCol}>
                <Text style={styles.priceLabel}>Precio Actual:</Text>
                <PriceTag price={selectedService.price} size="lg" color={Colors.slate700} />
              </View>

              <Ionicons name="arrow-forward" size={20} color={Colors.primary} style={{ marginTop: 12 }} />

              <View style={styles.priceCol}>
                <Text style={styles.priceLabel}>Nuevo Precio Proyectado:</Text>
                <PriceTag
                  price={parseInt(newPrice, 10) || 0}
                  size="lg"
                  color={Colors.primaryDark}
                />
              </View>
            </View>

            <AppInput
              label="Nuevo Precio en COP"
              required
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
              placeholder="Ej: 380000"
              containerStyle={{ marginTop: Spacing.md }}
            />

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.slate500} />
              <Text style={styles.dateText}>Fecha efectiva de cambio: {updateDate}</Text>
            </View>

            {/* Legal / Marketplace Notice Alert */}
            <View style={styles.noticeBox}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
              <Text style={styles.noticeText}>
                <Text style={{ fontWeight: 'bold' }}>Aviso importante:</Text> Los cambios de precio aplican únicamente para nuevas cotizaciones y búsquedas públicas. NO afectan contrataciones ya confirmadas ni presupuestos congelados.
              </Text>
            </View>

            <AppButton
              title="Actualizar Precio del Servicio"
              icon="pricetag-outline"
              size="lg"
              variant="primary"
              onPress={handleUpdate}
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const styles = StyleSheet.create({
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: SCROLL_BOTTOM_PADDING,
    },
    sectionTitle: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      fontWeight: Typography.weights.bold,
      color: Colors.slate700,
      marginBottom: Spacing.xs,
    },
    serviceSelectorScroll: {
      paddingBottom: Spacing.md,
    },
    serviceChip: {
      backgroundColor: Colors.white,
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.slate200,
      marginRight: Spacing.xs,
    },
    serviceChipActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    serviceChipText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate700,
    },
    serviceChipTextActive: {
      color: Colors.white,
      fontWeight: Typography.weights.bold,
    },
    card: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.slate200,
    },
    serviceTitle: {
      fontSize: Typography.sizes.lg,
      lineHeight: Typography.lineHeights.lg,
      fontWeight: Typography.weights.extrabold,
      color: Colors.slate900,
    },
    serviceCategory: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
      marginTop: 2,
      marginBottom: Spacing.md,
    },
    priceComparisonBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: Colors.slate50,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.slate200,
    },
    priceCol: {
      flex: 1,
    },
    priceLabel: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
      marginBottom: 4,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing.xs,
    },
    dateText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
      marginLeft: 4,
    },
    noticeBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#EEF2FF',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: '#C7D2FE',
      marginTop: Spacing.md,
    },
    noticeText: {
      fontSize: Typography.sizes.xs,
      color: Colors.primaryDark,
      marginLeft: Spacing.sm,
      flex: 1,
      lineHeight: 16,
    },
  });
