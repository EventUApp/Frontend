import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  /** Nombre accesible del icono derecho. Sin esto se anuncia como "botón". */
  rightIconLabel?: string;
  containerStyle?: ViewStyle;
  /** Ref al TextInput interno (p. ej. para encadenar foco con next). */
  inputRef?: React.Ref<AppTextInputRef>;
}

/** Instancia imperativa del TextInput compatible con React Native 0.88. */
export type AppTextInputRef = React.ComponentRef<typeof TextInput>;

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  required,
  leftIcon,
  rightIcon,
  onRightIconPress,
  rightIconLabel,
  containerStyle,
  style,
  editable = true,
  accessibilityLabel,
  accessibilityState,
  onFocus,
  onBlur,
  inputRef,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // El <Text> del label es decorativo: se replica aquí para que el campo
  // tenga nombre accesible aunque no haya placeholder.
  const fieldLabel =
    accessibilityLabel ?? (required && label ? `${label}, obligatorio` : label);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label} accessibilityElementsHidden>
            {label}
          </Text>
          {required && (
            <Text style={styles.required} accessibilityElementsHidden>
              {' '}
              *
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          !editable && styles.disabledWrapper,
          // Feedback visual de foco: el error mantiene precedencia y se
          // aplica después para no quedar enmascarado por el foco.
          isFocused && !error && styles.focusedWrapper,
          !!error && styles.errorWrapper,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={Colors.slate400}
            style={styles.leftIcon}
            accessibilityElementsHidden
          />
        )}

        <TextInput
          ref={inputRef}
          style={[styles.input, style]}
          placeholderTextColor={Colors.slate400}
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={fieldLabel}
          accessibilityHint={error}
          accessibilityState={{
            disabled: !editable,
            ...accessibilityState,
          }}
          {...rest}
        />

        {rightIcon && onRightIconPress ? (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={8}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={rightIconLabel}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={Colors.slate400}
              style={styles.rightIcon}
              accessibilityElementsHidden
            />
          </Pressable>
        ) : rightIcon ? (
          <Ionicons
            name={rightIcon}
            size={20}
            color={Colors.slate400}
            style={styles.rightIcon}
            accessibilityElementsHidden
          />
        ) : null}
      </View>

      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate700,
  },
  required: {
    color: Colors.danger,
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: Colors.slate200,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  disabledWrapper: {
    backgroundColor: Colors.slate100,
    borderColor: Colors.slate300,
  },
  focusedWrapper: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  errorWrapper: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    color: Colors.slate900,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  errorText: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.xs,
    color: Colors.danger,
    fontWeight: Typography.weights.medium,
  },
});
