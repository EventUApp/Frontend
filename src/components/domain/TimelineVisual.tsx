import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventTimelineItem } from '../../types';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface TimelineVisualProps {
  timeline: EventTimelineItem[];
}

export const TimelineVisual: React.FC<TimelineVisualProps> = ({ timeline }) => {
  return (
    <View style={styles.container}>
      {timeline.map((item, index) => {
        const isCompleted = item.status === 'completed';
        const isLast = index === timeline.length - 1;

        return (
          <View key={item.id || index} style={styles.timelineRow}>
            {/* Left timeline indicator with vertical line */}
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.circle,
                  isCompleted ? styles.circleCompleted : styles.circlePending,
                ]}
              >
                <Ionicons
                  name={isCompleted ? 'checkmark' : 'time-outline'}
                  size={14}
                  color={isCompleted ? Colors.white : Colors.primary}
                />
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    isCompleted ? styles.lineCompleted : styles.linePending,
                  ]}
                />
              )}
            </View>

            {/* Content card */}
            <View style={styles.contentCol}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.dayBadge,
                    isCompleted ? styles.dayBadgeCompleted : styles.dayBadgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayBadgeText,
                      isCompleted ? styles.dayBadgeTextCompleted : styles.dayBadgeTextPending,
                    ]}
                  >
                    {item.dayLabel}
                  </Text>
                </View>
                <Text style={styles.statusLabel}>
                  {isCompleted ? '✓ Completado' : 'Pendiente'}
                </Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.md,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circleCompleted: {
    backgroundColor: Colors.success,
  },
  circlePending: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: Colors.success,
  },
  linePending: {
    backgroundColor: Colors.slate200,
  },
  contentCol: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  dayBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  dayBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  dayBadgePending: {
    backgroundColor: Colors.primaryLight,
  },
  dayBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  dayBadgeTextCompleted: {
    color: Colors.success,
  },
  dayBadgeTextPending: {
    color: Colors.primaryDark,
  },
  statusLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    fontWeight: Typography.weights.medium,
  },
  title: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  description: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    lineHeight: 18,
  },
});
