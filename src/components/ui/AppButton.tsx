import React, { useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';
import { useFocusRing } from '../../hooks/useFocusRing';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  onFocus,
  onBlur,
}) => {
  const { isSmall } = useResponsive();

  const getContainerStyle = (): ViewStyle => {
    const vSpacing = isSmall ? Spacing.md : Spacing.lg;
    const hSpacing = isSmall ? Spacing.lg : Spacing.xl;
    const sizeStyle: ViewStyle = size === 'sm'
      ? { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md }
      : size === 'lg'
        ? { paddingVertical: vSpacing, paddingHorizontal: hSpacing }
        : { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
    const variantStyle: ViewStyle = {
      primary: { backgroundColor: Colors.primary },
      secondary: { backgroundColor: Colors.slate800 },
      outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: Colors.danger },
      success: { backgroundColor: Colors.success },
    }[variant];

    return {
      ...styles.base,
      ...sizeStyle,
      ...variantStyle,
      ...(disabled || loading ? { opacity: 0.55 } : {}),
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return Colors.primary;
      default:
        return Colors.white;
    }
  };

  const getFontSize = (): number => {
    const scale = isSmall ? 0.9 : 1;

    switch (size) {
      case 'sm':
        return Typography.sizes.sm * scale;
      case 'lg':
        return Typography.sizes.lg * scale;
      default:
        return Typography.sizes.md * scale;
    }
  };

  const textColor = getTextColor();
  const fontSize = getFontSize();

  const { isFocused } = useFocusRing();

  // Micro-interacción "squishy" con la API Animated nativa: al presionar
  // el botón se comprime al 96% y recupera su tamaño al soltar.
  // En useState (no useRef+.current) para no leer refs durante el render.
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    // El `style` custom vive en el envoltorio animado (no en el botón)
    // para que `flex` y márgenes sigan resolviéndose contra el padre.
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        getContainerStyle(),
        // Foco visible: sin anillo, quien navega con teclado o switch control
        // no sabe donde esta. Usa el token de marca.
        isFocused && styles.focused,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {/* El contenido original se mantiene montado pero invisible durante
          la carga: así el botón conserva su ancho/alto y no hay salto
          visual cuando aparece el indicador. */}
      <View
        style={[styles.contentRow, loading && styles.hiddenContent]}
        importantForAccessibility={loading ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={loading}
      >
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={fontSize + 3}
            color={textColor}
            style={styles.iconLeft}
          />
        )}
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon}
            size={fontSize + 3}
            color={textColor}
            style={styles.iconRight}
          />
        )}
      </View>
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={textColor} size="small" />
        </View>
      )}
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenContent: {
    opacity: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  focused: {
    borderWidth: 2,
    borderColor: Colors.focusRing,
  },
});
