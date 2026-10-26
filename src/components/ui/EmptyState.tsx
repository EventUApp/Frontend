import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../../theme';
import { AppButton } from './AppButton';
import { EnterFade } from '../../constants/animations';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'file-tray-outline',
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}) => {
  return (
    // Aparece cuando el filtro no deja resultados: entra con un fundido
    // corto para que el usuario perceive el cambio en lugar de un salto.
    <Animated.View entering={EnterFade} style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={Colors.primary} accessibilityElementsHidden />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onActionPress && (
        <AppButton
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="sm"
          style={styles.button}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
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
    textAlign: 'center',
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
