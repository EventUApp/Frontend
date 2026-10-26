import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventPlanItem } from '../../types';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { formatCurrency } from '../../utils/format';

interface QuoteSummaryProps {
  items: EventPlanItem[];
  subtotal: number;
  dateGenerated?: string;
  isContracted?: boolean;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  items,
  subtotal,
  dateGenerated = new Date().toISOString().split('T')[0],
  isContracted = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Date badge */}
      <View style={styles.headerRow}>
        <View style={styles.quoteBadge}>
          <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
          <Text style={styles.quoteBadgeText}>
            {isContracted ? 'PLAN CONTRATADO' : 'COTIZACIÓN ESTIMADA'}
          </Text>
        </View>
        <Text style={styles.dateText}>Generada: {dateGenerated}</Text>
      </View>

      {/* Itemized list */}
      <View style={styles.itemsTable}>
        {items.map((item, idx) => (
          <View
            key={item.id || idx}
            style={[
              styles.tableRow,
              idx === items.length - 1 && styles.tableRowLast,
            ]}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.serviceName}
              </Text>
              <Text style={styles.itemProvider} numberOfLines={1}>
                {item.providerName} • Cant: {item.quantity}
              </Text>
            </View>
            <Text style={styles.itemSubtotal}>
              {formatCurrency(item.subtotal)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals section */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.subtotalLabel}>Subtotal de servicios</Text>
          <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.subtotalLabel}>Comisión de plataforma (0%)</Text>
          <Text style={styles.freeFeeText}>¡Gratis en fase demo!</Text>
        </View>

        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>
            {isContracted ? 'Precio Contratado' : 'Total Estimado'}
          </Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(subtotal)}</Text>
        </View>
      </View>

      {/* Warning Alert */}
      <View
        style={[
          styles.noticeBox,
          isContracted && styles.contractedNoticeBox,
        ]}
      >
        <Ionicons
          name={isContracted ? 'shield-checkmark' : 'alert-circle-outline'}
          size={18}
          color={isContracted ? Colors.success : Colors.accent}
        />
        <Text
          style={[
            styles.noticeText,
            isContracted && styles.contractedNoticeText,
          ]}
        >
          {isContracted
            ? '¡Precios congelados! Este plan ya se encuentra formalizado y garantiza las tarifas acordadas.'
            : 'Los precios pueden cambiar hasta que el plan sea confirmado y contratado formalmente.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },
  quoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteBadgeText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  itemsTable: {
    marginBottom: Spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  itemInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  itemName: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate900,
  },
  itemProvider: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
  },
  totalsSection: {
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtotalLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
  },
  subtotalValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate800,
  },
  freeFeeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    fontWeight: Typography.weights.bold,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
    paddingTop: Spacing.sm,
    marginTop: 4,
    marginBottom: 0,
  },
  grandTotalLabel: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  grandTotalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  contractedNoticeBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  noticeText: {
    fontSize: Typography.sizes.xs,
    color: '#92400E',
    marginLeft: Spacing.xs + 2,
    flex: 1,
    lineHeight: 16,
  },
  contractedNoticeText: {
    color: '#065F46',
  },
});
