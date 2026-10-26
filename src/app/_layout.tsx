import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';
import { MotionDuration } from '../constants/motion';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      {/* Requerido por react-native-gesture-handler y @gorhom/bottom-sheet:
          sin este envoltorio los gestos de arrastre no responden. */}
      <GestureHandlerRootView style={styles.gestureRoot}>
        <BottomSheetModalProvider>
      <StatusBar style="dark" />
      <NavigationBar style="dark" />
      <View style={styles.root}>
        {/* Sin `animation` global: cada familia de pantalla usa la que le
            corresponde. Con un unico `slide_from_right` global, abrir el
            login (que es un modal) hacia un lateral y cambiar de tab
            animaban igual, y en iOS el gesto de volver peleaba con la
            transicion. Expo Router no expone `Stack.Group`, asi que la
            transicion se declara en cada `Stack.Screen`. */}
        <Stack
          screenOptions={{
            headerShown: false,
            // Config translúcida iOS lista para cuando se active un header
            // nativo en alguna pantalla: hoy es inerte porque los headers
            // son custom (headerShown: false en todo el stack).
            headerTransparent: true,
            headerBackground: () => (
              <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            ),
            animationDuration: MotionDuration.push,
          }}
        >
          {/* Tabs: el tab navigator ya comunica el cambio de contexto. */}
          <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />

          {/* Detalle: empuje horizontal, conserva el gesto de volver de iOS. */}
          <Stack.Screen name="plan/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="service/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="provider/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="quote/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="event/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="claims/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="checkout/[id]" options={{ animation: 'slide_from_right' }} />

          {/* Listados y formularios: aparece sin desplazamiento lateral,
              el origen ya esta en pantalla y deslizar engaña. */}
          <Stack.Screen
            name="create-event/index"
            options={{ animation: 'fade', animationDuration: MotionDuration.fade }}
          />
          <Stack.Screen
            name="events/index"
            options={{ animation: 'fade', animationDuration: MotionDuration.fade }}
          />
          <Stack.Screen
            name="claims/index"
            options={{ animation: 'fade', animationDuration: MotionDuration.fade }}
          />

          {/* Formularios y modales: entran desde abajo. */}
          <Stack.Screen
            name="claims/create"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: MotionDuration.modal,
            }}
          />
          <Stack.Screen
            name="provider-portal/service-edit"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: MotionDuration.modal,
            }}
          />
          <Stack.Screen
            name="provider-portal/update-price"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: MotionDuration.modal,
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: MotionDuration.modal,
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: MotionDuration.modal,
            }}
          />
          <Stack.Screen
            name="auth/forgot-password"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: MotionDuration.modal,
            }}
          />
        </Stack>
      </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
