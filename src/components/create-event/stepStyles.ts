import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

/** Estilos compartidos por los 4 pasos macro del asistente. */
export const stepStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  desc: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate700,
    marginBottom: Spacing.xs,
  },
  // Atajos tocables: aire entre filas para que la pantalla respire.
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickChip: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minHeight: 44,
    justifyContent: 'center',
  },
  quickChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickChipText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate700,
    fontWeight: Typography.weights.medium,
  },
  quickChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
});
