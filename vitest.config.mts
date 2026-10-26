import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * El código fuente de react-native está escrito en Flow, que vitest/rolldown
 * no puede parsear. Para poder probar módulos que importan de 'react-native'
 * (hooks, componentes) lo sustituimos por este stub.
 *
 * Cuando se añadan pruebas de render (@testing-library/react-native), este
 * stub debe reemplazarse por el preset oficial de react-native.
 */
const reactNativeStub = `
const notImplemented = (name) => () => {
  throw new Error('react-native stub: ' + name + ' no está implementado en tests');
};

export const useWindowDimensions = () => ({ width: 390, height: 844, scale: 3, fontScale: 1 });
export const useColorScheme = () => 'light';
export const Platform = { OS: 'ios', select: (o) => o.ios ?? o.default };
export const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hairlineWidth: 1,
};
export const Dimensions = { get: () => ({ width: 390, height: 844, scale: 3, fontScale: 1 }) };

export const View = 'View';
export const Text = 'Text';
export const ScrollView = 'ScrollView';
export const Pressable = 'Pressable';
export const TouchableOpacity = 'TouchableOpacity';
export const ActivityIndicator = 'ActivityIndicator';

export const KeyboardAvoidingView = 'KeyboardAvoidingView';
export const Modal = 'Modal';
export const Image = 'Image';
export const TextInput = 'TextInput';

const React = { forwardRef: (c) => c };
export default { View, Text, Platform, StyleSheet };
`;

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        // fileURLToPath, no .pathname: el directorio del proyecto contiene
        // acentos y espacios, y .pathname los percent-encoda.
        replacement: fileURLToPath(new URL('./test/stubs/react-native.js', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/store/**', 'src/utils/**', 'src/hooks/**', 'src/constants/**'],
    },
  },
  define: {
    __DEV__: 'true',
  },
});