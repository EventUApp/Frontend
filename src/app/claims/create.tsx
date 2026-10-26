import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  AppInput,
  AppButton,
  EmptyState,
} from '../../components';

export default function CreateClaimScreen() {
  const { eventId, serviceId } = useLocalSearchParams<{
    eventId?: string;
    serviceId?: string;
  }>();

  const { events, createClaim } = useAppStore();

  // Pick only contracted events
  const contractedEvents = events.filter(
    (e) => e.status === 'confirmed' || e.status === 'in_progress'
  );

  const activeEvent =
    contractedEvents.find((e) => e.id === eventId) || contractedEvents[0];

  const availableServices = activeEvent?.services || [];
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    serviceId || (availableServices[0]?.serviceId || '')
  );

  const selectedService =
    availableServices.find((s) => s.serviceId === selectedServiceId) ||
    availableServices[0];

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  if (!activeEvent) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader
          title="Radicar Reclamo"
          subtitle="Garantía de cumplimiento del servicio"
          showBack
        />
        <EmptyState
          icon="shield-outline"
          title="Sin servicios contratados"
          description="Para radicar un reclamo con respaldo de garantía, debes tener al menos un evento contratado y confirmado con nuestros proveedores."
          actionTitle="Explorar Mis Eventos"
          onActionPress={() => router.push('/events')}
        />
      </ScreenContainer>
    );
  }

  const handleSubmit = () => {
    if (!reason.trim() || !description.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa el motivo y la descripción del reclamo.');
      return;
    }

    if (!selectedService) {
      Alert.alert('Sin servicio', 'No hay un servicio válido seleccionado para radicar el reclamo.');
      return;
    }

    createClaim({
      eventId: activeEvent.id,
      eventName: activeEvent.name,
      serviceId: selectedService?.serviceId || 'srv-unknown',
      serviceName: selectedService?.serviceName || 'Servicio Contratado',
      providerId: selectedService?.providerId || 'prov-1',
      providerName: selectedService?.providerName || 'Proveedor',
      reason,
      description,
      evidenceUrls: evidenceUploaded
        ? ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80']
        : [],
    });

    Alert.alert(
      'Reclamo Radicado',
      'Tu caso ha sido registrado con estado Abierto y el proveedor tiene 48 horas para responder.',
      [{ text: 'Aceptar', onPress: () => router.replace('/claims') }]
    );
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader
          title="Radicar Reclamo"
          subtitle="Garantía de cumplimiento del servicio"
          showBack
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Notice Info */}
          <View style={styles.infoAlert}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />

          <Text style={styles.infoAlertText}>
            Solo puedes radicar reclamos sobre servicios previamente contratados y confirmados. La plataforma media el proceso.
          </Text>
        </View>

        {/* Event & Service Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Evento Asociado</Text>
          <View style={styles.readonlyBox}>
            <Text style={styles.readonlyTitle}>{activeEvent.name}</Text>
            <Text style={styles.readonlySub}>
              {activeEvent.typeName} • Fecha: {activeEvent.date}
            </Text>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>
            Servicio Objeto del Reclamo
          </Text>

          {availableServices.map((s) => {
            const isSelected = selectedService?.serviceId === s.serviceId;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.serviceOption, isSelected && styles.serviceOptionActive]}
                onPress={() => setSelectedServiceId(s.serviceId)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{s.serviceName}</Text>
                  <Text style={styles.providerName}>Proveedor: {s.providerName}</Text>
                </View>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? Colors.primary : Colors.slate300}
                />
              </TouchableOpacity>
            );
          })}

          {/* Reason & Description Inputs */}
          <AppInput
            label="Motivo del Reclamo"
            required
            value={reason}
            onChangeText={setReason}
            placeholder="Ej: Inasistencia, retraso de 3 horas, faltante de fotos"
            containerStyle={{ marginTop: Spacing.md }}
          />

          <AppInput
            label="Descripción detallada de los hechos"
            required
            value={description}
            onChangeText={setDescription}
            placeholder="Detalla lo sucedido con fechas, horas y afectaciones para que el equipo de soporte evalúe el caso..."
            multiline
            numberOfLines={4}
            style={{ height: 90, textAlignVertical: 'top' }}
          />

          {/* Evidence Upload Mock */}
          <Text style={styles.sectionLabel}>Evidencias (Fotos, chats o facturas)</Text>
          <TouchableOpacity
            style={[styles.uploadBox, evidenceUploaded && styles.uploadBoxDone]}
            onPress={() => setEvidenceUploaded(!evidenceUploaded)}
          >
            <Ionicons
              name={evidenceUploaded ? 'document-attach' : 'cloud-upload-outline'}
              size={28}
              color={evidenceUploaded ? Colors.success : Colors.primary}
            />
            <Text style={styles.uploadText}>
              {evidenceUploaded
                ? '✓ 1 evidencia mock adjunta (Captura_Incumplimiento.jpg)'
                : 'Toca para adjuntar fotos o capturas de evidencia'}
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Radicar Reclamo Formal"
            icon="paper-plane-outline"
            size="lg"
            variant="danger"
            onPress={handleSubmit}
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  infoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  infoAlertText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  formSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginBottom: Spacing.xs,
  },
  readonlyBox: {
    backgroundColor: Colors.slate50,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  readonlyTitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  readonlySub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
    marginBottom: Spacing.xs + 2,
  },
  serviceOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FAF5FF',
  },
  serviceName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  providerName: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  uploadBoxDone: {
    borderColor: Colors.success,
    backgroundColor: '#ECFDF5',
  },
  uploadText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
});
