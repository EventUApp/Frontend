import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { TimelineVisual } from '../domain/TimelineVisual';
import { AppEvent } from '../../types';

interface EventTimelineTabProps {
  event: AppEvent;
}

/** Pestaña Cronograma: hitos y cuenta regresiva. */
export const EventTimelineTab: React.FC<EventTimelineTabProps> = ({ event }) => {
  return (
    <View>
      <Text style={styles.heading}>Cronograma y Cuenta Regresiva</Text>
      <Text style={styles.subtitle}>
        Hitos clave para garantizar el cumplimiento y coordinación de cada entrega.
      </Text>

      <TimelineVisual timeline={event.timeline} />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginBottom: Spacing.md,
  },
});
