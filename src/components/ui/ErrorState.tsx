import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../theme';
import { AppButton } from './AppButton';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Ocurrió un error inesperado al procesar la solicitud.',
  onRetry,
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      accessibilityLabel={`Error: ${message}`}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name="alert-circle-outline"
          size={36}
          color={Colors.danger}
          accessibilityElementsHidden
        />
      </View>
      <Text style={styles.title} accessibilityRole="header" accessibilityElementsHidden>
        ¡Ups! Algo salió mal
      </Text>
      <Text style={styles.description} accessibilityElementsHidden>
        {message}
      </Text>
      {onRetry && (
        <AppButton
          title="Intentar nuevamente"
          onPress={onRetry}
          variant="outline"
          size="sm"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.huge,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    minWidth: 160,
  },
});
