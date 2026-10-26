import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import {
  ScreenContainer,
  AppInput,
  PasswordInput,
  AppButton,
} from '../../components';
import { useResponsive } from '../../hooks/useResponsive';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { switchRole } = useAppStore();
  const { isSmall } = useResponsive();

  const [selectedRole, setSelectedRole] = useState<'client' | 'provider'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      Alert.alert('Correo inválido', 'Revisa el formato del correo electrónico.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (selectedRole === 'provider') {
        switchRole('provider');
        router.replace('/provider-dashboard');
      } else {
        switchRole('client');
        router.replace('/');
      }
    }, 450);
  };

  const handleDemoClient = () => {
    switchRole('client');
    router.replace('/');
  };

  const handleDemoProvider = () => {
    switchRole('provider');
    router.replace('/provider-dashboard');
  };

  const handleExploreGuest = () => {
    switchRole('guest');
    router.replace('/');
  };

  return (
    <ScreenContainer scrollable backgroundColor={Colors.white}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cerrar inicio de sesión"
          >
            <Ionicons name="close" size={24} color={Colors.slate700} />
          </TouchableOpacity>

          {/* Logo y cabecera */}
          <View style={styles.header}>
            <LinearGradient
              colors={Colors.brandGradient as unknown as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Ionicons name="sparkles" size={isSmall ? 28 : 32} color={Colors.onPrimary} />
            </LinearGradient>
            <Text
              style={[
                styles.appTitle,
                {
                  fontSize: isSmall ? Typography.sizes.xxl : Typography.sizes.title,
                  lineHeight: isSmall ? Typography.lineHeights.xxl : Typography.lineHeights.title,
                },
              ]}
            >
              EventMarket
            </Text>
            <Text style={styles.tagline}>
              La plataforma para planear, cotizar y contratar eventos inolvidables
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Segmented Role Selector */}
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleOption, selectedRole === 'client' && styles.roleOptionActive]}
                onPress={() => setSelectedRole('client')}
                accessibilityRole="button"
                accessibilityLabel="Ingresar como Cliente"
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={selectedRole === 'client' ? Colors.white : Colors.slate600}
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    selectedRole === 'client' && styles.roleOptionTextActive,
                  ]}
                >
                  Soy Cliente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, selectedRole === 'provider' && styles.roleOptionActive]}
                onPress={() => setSelectedRole('provider')}
                accessibilityRole="button"
                accessibilityLabel="Ingresar como Proveedor"
              >
                <Ionicons
                  name="briefcase"
                  size={16}
                  color={selectedRole === 'provider' ? Colors.white : Colors.slate600}
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    selectedRole === 'provider' && styles.roleOptionTextActive,
                  ]}
                >
                  Soy Proveedor
                </Text>
              </TouchableOpacity>
            </View>

            <AppInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder={selectedRole === 'provider' ? 'contacto@fotostudioabc.com' : 'tu@correo.com'}
              leftIcon="mail-outline"
            />

            <PasswordInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              leftIcon="lock-closed-outline"
            />

            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => router.push('/auth/forgot-password')}
              accessibilityRole="button"
              accessibilityLabel="¿Olvidaste tu contraseña?"
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <AppButton
              title={selectedRole === 'provider' ? 'Ingresar como Proveedor' : 'Ingresar como Cliente'}
              size="lg"
              variant="primary"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: Spacing.md }}
            />

            {/* Quick Demo Access Options */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>ACCESOS DIRECTOS</Text>

              <TouchableOpacity
                style={styles.demoBtn}
                onPress={handleDemoClient}
                accessibilityRole="button"
                accessibilityLabel="Entrar como cliente Juan Carlos Cruz"
              >
                <View style={styles.demoIconBox}>
                  <Ionicons name="person" size={18} color={Colors.primary} />
                </View>
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoBtnTitle}>Entrar como Cliente</Text>
                  <Text style={styles.demoBtnSub}>Juan Carlos Cruz (Organizador)</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.slate400} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtn}
                onPress={handleDemoProvider}
                accessibilityRole="button"
                accessibilityLabel="Entrar como proveedor Foto Studio ABC"
              >
                <View style={styles.demoIconBox}>
                  <Ionicons name="briefcase" size={18} color={Colors.secondary} />
                </View>
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoBtnTitle}>Entrar como Proveedor</Text>
                  <Text style={styles.demoBtnSub}>Foto Studio ABC (Servicios & Contratos)</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.slate400} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtn}
                onPress={handleExploreGuest}
                accessibilityRole="button"
                accessibilityLabel="Explorar sin cuenta en modo invitado"
              >
                <View style={styles.demoIconBox}>
                  <Ionicons name="eye-outline" size={18} color={Colors.slate600} />
                </View>
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoBtnTitle}>Explorar sin cuenta</Text>
                  <Text style={styles.demoBtnSub}>Modo invitado</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.slate400} />
              </TouchableOpacity>
            </View>

            {/* Sign Up Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿No tienes una cuenta aún? </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/register')}
                accessibilityRole="button"
                accessibilityLabel="Regístrate aquí"
              >
                <Text style={styles.signUpLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  appTitle: {
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
  },
  tagline: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    color: Colors.slate500,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 4,
  },
  form: {
    marginTop: Spacing.md,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.slate100,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  roleOptionActive: {
    backgroundColor: Colors.primary,
  },
  roleOptionText: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
    fontWeight: Typography.weights.semibold,
  },
  roleOptionTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.sm,
  },
  forgotText: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  demoBox: {
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginTop: Spacing.xl,
  },
  demoTitle: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    textAlign: 'center',
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    minHeight: 56,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  demoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTextCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  demoBtnTitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate900,
  },
  demoBtnSub: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    color: Colors.slate500,
  },
  signUpLink: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
