import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import { ScreenContainer, AppHeader, StatusBadge, AppButton, EmptyState } from '../../components';

export default function ClaimDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { claims, addClaimResponse, updateClaimStatus, currentUser } = useAppStore();

  const [responseText, setResponseText] = useState('');

  const claim = claims.find((c) => c.id === id);
  const isProvider = currentUser.role === 'provider';

  if (!claim) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Reclamo no encontrado" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Reclamo no encontrado"
          description="El reclamo que buscas no existe o ha sido archivado."
          actionTitle="Volver a Reclamos"
          onActionPress={() => router.replace('/claims')}
        />
      </ScreenContainer>
    );
  }

  const handleSendResponse = () => {
    if (!responseText.trim()) return;
    addClaimResponse(claim.id, responseText.trim());
    setResponseText('');
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title={`Reclamo #${claim.id.replace('clm-', '')}`}
        subtitle={claim.serviceName}
        showBack
      />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Claim Header Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.eventName}>{claim.eventName}</Text>
                <Text style={styles.serviceText}>{claim.serviceName}</Text>
                <Text style={styles.providerText}>Proveedor: {claim.providerName}</Text>
              </View>
              <StatusBadge status={claim.status} type="claim" />
            </View>

            <Text style={styles.reasonTitle}>Motivo: {claim.reason}</Text>
            <Text style={styles.descriptionText}>{claim.description}</Text>

            {/* Evidence Previews */}
            {claim.evidenceUrls.length > 0 && (
              <View style={styles.evidenceSection}>
                <Text style={styles.evidenceLabel}>Evidencias Adjuntas:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {claim.evidenceUrls.map((url, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: url }}
                      style={styles.evidenceImage}
                      contentFit="cover"
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.dateFooter}>Radicado el {claim.createdAt}</Text>
          </View>

          {/* Provider Controls (if provider mode, can update status) */}
          {isProvider && (
            <View style={styles.providerControlsCard}>
              <Text style={styles.providerControlsTitle}>Acciones de Proveedor</Text>
              <View style={styles.statusButtonsRow}>
                <AppButton
                  title="Aceptar y Resolver"
                  size="sm"
                  variant="success"
                  onPress={() => updateClaimStatus(claim.id, 'resolved')}
                  style={{ flex: 1, marginRight: Spacing.xs }}
                />
                <AppButton
                  title="Rechazar Reclamo"
                  size="sm"
                  variant="danger"
                  onPress={() => updateClaimStatus(claim.id, 'rejected')}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}

          {/* Responses Thread */}
          <Text style={styles.responsesHeading}>
            Historial de Respuestas y Mediación ({claim.responses.length})
          </Text>

          {claim.responses.map((resp) => {
            const isSenderClient = resp.senderRole === 'client';
            const isSenderAdmin = resp.senderRole === 'admin';

            return (
              <View
                key={resp.id}
                style={[
                  styles.responseBubble,
                  isSenderAdmin && styles.adminBubble,
                ]}
              >
                <View style={styles.responseHeader}>
                  <View style={styles.senderBadge}>
                    <Text style={styles.senderName}>{resp.senderName}</Text>
                    <Text style={styles.senderRoleTag}>
                      ({isSenderAdmin ? 'Soporte Plataforma' : resp.senderRole === 'provider' ? 'Proveedor' : 'Cliente'})
                    </Text>
                  </View>
                  <Text style={styles.responseTime}>{resp.timestamp}</Text>
                </View>

                <Text style={styles.responseText}>{resp.text}</Text>
              </View>
            );
          })}

          {/* Reply Input Box */}
          {claim.status !== 'resolved' && claim.status !== 'rejected' && (
            <View style={styles.replyBox}>
              <Text style={styles.replyBoxTitle}>
                {isProvider ? 'Responder como Proveedor:' : 'Agregar comentario adicional:'}
              </Text>

              <TextInput
                style={styles.replyInput}
                value={responseText}
                onChangeText={setResponseText}
                placeholder="Escribe tu descargo o propuesta de solución..."
                placeholderTextColor={Colors.slate400}
                multiline
              />

              <AppButton
                title="Enviar Respuesta"
                icon="send"
                size="sm"
                onPress={handleSendResponse}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          )}
        </ScrollView>
      </ScreenContainer>
    );
  }

  const styles = StyleSheet.create({
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: SCROLL_BOTTOM_PADDING,
    },
    card: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.slate200,
      marginBottom: Spacing.md,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    eventName: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      fontWeight: Typography.weights.extrabold,
      color: Colors.slate900,
    },
    serviceText: {
      fontSize: Typography.sizes.xs,
      color: Colors.primaryDark,
      fontWeight: Typography.weights.semibold,
      marginVertical: 2,
    },
    providerText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
    },
    reasonTitle: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      fontWeight: Typography.weights.bold,
      color: Colors.slate900,
      marginVertical: Spacing.xs,
    },
    descriptionText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate600,
      lineHeight: 18,
    },
    evidenceSection: {
      marginTop: Spacing.md,
    },
    evidenceLabel: {
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.bold,
      color: Colors.slate700,
      marginBottom: 6,
    },
    evidenceImage: {
      width: 120,
      height: 80,
      borderRadius: BorderRadius.md,
      marginRight: Spacing.sm,
      backgroundColor: Colors.slate200,
    },
    dateFooter: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate400,
      marginTop: Spacing.md,
    },
    providerControlsCard: {
      backgroundColor: '#FEF3C7',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: '#FDE68A',
    },
    providerControlsTitle: {
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.bold,
      color: '#92400E',
      marginBottom: Spacing.sm,
    },
    statusButtonsRow: {
      flexDirection: 'row',
    },
    responsesHeading: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      fontWeight: Typography.weights.bold,
      color: Colors.slate800,
      marginBottom: Spacing.sm,
      marginTop: Spacing.xs,
    },
    responseBubble: {
      backgroundColor: Colors.white,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.slate200,
    },
    adminBubble: {
      backgroundColor: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
    responseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    senderBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    senderName: {
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.bold,
      color: Colors.slate900,
    },
    senderRoleTag: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate500,
      marginLeft: 4,
    },
    responseTime: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate400,
    },
    responseText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate700,
      lineHeight: 18,
    },
    replyBox: {
      backgroundColor: Colors.white,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.slate200,
      marginTop: Spacing.sm,
    },
    replyBoxTitle: {
      fontSize: Typography.sizes.xs,
      fontWeight: Typography.weights.semibold,
      color: Colors.slate700,
      marginBottom: Spacing.xs,
    },
    replyInput: {
      backgroundColor: Colors.slate50,
      borderWidth: 1,
      borderColor: Colors.slate200,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
      fontSize: Typography.sizes.xs,
      color: Colors.slate900,
      minHeight: 70,
      textAlignVertical: 'top',
    },
  });
