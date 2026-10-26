import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  QuoteSummary,
  AppButton,
  ConfirmDialog,
  EmptyState,
} from '../../components';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, confirmQuote } = useAppStore();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Cotización no encontrada" showBack />
        <EmptyState
            icon="alert-circle-outline"
            title="Cotización no encontrada"
            description="La cotización que buscas no existe o no tienes permiso para verla."
            actionTitle="Volver a eventos"
            onActionPress={() => router.replace('/events')}
          />
        </ScreenContainer>
      );
      }
  const isContracted = event.status === 'confirmed';

  const handleConfirmPlan = () => {
      confirmQuote(event.id);
      setConfirmModalVisible(false);
      // Proceed to payment checkout mock
      router.push(`/checkout/${event.id}`);
    };

    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader
          title={isContracted ? 'Plan Contratado' : 'Cotización Formal'}
          subtitle={event.name}
          showBack
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Event Header Card */}
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventMeta}>
              {event.typeName} • Fecha: {event.date} • {event.location}
            </Text>
            <Text style={styles.guestCount}>~{event.guestCount} invitados proyectados</Text>
          </View>

          {/* Detailed Quote Summary Component */}
          <QuoteSummary
            items={event.services}
            subtotal={event.quotedPrice}
            dateGenerated={event.quoteGeneratedAt || event.createdAt}
            isContracted={isContracted}
          />

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {!isContracted ? (
              <>
                <AppButton
                  title="Confirmar y Congelar Precios"
                  icon="shield-checkmark-outline"
                  size="lg"
                  variant="primary"
                  onPress={() => setConfirmModalVisible(true)}
                  style={{ marginBottom: Spacing.sm }}
                />

                <AppButton
                  title="Editar este Plan"
                  icon="create-outline"
                  size="md"
                  variant="outline"
                  onPress={() => router.push('/cart')}
                  style={{ marginBottom: Spacing.sm }}
                />

                <AppButton
                  title="Guardar en Mis Eventos"
                  icon="bookmark-outline"
                  size="md"
                  variant="ghost"
                  onPress={() => router.push('/events')}
                />
              </>
            ) : (
              <>
                <AppButton
                  title="Ir a Gestionar Evento Contratado"
                  icon="arrow-forward"
                  size="lg"
                  variant="success"
                  onPress={() => router.push(`/event/${event.id}`)}
                  style={{ marginBottom: Spacing.sm }}
                />

                <AppButton
                  title="Ver Cronograma y Pagos"
                  icon="calendar-outline"
                  size="md"
                  variant="outline"
                  onPress={() => router.push(`/event/${event.id}`)}
                />
              </>
            )}
          </View>
        </ScrollView>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          visible={confirmModalVisible}
          title="¿Confirmar y congelar cotización?"
          message="Al confirmar, las tarifas pactadas con los proveedores quedarán congeladas y pasarán formalmente a 'Precio Contratado'. Se habilitará la opción de abono y cronograma."
          confirmText="Confirmar Plan"
          cancelText="Volver"
          icon="shield-checkmark"
          onConfirm={handleConfirmPlan}
          onCancel={() => setConfirmModalVisible(false)}
        />
    </ScreenContainer>
    );
  }

  const styles = StyleSheet.create({
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: SCROLL_BOTTOM_PADDING,
    },
    eventCard: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.slate200,
    },
    eventName: {
      fontSize: Typography.sizes.lg,
      lineHeight: Typography.lineHeights.lg,
      fontWeight: Typography.weights.extrabold,
      color: Colors.slate900,
      marginBottom: 4,
    },
    eventMeta: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate600,
      marginBottom: 2,
    },
    guestCount: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
    },
    actionsContainer: {
      marginTop: Spacing.sm,
    },
  });
