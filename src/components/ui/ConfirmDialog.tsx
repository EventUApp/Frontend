import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { AppButton } from './AppButton';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  icon,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityViewIsModal>
          {icon && (
            <View
              style={[
                styles.iconBox,
                { backgroundColor: isDestructive ? Colors.dangerLight : Colors.primaryLight },
              ]}
            >
              <Ionicons
                name={icon}
                size={28}
                color={isDestructive ? Colors.danger : Colors.primary}
                accessibilityElementsHidden
              />
            </View>
          )}

          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cancelBtn}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={cancelText}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <AppButton
              title={confirmText}
              onPress={onConfirm}
              variant={isDestructive ? 'danger' : 'primary'}
              size="sm"
              style={styles.confirmBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.slate300,
  },
  cancelText: {
    color: Colors.slate700,
    fontWeight: Typography.weights.medium,
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
  },
  confirmBtn: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
});
