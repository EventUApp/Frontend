import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import {
  ScreenContainer,
  AppInput,
  PasswordInput,
  AppButton,
} from '../../components';

export default function RegisterScreen() {
  const { switchRole, setUser } = useAppStore();

  const [accountType, setAccountType] = useState<'client' | 'provider'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Salto con Enter: Nombre -> Correo -> Contraseña -> registro.
  const nameRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const emailRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Campos obligatorios', 'Por favor completa todos los campos para crear tu cuenta.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Términos no aceptados', 'Debes aceptar los Términos de Servicio para continuar.');
      return;
    }

    // Sin celular: se pide después en "Completa tu perfil" para un
    // registro de menos de 10 segundos.
    setUser({
      name,
      email,
      role: accountType,
    });

    switchRole(accountType);

    Alert.alert(
      '¡Registro Exitoso!',
      `Bienvenido a EventMarket como ${accountType === 'client' ? 'Cliente' : 'Proveedor'}.`,
      [
        {
          text: 'Continuar',
          onPress: () => {
            if (accountType === 'provider') {
              router.replace('/provider-dashboard');
            } else {
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable backgroundColor={Colors.white}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.slate700} />
        </TouchableOpacity>

        <Text style={styles.title}>Crear una Cuenta</Text>
        <Text style={styles.subtitle}>
          Únete al marketplace líder en organización y contratación de eventos
        </Text>

        {/* Account Type Selector */}
        <Text style={styles.typeLabel}>Selecciona tu perfil:</Text>
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[
              styles.typeCard,
              accountType === 'client' && styles.typeCardActive,
            ]}
            onPress={() => setAccountType('client')}
          >
            <Ionicons
              name="person"
              size={24}
              color={accountType === 'client' ? Colors.primary : Colors.slate400}
            />
            <Text
              style={[
                styles.typeTitle,
                accountType === 'client' && styles.typeTitleActive,
              ]}
            >
              Soy Cliente
            </Text>
            <Text style={styles.typeDesc}>Quiero cotizar y organizar mi evento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeCard,
              accountType === 'provider' && styles.typeCardActive,
            ]}
            onPress={() => setAccountType('provider')}
          >
            <Ionicons
              name="briefcase"
              size={24}
              color={accountType === 'provider' ? Colors.secondary : Colors.slate400}
            />
            <Text
              style={[
                styles.typeTitle,
                accountType === 'provider' && styles.typeTitleActive,
              ]}
            >
              Soy Proveedor
            </Text>
            <Text style={styles.typeDesc}>Quiero ofrecer mis servicios y vender</Text>
          </TouchableOpacity>
        </View>

        {/* Form fields (sin celular: va en "Completa tu perfil") */}
        <AppInput
          label={accountType === 'client' ? 'Nombre completo' : 'Nombre de la empresa o marca'}
          required
          value={name}
          onChangeText={setName}
          placeholder={accountType === 'client' ? 'Juan Carlos Cruz' : 'Eventos del Valle S.A.S'}
          leftIcon="person-outline"
          returnKeyType="next"
          blurOnSubmit={false}
          inputRef={nameRef}
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <AppInput
          label="Correo electrónico"
          required
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="tu@correo.com"
          leftIcon="mail-outline"
          returnKeyType="next"
          blurOnSubmit={false}
          inputRef={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <PasswordInput
          label="Crea una contraseña"
          required
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          leftIcon="lock-closed-outline"
          returnKeyType="done"
          inputRef={passwordRef}
          onSubmitEditing={handleRegister}
        />

        {/* Terms checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <Ionicons
            name={acceptedTerms ? 'checkbox' : 'square-outline'}
            size={20}
            color={acceptedTerms ? Colors.primary : Colors.slate400}
          />
          <Text style={styles.termsText}>
            Acepto los Términos de Servicio y la Política de Protección de Datos.
          </Text>
        </TouchableOpacity>

        <AppButton
          title="Crear mi cuenta"
          size="lg"
          variant="primary"
          onPress={handleRegister}
          style={{ marginTop: Spacing.md }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
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
  typeLabel: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
    marginBottom: Spacing.xs,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  typeCard: {
    width: '48%',
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.slate200,
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  typeTitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    marginTop: 6,
  },
  typeTitleActive: {
    color: Colors.primaryDark,
  },
  typeDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  termsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  loginLink: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
