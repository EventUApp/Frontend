import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { EventStatus, ClaimStatus } from '../../types';
import { getEventStatusConfig, getClaimStatusConfig } from '../../utils/format';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface StatusBadgeProps {
  status?: EventStatus | ClaimStatus | string;
  type?: 'event' | 'claim' | 'custom';
  customLabel?: string;
  customColor?: string;
  customBg?: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'draft',
  type = 'event',
  customLabel,
  customColor,
  customBg,
  style,
}) => {
  let label = customLabel || status;
  let bg = customBg || Colors.slate100;
  let text = customColor || Colors.slate700;

  if (type === 'event') {
    const config = getEventStatusConfig(status as EventStatus);
    label = customLabel || config.label;
    bg = customBg || config.bg;
    text = customColor || config.text;
  } else if (type === 'claim') {
    const config = getClaimStatusConfig(status as ClaimStatus);
    label = customLabel || config.label;
    bg = customBg || config.bg;
    text = customColor || config.text;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});
