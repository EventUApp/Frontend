import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { PriceTag } from '../ui/PriceTag';
import { Rating } from '../ui/Rating';
import { AppButton } from '../ui/AppButton';
import { Service } from '../../types';

interface CompareModalProps {
  visible: boolean;
  items: Service[];
  onClose: () => void;
  onClear: () => void;
  onToggleItem: (service: Service) => void;
  onChoose: (service: Service) => void;
}

/** Comparativa lado a lado de hasta 2 servicios. */
export const CompareModal: React.FC<CompareModalProps> = ({
  visible,
  items,
  onClose,
  onClear,
  onToggleItem,
  onChoose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Comparación de Servicios</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={onClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Limpiar comparativa"
            >
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar comparación"
            >
              <Ionicons name="close-circle" size={28} color={Colors.slate400} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.body}>
          {items.length < 2 ? (
            <View style={styles.empty}>
              <Ionicons name="information-circle-outline" size={40} color={Colors.primary} />
              <Text style={styles.emptyText}>
                Selecciona al menos 2 servicios del catálogo para compararlos lado a lado.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {items.map((item) => (
                <View key={item.id} style={styles.col}>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => onToggleItem(item)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar ${item.name} de la comparación`}
                  >
                    <Ionicons name="close-circle-outline" size={20} color={Colors.slate400} />
                  </TouchableOpacity>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.provider}>{item.providerName}</Text>
                  <PriceTag price={item.price} size="lg" unit={item.priceUnit} />
                  <Rating score={item.rating} count={item.reviewCount} />

                  <View style={styles.section}>
                    <Text style={styles.secTitle}>Incluye:</Text>
                    {item.includes.map((inc, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {inc}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.secTitle}>Ubicación:</Text>
                    <Text style={styles.bullet}>{item.location}</Text>
                  </View>

                  <AppButton
                    title="Elegir este"
                    size="sm"
                    onPress={() => onChoose(item)}
                    style={styles.chooseBtn}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.slate50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  clearText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.danger,
    paddingVertical: Spacing.sm,
  },
  body: {
    flex: 1,
    padding: Spacing.lg,
  },
  empty: {
    alignItems: 'center',
    padding: Spacing.huge,
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    color: Colors.slate600,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  removeBtn: {
    alignSelf: 'flex-end',
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -Spacing.sm,
    marginRight: -Spacing.sm,
  },
  itemName: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 2,
  },
  provider: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  section: {
    marginTop: Spacing.md,
  },
  secTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
    marginBottom: 4,
  },
  bullet: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginBottom: 2,
  },
  chooseBtn: {
    marginTop: Spacing.md,
  },
});
