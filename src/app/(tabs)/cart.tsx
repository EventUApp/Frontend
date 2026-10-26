import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';
import { LayoutAnimation, EnterFadeUp, ExitFade } from '../../constants/animations';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppButton,
  ServiceCartItem,
  EmptyState,
  ConfirmDialog,
} from '../../components';
import { EditDetailsSheet } from '../../components/cart/EditDetailsSheet';
import { ReplaceServiceSheet } from '../../components/cart/ReplaceServiceSheet';
import { formatCurrency } from '../../utils/format';
import { Service } from '../../types';

/**
 * El CTA fijo reposa justo por encima del tab bar fijo.
 * La lista reserva este espacio para que no tape el último contenido.
 */
const FLOATING_CTA_BOTTOM = Spacing.md;
const CTA_RESERVED_SPACE = 84;

export default function CartScreen() {
  const {
    currentUser,
    activeCart,
    setCartDetails,
    updateServiceQuantity,
    removeServiceFromCart,
    replaceServiceInCart,
    getCartSubtotal,
    getCartTotal,
    saveCartAsQuote,
    providerServices,
  } = useAppStore();

  useEffect(() => {
    if (currentUser.role === 'provider') {
      router.replace('/provider-dashboard');
    }
  }, [currentUser.role]);

  const [eventName, setEventName] = useState(activeCart.name);
  const [eventDate, setEventDate] = useState(activeCart.date);
  const [eventLocation, setEventLocation] = useState(activeCart.location);
  const [guestCount, setGuestCount] = useState(activeCart.guestCount.toString());

  // Replace provider modal
  const [replaceTargetItemId, setReplaceTargetItemId] = useState<string | null>(null);
  const [availableReplacements, setAvailableReplacements] = useState<Service[]>([]);

  // Delete confirm dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const subtotal = getCartSubtotal();
  const total = getCartTotal();

  // Bottom sheets: 50% y 75% de la pantalla, se descartan con swipe.
  const editSheetRef = useRef<BottomSheetModal>(null);
  const replaceSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleOpenEditModal = () => {
    setEventName(activeCart.name);
    setEventDate(activeCart.date);
    setEventLocation(activeCart.location);
    setGuestCount(activeCart.guestCount.toString());
    editSheetRef.current?.present();
  };

  const handleOpenReplace = (itemId: string, category: string) => {
    const alternatives = providerServices.filter((s) => s.category === category);
    setReplaceTargetItemId(itemId);
    setAvailableReplacements(alternatives);
    replaceSheetRef.current?.present();
  };

  const handleSelectReplacement = (service: Service) => {
    if (replaceTargetItemId) {
      replaceServiceInCart(replaceTargetItemId, service);
      setReplaceTargetItemId(null);
      replaceSheetRef.current?.dismiss();
    }
  };

  const handleSaveDetails = () => {
    const parsedGuestCount = parseInt(guestCount, 10);
    setCartDetails({
      name: eventName,
      date: eventDate,
      location: eventLocation,
      guestCount: isNaN(parsedGuestCount) ? 50 : parsedGuestCount,
    });
    editSheetRef.current?.dismiss();
  };

  const handleContinueToQuote = () => {
    const savedEvent = saveCartAsQuote();
    router.push(`/quote/${savedEvent.id}`);
  };

  const handleChangeQuantity = (itemId: string, quantity: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateServiceQuantity(itemId, quantity);
  };

  if (currentUser.role === 'provider') {
    return null;
  }

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Mi Evento (Carrito)</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={handleOpenEditModal}
          >
            <Ionicons name="create-outline" size={16} color={Colors.primary} />
            <Text style={styles.editBtnText}>Editar datos</Text>
          </TouchableOpacity>
        </View>

        {/* Event Card Summary */}
        <View style={styles.eventInfoBox}>
          <Text style={styles.eventNameText} numberOfLines={1}>
            {activeCart.name}
          </Text>

          <View style={styles.eventMetaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={Colors.slate500} />
              <Text style={styles.metaText}>{activeCart.date || 'Sin fecha'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={Colors.slate500} />
              <Text style={styles.metaText} numberOfLines={1}>
                {activeCart.location || 'Sin ubicación'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={13} color={Colors.slate500} />
              <Text style={styles.metaText}>~{activeCart.guestCount} invitados</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cart Content (reserva espacio para el CTA fijo al final) */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollList,
          activeCart.services.length > 0 && styles.scrollListWithCta,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            Servicios Seleccionados ({activeCart.services.length})
          </Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={styles.addMoreLink}>+ Agregar más</Text>
          </TouchableOpacity>
        </View>

        {activeCart.services.length === 0 ? (
          <EmptyState
            icon="cart-outline"
            title="Tu evento está vacío"
            description="Explora planes preconfigurados o añade servicios individuales de diferentes proveedores."
            actionTitle="Explorar catálogo"
            onActionPress={() => router.push('/explore')}
          />
        ) : (
          activeCart.services.map((item) => (
            // Mismo patrón que en explore: `layout` fuera, entrada/salida
            // dentro, para no sobrescribir el `transform` (warning Reanimated).
            <Animated.View key={item.id} layout={LayoutAnimation}>
              <Animated.View entering={EnterFadeUp} exiting={ExitFade}>
                <ServiceCartItem
                  item={item}
                  onIncrement={() => handleChangeQuantity(item.id, item.quantity + 1)}
                  onDecrement={() => handleChangeQuantity(item.id, item.quantity - 1)}
                  onRemove={() => setDeleteTargetId(item.id)}
                  onChangeProvider={() => handleOpenReplace(item.id, item.category)}
                  onViewDetail={() => router.push(`/service/${item.serviceId}`)}
                />
              </Animated.View>
            </Animated.View>
          ))
        )}

        {/* Pricing Breakdown Bottom Card */}
        {activeCart.services.length > 0 && (
          <View style={styles.checkoutSummaryCard}>
            <Text style={styles.summaryTitle}>Resumen de Cotización</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal de servicios</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Costos de plataforma</Text>
              <Text style={styles.freeText}>$0 (Gratis)</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Estimado</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>

            <View style={styles.noticeAlert}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
              <Text style={styles.noticeAlertText}>
                El precio se recalcula en tiempo real al agregar o modificar servicios.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* CTA fijo: siempre visible sin hacer scroll hasta el final. */}
      {activeCart.services.length > 0 && (
        <View style={styles.floatingCta}>
          <AppButton
            title="Continuar con la cotización"
            icon="arrow-forward"
            iconPosition="right"
            onPress={handleContinueToQuote}
            size="lg"
            variant="primary"
            style={styles.floatingCtaBtn}
          />
        </View>
      )}

      <EditDetailsSheet
        ref={editSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        eventName={eventName}
        onEventNameChange={setEventName}
        eventDate={eventDate}
        onEventDateChange={setEventDate}
        eventLocation={eventLocation}
        onEventLocationChange={setEventLocation}
        guestCount={guestCount}
        onGuestCountChange={setGuestCount}
        onSave={handleSaveDetails}
        onClose={() => editSheetRef.current?.dismiss()}
      />

      <ReplaceServiceSheet
        ref={replaceSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        replacements={availableReplacements}
        onSelect={handleSelectReplacement}
        onClose={() => replaceSheetRef.current?.dismiss()}
        onDismiss={() => setReplaceTargetItemId(null)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={!!deleteTargetId}
        title="¿Eliminar servicio?"
        message="Este servicio se quitará del presupuesto y la cotización se recalculará automáticamente."
        confirmText="Eliminar"
        isDestructive
        icon="trash-outline"
        onConfirm={() => {
          if (deleteTargetId) {
            removeServiceFromCart(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  editBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    marginLeft: 3,
  },
  eventInfoBox: {
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  eventNameText: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginLeft: 3,
  },
  scrollList: {
    padding: Spacing.lg,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  scrollListWithCta: {
    paddingBottom: SCROLL_BOTTOM_PADDING + CTA_RESERVED_SPACE,
  },
  floatingCta: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: FLOATING_CTA_BOTTOM,
  },
  floatingCtaBtn: {
    width: '100%',
    ...Shadows.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  addMoreLink: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  checkoutSummaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
  },
  summaryValue: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate900,
  },
  freeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    fontWeight: Typography.weights.bold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  totalLabel: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  totalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  noticeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  noticeAlertText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    marginLeft: 6,
    flex: 1,
  },
});
