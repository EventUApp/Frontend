import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {actionText && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={actionText}
          accessibilityHint={`de la sección ${title}`}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
    marginTop: 2,
  },
  actionText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  actionBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingLeft: Spacing.sm,
  },
});
