import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { PriceTag } from '../ui/PriceTag';
import { Rating } from '../ui/Rating';
import { Avatar } from '../ui/Avatar';
import { formatCurrency } from '../../utils/format';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
  style?: ViewStyle;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  onAddToCart,
  isInCart = false,
  style,
}) => {
  const cardScale = useSharedValue(1);
  const addBtnScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addBtnScale.value }],
  }));

  const handlePressIn = () => {
    cardScale.value = withSpring(0.985, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation?.();
    addBtnScale.value = withSequence(
      withTiming(0.85, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 240 })
    );
    onAddToCart?.();
  };

  return (
    <Animated.View style={[styles.card, animatedCardStyle, style]}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${service.name}, de ${service.providerName}`}
        accessibilityHint={`Precio ${formatCurrency(service.price)} ${
          service.priceUnit ? `por ${service.priceUnit}` : ''
        }`}
      >
        {/* Service Cover Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: service.images?.[0] || '' }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
          {/* Degradado inferior: garantiza la legibilidad del badge de
              categoría sobre cualquier imagen. */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
            style={styles.imageGradient}
          />
          {service.recommended && (
            <View style={styles.recommendedBadge}>
              <Ionicons name="sparkles" size={12} color={Colors.white} />
              <Text style={styles.recommendedText}>Recomendado</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.categoryName}</Text>
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.body}>
          <View style={styles.providerRow}>
            <Avatar source={service.providerAvatar} name={service.providerName} size={24} />
            <Text style={styles.providerName} numberOfLines={1}>
              {service.providerName}
            </Text>
          </View>

          <Text style={styles.serviceName} numberOfLines={1}>
            {service.name}
          </Text>

          <Text style={styles.shortDescription} numberOfLines={2}>
            {service.shortDescription}
          </Text>

          <View style={styles.ratingRow}>
            <Rating score={service.rating} count={service.reviewCount} size={13} />
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={12} color={Colors.slate400} />
              <Text style={styles.locationText} numberOfLines={1}>
                {service.location.split(',')[0]}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={[styles.body, { paddingTop: 0 }]}>
        {/* Pricing and Cart Action */}
        <View style={styles.footer}>
          <PriceTag
            price={service.price}
            unit={service.priceUnit}
            size="md"
            color={Colors.primaryDark}
          />

          {onAddToCart && (
            <Animated.View style={animatedBtnStyle}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.addBtn,
                  isInCart && styles.inCartBtn,
                ]}
                onPress={handleAddToCart}
                accessibilityRole="button"
                accessibilityLabel={
                  isInCart
                    ? `${service.name} ya está en tu evento`
                    : `Agregar ${service.name} a tu evento`
                }
                accessibilityState={{ selected: isInCart }}
              >
                <Ionicons
                  name={isInCart ? 'checkmark' : 'add'}
                  size={18}
                  color={isInCart ? Colors.white : Colors.primary}
                  accessibilityElementsHidden
                />
                <Text
                  style={[
                    styles.addBtnText,
                    isInCart && styles.inCartBtnText,
                  ]}
                  accessibilityElementsHidden
                >
                  {isInCart ? 'Agregado' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  imageContainer: {
    height: 140,
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
    height: 72,
  },
  recommendedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginLeft: 3,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  body: {
    padding: Spacing.md,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  providerName: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: Typography.weights.medium,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  serviceName: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  shortDescription: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%',
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  inCartBtn: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  addBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    marginLeft: 3,
  },
  inCartBtnText: {
    color: Colors.white,
  },
});
