import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  FadeOutDown,
  ReduceMotion,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';

interface ServiceToastProps {
  bottomOffset: number;
}

/** Confirmación flotante al añadir al evento (la monta el controlador). */
export const ServiceToast: React.FC<ServiceToastProps> = ({ bottomOffset }) => {
  return (
    <Animated.View
      entering={FadeInUp.duration(200).reduceMotion(ReduceMotion.System)}
      exiting={FadeOutDown.duration(180).reduceMotion(ReduceMotion.System)}
      style={[styles.toast, { bottom: bottomOffset }]}
    >
      <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
      <Text style={styles.text}>¡Servicio añadido a tu evento!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    zIndex: 100,
    ...Shadows.md,
  },
  text: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginLeft: 6,
  },
});
