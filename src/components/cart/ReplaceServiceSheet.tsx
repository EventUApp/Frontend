import React, { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { formatCurrency } from '../../utils/format';
import { Service } from '../../types';

interface ReplaceServiceSheetProps {
  snapPoints: string[];
  backdropComponent: React.FC<BottomSheetBackdropProps>;
  replacements: Service[];
  onSelect: (service: Service) => void;
  onClose: () => void;
  onDismiss: () => void;
}

/** Sheet para cambiar un servicio por otro de la misma categoría. */
export const ReplaceServiceSheet = forwardRef<BottomSheetModal, ReplaceServiceSheetProps>(
  function ReplaceServiceSheet(
    { snapPoints, backdropComponent, replacements, onSelect, onClose, onDismiss },
    ref
  ) {
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={backdropComponent}
        onDismiss={onDismiss}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Cambiar o Reemplazar Servicio</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar reemplazo de servicio"
            >
              <Ionicons name="close-circle" size={26} color={Colors.slate400} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Selecciona otro proveedor o servicio de la misma categoría:
          </Text>

          {replacements.map((srv) => (
            <TouchableOpacity
              key={srv.id}
              style={styles.replacementCard}
              onPress={() => onSelect(srv)}
              accessibilityRole="button"
              accessibilityLabel={`Elegir ${srv.name} de ${srv.providerName}`}
            >
              <View style={styles.replacementInfo}>
                <Text style={styles.replacementTitle}>{srv.name}</Text>
                <Text style={styles.replacementProvider}>{srv.providerName}</Text>
                <Text style={styles.replacementPrice}>
                  {formatCurrency(srv.price)} {srv.priceUnit ? `/${srv.priceUnit}` : ''}
                </Text>
              </View>
              <View style={styles.chooseBadge}>
                <Text style={styles.chooseBadgeText}>Elegir</Text>
              </View>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  handle: {
    backgroundColor: Colors.slate300,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    flex: 1,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
    marginBottom: Spacing.md,
  },
  replacementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  replacementInfo: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  replacementTitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  replacementProvider: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginVertical: 2,
  },
  replacementPrice: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  chooseBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  chooseBadgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
