import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  type RefreshControlProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';
import { EnterFade } from '../../constants/animations';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  centered?: boolean;
  /** Elemento <RefreshControl> para pull-to-refresh en modo scrollable. */
  refreshControl?: React.ReactElement<RefreshControlProps>;
  /**
   * Desactiva el `KeyboardAvoidingView` interno. El chat gestiona el teclado
   * al 100% con su propio KAV (`behavior` distinto en iOS/Android): dos
   * KAV anidados pelean entre si y tapan la barra de escritura.
   */
  avoidKeyboard?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = Colors.slate50,
  edges = ['top'],
  centered = false,
  refreshControl,
  avoidKeyboard = true,
}) => {
  const { padding, maxWidth } = useResponsive();

  const padded = { paddingHorizontal: padding };

  const body = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, padded, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, padded, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor }, style]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={avoidKeyboard}
        style={styles.keyboardView}
      >
        {/* Fundido de entrada del contenido: da sensacion de continuidad al
            navegar. Respeta "reducir movimiento" del sistema. */}
        <Animated.View entering={EnterFade} style={styles.fadeLayer}>
          {centered ? (
            <View style={[styles.centeredWrapper, { maxWidth }]}>{body}</View>
          ) : (
            body
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fadeLayer: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  centeredWrapper: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});