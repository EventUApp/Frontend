import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { ScreenContainer, AppInput, AppButton } from '../../components';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert('Correo requerido', 'Ingresa tu correo para recibir el enlace.');
      return;
    }
    setSent(true);
  };

  return (
    <ScreenContainer scrollable backgroundColor={Colors.white}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.slate700} />
        </TouchableOpacity>

        <View style={styles.iconBox}>
          <Ionicons name="key-outline" size={32} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones de restablecimiento.
        </Text>

        {sent ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <Text style={styles.successTitle}>Enlace Enviado</Text>
            <Text style={styles.successText}>
              Hemos enviado un enlace de recuperación simulado a <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Revisa tu bandeja de entrada o spam.
            </Text>

            <AppButton
              title="Volver al Login"
              onPress={() => router.replace('/auth/login')}
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <AppInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="tu@correo.com"
              leftIcon="mail-outline"
            />

            <AppButton
              title="Enviar Instrucciones"
              size="lg"
              variant="primary"
              onPress={handleSend}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  form: {
    marginTop: Spacing.sm,
  },
  successBox: {
    backgroundColor: '#ECFDF5',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: Spacing.md,
  },
  successTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginVertical: 4,
  },
  successText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    textAlign: 'center',
    lineHeight: 18,
  },
});
