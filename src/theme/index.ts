/**
 * Paleta de marca.
 *
* Direccion: violeta profundo como color primario (confianza y criterio
 * profesional) acompañado por un coral calido en el secundario (alegria,
 * celebracion, invitacion). Los neutras llevan un matiz violeta muy sutil
 * para que el conjunto se sienta calido en lugar del gris azulado frio que
 * da el aspecto de plantilla.
 *
 * Regla de los colores de estado: cada estado tiene TRES tonos con
 * funciones distintas, no uno solo:
 *   - `*`        relleno de marca (badge, icono, borde grueso)
 *   - `*Light`   fondo del badge
 *   - `*Text`    TEXTO sobre ese fondo claro
 *
 * Antes se usaba el color saturado como texto sobre su propio fondo claro
 * y el resultado era 1.9:1 de contraste, muy por debajo del 4.5:1 que pide
 * WCAG AA para texto pequeno. `*Text` resuelve eso; los tests de contraste
 * en `__tests__/color-contrast.test.ts` lo verifican.
 */
export const Colors = {
  // Marca primaria
  primary: '#5A4BEA',
  primaryDark: '#4234C9',
  primaryLight: '#EFECFE',
  primaryBorder: '#DAD3FB',

  // Secundario: coral calido, celebracion.
  // `#D63E50` es el tono mas claro que mantiene 4.5:1 con texto blanco
  // (WCAG AA); el coral original `#F2626B` se quedaba en 3.12:1.
  secondary: '#D63E50',
  secondaryDark: '#A82C3C',
  secondaryLight: '#FFF0F1',

  // Acento: dorado para precios y montos destacados
  accent: '#F5A524',
  accentDark: '#A16207',
  accentLight: '#FFF6E5',
  accentBorder: '#F7DFA8',

  // Estados: relleno / fondo / texto
  success: '#12B981',
  successLight: '#E9FBF3',
  successText: '#047857',
  successBorder: '#A7E8CF',

  warning: '#F59E0B',
  warningLight: '#FFF8E7',
  warningText: '#B45309',
  warningBorder: '#FBE0A6',

  // `#D93A2E` mantiene 4.5:1 con blanco; el rojo anterior `#F04438`
  // se quedaba en 3.76:1 y no cumplia AA como fondo de boton.
  danger: '#D93A2E',
  dangerLight: '#FEF0EF',
  dangerText: '#B42318',
  dangerBorder: '#F7C4BF',

  info: '#3B82F6',
  infoLight: '#EDF4FE',
  infoText: '#1D4ED8',
  infoBorder: '#C3D9FB',

  // Neutros con matiz violeta
  slate900: '#1B1930', // texto principal
  slate800: '#26243D',
  slate700: '#3A3757', // texto secundario fuerte
  slate600: '#4F4C6B', // texto secundario
  slate500: '#6E6B89', // texto atenuado
  slate400: '#8B88A5', // placeholder / bordes con significado
  slate300: '#C4C1D4', // divisores decorativos (exentos de 3:1)
  slate200: '#E4E2ED', // divisores
  slate100: '#F2F1F7', // fondo de tarjeta
  slate50: '#FAF9FC', // fondo principal

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Overlays
  overlay: 'rgba(27, 25, 48, 0.5)',
  backdrop: 'rgba(27, 25, 48, 0.68)',

  // Sobre superficies de marca (burbuja propia del chat, barra de rol).
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255, 255, 255, 0.78)',
  readReceipt: '#C7D2FE',

  /**
   * Anillo de foco. Se declara como token porque el foco visible es un
   * requisito de accesibilidad, no un detalle: sin el, un usuario de
   * teclado no sabe donde esta.
   */
  focusRing: '#5A4BEA',
  focusRingMuted: '#DAD3FB',

  /**
   * Gradiente de marca. Uso deliberadamente restringido a un elemento focal
   * por pantalla (el logo del login). Aplicarlo en botones o tarjetas lo
   * volveria un efecto mas que una identidad.
   */
  brandGradient: ['#6C5CE7', '#F2626B'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

/**
 * Escala tipográfica.
 *
 * Siguiendo las guias de legibilidad de Nielsen Norman Group:
 * - 12px es el minimo legible en movil para texto secundario; por debajo
 *   (10, 11) el usuario tiene que forzar la vista para leerlo.
 * - 16px para cuerpo de texto. Ademas, en iOS cualquier input por debajo
 *   de 16px provoca zoom automatico al enfocar, lo que descuadra la
 *   pantalla al escribir.
 * - Cada escalon lleva su `lineHeight` (~1.4x): sin interlineado el texto
 *   se vuelve una massa gris difficult de escanear.
 * - Los tamanos suben en vez de bajar para respetar el escalado del
 *   sistema cuando el usuario agranda la fuente.
 */
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    display: 34,
  },

  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 28,
    xxl: 32,
    title: 36,
    display: 42,
  },

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  /**
   * Espaciado entre letras. El cuerpo de texto no lleva tracking (0);
   * solo las mayusculas petites lo necesitan para no quedar apretadas.
   */
  letterSpacing: {
    none: 0,
    tight: -0.2,
    wide: 0.4,
    caps: 0.6,
  },

  /**
   * Estilos semanticos. Preferibles a los tokens sueltos: hacen explicito
   * el rol del texto en la jerarquia visual, que es lo que Nielsen llama
   * "jerarquia visual" y "diseno estetico y minimalista".
   */
  text: {
    display: { fontSize: 34, lineHeight: 42, fontWeight: '800' as const },
    title: { fontSize: 28, lineHeight: 36, fontWeight: '800' as const },
    heading: { fontSize: 20, lineHeight: 28, fontWeight: '700' as const },
    subheading: { fontSize: 18, lineHeight: 26, fontWeight: '700' as const },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
    bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
    caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
    overline: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700' as const,
      letterSpacing: 0.6,
      textTransform: 'uppercase' as const,
    },
  },
};

/**
 * Sombras con brillo de marca: violeta #5A4BEA suavizado en lugar del
 * gris oscuro neutro, con radios al doble para un difuminado premium.
 * Solo cambian color y radio; opacidad, desplazamiento y `elevation`
 * (Android) se conservan para no alterar la jerarquía visual.
 */
export const Shadows = {
  sm: {
    shadowColor: 'rgba(90, 75, 234, 0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(90, 75, 234, 0.15)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(90, 75, 234, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
};
