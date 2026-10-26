import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  ReduceMotion,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Service } from '../../types';

interface ServiceProviderRowProps {
  service: Service;
}

/** Fila de proveedor con micro-interacción de presión. */
export const ServiceProviderRow: React.FC<ServiceProviderRowProps> = ({ service }) => {
  const providerScale = useSharedValue(1);

  const animatedProviderStyle = useAnimatedStyle(() => ({
    transform: [{ scale: providerScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(220).reduceMotion(ReduceMotion.System)}
      style={animatedProviderStyle}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          providerScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          providerScale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        style={styles.card}
        onPress={() => router.push(`/provider/${service.providerId}`)}
        accessibilityRole="button"
        accessibilityLabel={`Ver perfil del proveedor ${service.providerName}`}
      >
        <Avatar source={service.providerAvatar} name={service.providerName} size={48} />
        <View style={styles.info}>
          <Text style={styles.title}>Ofrecido por:</Text>
          <Text style={styles.name}>{service.providerName}</Text>
          <Text style={styles.link}>Ver perfil y otros servicios →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  info: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  name: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginVertical: 1,
  },
  link: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
});
