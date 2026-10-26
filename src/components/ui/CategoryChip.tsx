import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

interface CategoryChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badgeCount?: number;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon,
  badgeCount,
  selected = false,
  onPress,
  style,
}) => {
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip,
        style,
      ]}
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityLabel={
        badgeCount !== undefined ? `${label}, ${badgeCount} servicios` : label
      }
      accessibilityState={{ checked: selected }}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? Colors.white : Colors.primary}
          style={styles.icon}
          accessibilityElementsHidden
        />
      ) : (
        selected && (
          <Ionicons
            name="checkmark"
            size={14}
            color={Colors.white}
            style={styles.icon}
            accessibilityElementsHidden
          />
        )
      )}
      <Text
        style={[
          styles.label,
          selected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {label}
      </Text>
      {badgeCount !== undefined && (
        <View
          style={[styles.badge, selected ? styles.badgeSelected : styles.badgeUnselected]}
          accessibilityElementsHidden
        >
          <Text
            style={[
              styles.badgeText,
              selected ? styles.badgeTextSelected : styles.badgeTextUnselected,
            ]}
          >
            {badgeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unselectedChip: {
    backgroundColor: Colors.white,
    borderColor: Colors.slate200,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
  },
  selectedText: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
  unselectedText: {
    color: Colors.slate700,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: Spacing.xs,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeUnselected: {
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  badgeTextSelected: {
    color: Colors.white,
  },
  badgeTextUnselected: {
    color: Colors.slate600,
  },
});
