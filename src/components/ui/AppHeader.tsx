import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, Typography } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightElement,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const { padding } = useResponsive();

  return (
    <View
      style={[
        styles.header,
        // El header se renderiza dentro de ScreenContainer, que ya aplica
        // padding horizontal. Sin estos margenes negativos su fondo blanco y
        // su borde inferior quedan recortados y aparecen franjas del fondo de
        // pantalla a los lados; ademas el titulo queda mas indentado que en
        // las pantallas que usan cabeceras propias.
        { marginHorizontal: -padding, paddingHorizontal: padding + Spacing.lg },
      ]}
    >
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="arrow-back" size={24} color={Colors.slate900} accessibilityElementsHidden />
          </TouchableOpacity>
        )}
        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightElement ? <View style={styles.rightContainer}>{rightElement}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
});
