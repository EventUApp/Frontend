import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando información...',
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityState={{ busy: true }}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        accessibilityElementsHidden
      />
      {message ? (
        <Text style={styles.text} accessibilityElementsHidden>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate500,
    fontWeight: Typography.weights.medium,
  },
});
