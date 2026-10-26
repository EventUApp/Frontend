import React, { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { AppButton } from '../ui/AppButton';
import { SheetInput } from './SheetInput';

const GUEST_SIZE_OPTIONS = [
  { label: 'Mini (10-50)', value: '30' },
  { label: 'Mediano (50-100)', value: '75' },
  { label: 'Grande (+100)', value: '150' },
];

interface EditDetailsSheetProps {
  snapPoints: string[];
  backdropComponent: React.FC<BottomSheetBackdropProps>;
  eventName: string;
  onEventNameChange: (value: string) => void;
  eventDate: string;
  onEventDateChange: (value: string) => void;
  eventLocation: string;
  onEventLocationChange: (value: string) => void;
  guestCount: string;
  onGuestCountChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

/** Sheet de edición de datos del evento (formulario compacto). */
export const EditDetailsSheet = forwardRef<BottomSheetModal, EditDetailsSheetProps>(
  function EditDetailsSheet(
    {
      snapPoints,
      backdropComponent,
      eventName,
      onEventNameChange,
      eventDate,
      onEventDateChange,
      eventLocation,
      onEventLocationChange,
      guestCount,
      onGuestCountChange,
      onSave,
      onClose,
    },
    ref
  ) {
    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={backdropComponent}
        android_keyboardInputMode="adjustResize"
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cualquier toque en el contenido cierra el teclado nativo
              (los botones conservan sus propios onPress). */}
          <View onTouchStart={Keyboard.dismiss}>
              <View style={styles.header}>
                <Text style={styles.title}>Editar Datos del Evento</Text>
                <TouchableOpacity
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar edición del evento"
                >
                  <Ionicons name="close-circle" size={26} color={Colors.slate400} />
                </TouchableOpacity>
              </View>

              <SheetInput
                label="Nombre del evento"
                value={eventName}
                onChangeText={onEventNameChange}
                placeholder="Ej: Primera Comunión Sofía"
              />

              {/* Secundario agrupado: invitados por tamaño rápido. */}
              <View style={styles.secondaryGroup}>
                <Text style={styles.secondaryTitle}>DETALLES ADICIONALES (OPCIONAL)</Text>
                <SheetInput
                  label="Fecha estimada"
                  value={eventDate}
                  onChangeText={onEventDateChange}
                  placeholder="AAAA-MM-DD"
                />
                <SheetInput
                  label="Ubicación o ciudad"
                  value={eventLocation}
                  onChangeText={onEventLocationChange}
                  placeholder="Ej: Cali / Medellín / Bogotá"
                />
                <Text style={styles.secondaryLabel}>Tamaño del evento</Text>
                <View style={styles.guestRow}>
                  {GUEST_SIZE_OPTIONS.map((opt) => {
                    const isSelected = guestCount === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.guestChip, isSelected && styles.guestChipActive]}
                        onPress={() => onGuestCountChange(opt.value)}
                        accessibilityRole="radio"
                        accessibilityLabel={`${opt.label} invitados`}
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text style={[styles.guestChipText, isSelected && styles.guestChipTextActive]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {!GUEST_SIZE_OPTIONS.some((opt) => opt.value === guestCount) && (
                  <Text style={styles.guestHint}>
                    Actualmente: {guestCount || '—'} invitados. Toca un tamaño para ajustar.
                  </Text>
                )}
              </View>

              <AppButton
                title="Guardar cambios"
                variant="primary"
                size="lg"
                icon="checkmark-circle-outline"
                onPress={onSave}
                style={styles.saveBtn}
              />
          </View>
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
  secondaryGroup: {
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.slate200,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  secondaryTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate500,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  secondaryLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate700,
    marginBottom: Spacing.xs,
  },
  guestRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  guestChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minHeight: 44,
    justifyContent: 'center',
  },
  guestChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  guestChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  guestChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  guestHint: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: Spacing.xs,
  },
  saveBtn: {
    marginTop: Spacing.lg,
    width: '100%',
  },
});
