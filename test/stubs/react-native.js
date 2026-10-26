/**
 * Stub de react-native para vitest.
 *
 * El paquete real está escrito en Flow y no puede parsearse con
 * rolldown/vite. Solo se expone lo que el código bajo prueba necesita.
 * Este archivo NO es una emulación fiel de react-native: sirve para probar
 * lógica pura. Para pruebas de componentes usa el preset oficial de
 * react-native o @testing-library/react-native.
 */

export const useWindowDimensions = () => ({ width: 390, height: 844, scale: 3, fontScale: 1 });
export const useColorScheme = () => 'light';

export const Platform = {
  OS: 'ios',
  select: (options) => options.ios ?? options.default,
};

export const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hairlineWidth: 1,
};

export const Dimensions = {
  get: () => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
};

export const View = 'View';
export const Text = 'Text';
export const ScrollView = 'ScrollView';
export const FlatList = 'FlatList';
export const Pressable = 'Pressable';
export const TouchableOpacity = 'TouchableOpacity';
export const ActivityIndicator = 'ActivityIndicator';
export const AccessibilityInfo = {
  isReduceMotionEnabled: () => Promise.resolve(false),
  isScreenReaderEnabled: () => Promise.resolve(false),
};
export const KeyboardAvoidingView = 'KeyboardAvoidingView';
export const Modal = 'Modal';
export const Image = 'Image';
export const TextInput = 'TextInput';

export default {
  View,
  Text,
  Platform,
  StyleSheet,
};