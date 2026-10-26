import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { EventPlan } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { PriceTag } from '../ui/PriceTag';
import { Rating } from '../ui/Rating';
import { AppButton } from '../ui/AppButton';

interface PlanCardProps {
  plan: EventPlan;
  onPress: () => void;
  onUsePlan: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onPress,
  onUsePlan,
  style,
  testID,
}) => {
  return (
    <View style={[styles.card, style]} testID={testID}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${plan.name}, ${plan.eventTypeName}`}
        accessibilityHint={`Incluye ${plan.servicesCount} servicios para unos ${plan.guestCount} invitados`}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: plan.image }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
          {/* Degradado inferior: mantiene legibles los textos superpuestos. */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
            style={styles.imageGradient}
          />
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{plan.eventTypeName}</Text>
          </View>
          {plan.popular && (
            <View style={styles.popularBadge}>
              <Ionicons name="flame" size={12} color={Colors.white} />
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {plan.name}
            </Text>
            <Rating score={plan.rating} size={12} showText={false} />
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {plan.description}
          </Text>

          {/* Plan stats summary */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="cube-outline" size={14} color={Colors.primary} />
              <Text style={styles.statText}>{plan.servicesCount} servicios</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={14} color={Colors.slate500} />
              <Text style={styles.statText}>~{plan.guestCount} invitados</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.success} />
              <Text style={styles.statText}>Verificado</Text>
            </View>
          </View>

          {/* Preview of included services */}
          <View style={styles.servicesPreviewList}>
            {plan.services.slice(0, 3).map((s) => (
              <View key={s.id} style={styles.servicePreviewRow}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.servicePreviewText} numberOfLines={1}>
                  <Text style={styles.serviceCategoryLabel}>{s.categoryName}:</Text>{' '}
                  {s.serviceName} ({s.providerName})
                </Text>
              </View>
            ))}
            {plan.services.length > 3 && (
              <Text style={styles.moreServicesText}>
                +{plan.services.length - 3} servicios adicionales incluidos...
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={[styles.body, { paddingTop: 0 }]}>
        {/* Pricing and Action Button */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Precio estimado total</Text>
            <PriceTag
              price={plan.estimatedPrice}
              size="lg"
              color={Colors.primaryDark}
            />
          </View>

          <AppButton
            title="Usar este plan"
            icon="copy-outline"
            onPress={onUsePlan}
            size="sm"
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.slate200,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  typeBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginLeft: 3,
  },
  body: {
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
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
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.slate50,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginLeft: 4,
    fontWeight: Typography.weights.medium,
  },
  servicesPreviewList: {
    marginBottom: Spacing.md,
    backgroundColor: '#FAF5FF',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  servicePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  servicePreviewText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  serviceCategoryLabel: {
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  moreServicesText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
    marginLeft: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.md,
  },
  priceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: 2,
  },
});
