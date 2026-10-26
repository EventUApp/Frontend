import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { number: number; label: string }[];
  onSelectStep?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
  onSelectStep,
}) => {
  const progressPercent =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <View style={styles.wrapper}>
      {/* Top summary row */}
      <View style={styles.headerRow} accessibilityLiveRegion="polite">
        <Text style={styles.stepCountText}>
          Paso <Text style={styles.activeStepNumber}>{currentStep}</Text> de {totalSteps}
        </Text>
        <Text style={styles.progressPercentText}>{progressPercent}% Completado</Text>
      </View>

      {/* Progress line */}
      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityLabel={`Progreso: paso ${currentStep} de ${totalSteps}`}
        accessibilityValue={{ min: 0, max: totalSteps, now: currentStep }}
      >
        <View
          style={[styles.progressFill, { width: `${progressPercent}%` }]}
          accessibilityElementsHidden
        />
      </View>

      {/* Horizontal step pills / circles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <TouchableOpacity
              key={step.number}
              activeOpacity={0.8}
              disabled={!onSelectStep || step.number > currentStep}
              onPress={() => onSelectStep?.(step.number)}
              style={[
                styles.stepItem,
                isActive && styles.stepItemActive,
                isCompleted && styles.stepItemCompleted,
              ]}
              accessibilityRole="tab"
              accessibilityLabel={`Paso ${step.number}: ${step.label}`}
              accessibilityState={{
                selected: isActive,
                disabled: !onSelectStep || step.number > currentStep,
              }}
            >
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isCompleted && styles.circleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={13} color={Colors.white} accessibilityElementsHidden />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isActive && styles.circleTextActive,
                    ]}
                  >
                    {step.number}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                  isCompleted && styles.labelCompleted,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  stepCountText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
  },
  activeStepNumber: {
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  progressPercentText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate600,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.slate200,
    borderRadius: 2,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    minHeight: 44,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    backgroundColor: Colors.slate100,
  },
  stepItemActive: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  stepItemCompleted: {
    backgroundColor: '#F0FDF4',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.slate300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  circleActive: {
    backgroundColor: Colors.primary,
  },
  circleCompleted: {
    backgroundColor: Colors.success,
  },
  circleText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
  },
  circleTextActive: {
    color: Colors.white,
  },
  label: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: Typography.weights.medium,
  },
  labelActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  labelCompleted: {
    color: Colors.slate700,
  },
});
