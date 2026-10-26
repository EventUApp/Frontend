import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { formatCurrency } from '../../utils/format';

interface PriceTagProps {
  price: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  prefix?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  unit,
  size = 'md',
  color = Colors.primary,
  containerStyle,
  textStyle,
  prefix,
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return Typography.sizes.sm;
      case 'lg':
        return Typography.sizes.xl;
      case 'xl':
        return Typography.sizes.xxl;
      default:
        return Typography.sizes.md;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {prefix ? (
        <Text style={[styles.prefix, { fontSize: getFontSize() - 3 }]}>{prefix} </Text>
      ) : null}
      <Text
        style={[
          styles.price,
          { color, fontSize: getFontSize() },
          textStyle,
        ]}
      >
        {formatCurrency(price)}
      </Text>
      {unit ? (
        <Text style={[styles.unit, { fontSize: Math.max(10, getFontSize() - 4) }]}>
          {' '}
          / {unit}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  prefix: {
    color: Colors.slate500,
    fontWeight: Typography.weights.medium,
  },
  price: {
    fontWeight: Typography.weights.bold,
  },
  unit: {
    color: Colors.slate500,
    fontWeight: Typography.weights.regular,
  },
});
