import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppEvent, EventStatus } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { StatusBadge } from '../ui/StatusBadge';
import { PriceTag } from '../ui/PriceTag';
import { AppButton } from '../ui/AppButton';
import { formatCurrency, formatShortDate } from '../../utils/format';

interface EventCardProps {
  event: AppEvent;
  onPress: () => void;
  onPrimaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface PrimaryAction {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: 'primary' | 'outline';
}

/** Accion principal contextual segun el ciclo de vida del evento. */
const PRIMARY_ACTIONS: Record<EventStatus, PrimaryAction> = {
  draft: { title: 'Continuar Planificando', icon: 'cart-outline', variant: 'primary' },
  quoted: { title: 'Revisar Cotización & Pagar', icon: 'card-outline', variant: 'primary' },
  confirmed: { title: 'Ver Hoja de Ruta & Agenda', icon: 'calendar-outline', variant: 'primary' },
  in_progress: { title: 'Coordinar Proveedores', icon: 'chatbubbles-outline', variant: 'primary' },
  completed: { title: 'Ver Historial & Garantía', icon: 'shield-checkmark-outline', variant: 'outline' },
  cancelled: { title: 'Ver Detalle del Evento', icon: 'document-text-outline', variant: 'outline' },
};

const SHOW_ESCROW: EventStatus[] = ['confirmed', 'in_progress'];

/**
 * Centro de control del evento: portada visual, estado financiero y accion
 * primaria contextual.
 *
 * La tarjeta es un `View` con dos hermanos: el area de detalle (unico
 * `TouchableOpacity`) y el area de accion con el CTA. Nunca se anidan
 * tactiles, evitando el crash de hidratacion en web.
 */
export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onPrimaryAction,
  style,
}) => {
  const total = event.contractedPrice ?? event.quotedPrice;
  const paidRatio =
    total > 0 ? Math.min(1, Math.max(0, event.depositPaid / total)) : 0;
  const paidPercent = Math.round(paidRatio * 100);
  const showEscrow = SHOW_ESCROW.includes(event.status);
  const action = PRIMARY_ACTIONS[event.status];
  const priceLabel =
    event.status === 'draft' ? 'Estimado:' : event.contractedPrice ? 'Contratado:' : 'Total:';

  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalle de ${event.name}, ${event.typeName}`}
        accessibilityHint={`${event.services.length} servicios. Saldo pendiente ${formatCurrency(event.balanceDue)}`}
      >
        <View style={styles.cover}>
          {event.coverImage ? (
            <Image
              source={{ uri: event.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
              transition={250}
            />
          ) : (
            <LinearGradient
              colors={[Colors.brandGradient[0], Colors.brandGradient[1]]}
              style={styles.coverImage}
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.68)']}
            style={styles.coverShade}
          />
          <View style={styles.coverTopRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText} numberOfLines={1}>
                {event.typeName}
              </Text>
            </View>
            <StatusBadge status={event.status} type="event" />
          </View>
          <View style={styles.coverTitleBlock}>
            <Text style={styles.coverTitle} numberOfLines={1}>
              {event.name}
            </Text>
            <Text style={styles.coverSubtitle} numberOfLines={1}>
              {formatShortDate(event.date)} · {event.guestCount} invitados ·{' '}
              {event.location.split(',')[0]}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaText}>{formatShortDate(event.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={Colors.slate400} />
              <Text style={styles.metaText}>{event.guestCount} inv.</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={Colors.slate400} />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.location.split(',')[0]}
              </Text>
            </View>
          </View>

          {showEscrow && (
            <View
              accessible
              accessibilityLabel={`Progreso de pago: ${paidPercent} por ciento en custodia. Anticipo ${formatCurrency(event.depositPaid)}, saldo ${formatCurrency(event.balanceDue)}`}
              style={styles.escrowBox}
            >
              <View style={styles.escrowHeader}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color={Colors.successText}
                />
                <Text style={styles.escrowTitle}>
                  {paidPercent}% pagado en custodia Escrow
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${paidPercent}%` }]} />
              </View>
              <View style={styles.escrowAmounts}>
                <Text style={styles.escrowPaid}>
                  Anticipo pagado: {formatCurrency(event.depositPaid)}
                </Text>
                <Text style={styles.escrowDue}>
                  Saldo pendiente: {formatCurrency(event.balanceDue)}
                </Text>
              </View>
            </View>
          )}

          {event.status === 'quoted' && (
            <View
              accessible
              accessibilityLabel="Tarifa congelada garantizada: tus precios no subirán mientras decides"
              style={styles.frozenBox}
            >
              <Ionicons name="lock-closed-outline" size={16} color={Colors.infoText} />
              <View style={styles.frozenTexts}>
                <Text style={styles.frozenTitle}>Tarifa congelada garantizada</Text>
                <Text style={styles.frozenSub}>
                  Tus precios no subirán mientras decides.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.summaryRow}>
            <View style={styles.servicesCountBadge}>
              <Ionicons name="cube-outline" size={13} color={Colors.primary} />
              <Text style={styles.servicesCountText}>
                {event.services.length} servicios
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>{priceLabel}</Text>
              <PriceTag
                price={total}
                size="md"
                color={event.contractedPrice ? Colors.success : Colors.primaryDark}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.ctaArea}>
        <AppButton
          title={action.title}
          icon={action.icon}
          onPress={onPrimaryAction ?? onPress}
          size="sm"
          variant={action.variant}
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  cover: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.slate200,
  },
  coverShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
  },
  coverTopRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    maxWidth: '55%',
  },
  typeBadgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  coverTitleBlock: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    bottom: Spacing.sm,
  },
  coverTitle: {
    color: Colors.white,
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
  },
  coverSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    marginTop: 2,
  },
  body: {
    padding: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.slate50,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
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
  escrowBox: {
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  escrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  escrowTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.successText,
    marginLeft: 4,
  },
  progressTrack: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
  },
  escrowAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  escrowPaid: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.successText,
  },
  escrowDue: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
  },
  frozenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: Colors.infoBorder,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  frozenTexts: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  frozenTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.infoText,
  },
  frozenSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginTop: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
  },
  servicesCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  servicesCountText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginRight: 4,
  },
  ctaArea: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  ctaButton: {
    width: '100%',
  },
});
