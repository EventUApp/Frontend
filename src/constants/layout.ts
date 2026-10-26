/**
 * Constantes de layout compartidas entre el layout raíz y el de pestañas.
 *
 * El tab bar es FIJO estilo e-commerce (ancho completo, con etiquetas): ocupa
 * su propio espacio en el layout y el navegador anade automaticamente el
 * safe area inferior del sistema, asi que las pantallas solo necesitan el
 * padding de cortesia (`SCROLL_BOTTOM_PADDING`) y ningun calculo manual.
 *
 * Estas medidas deben coincidir con las aplicadas en:
 * - src/app/(tabs)/_layout.tsx  (altura del tab bar)
 *
 * Si cambias BOTTOM_TAB_BAR_HEIGHT, actualiza ambas pantallas:
 * la barra de comparativa de `explore` vive encima del tab bar.
 */
/** Altura base del tab bar fijo estilo Mercado Libre (sin contar insets). */
export const BOTTOM_TAB_BAR_HEIGHT = 58;
export const TAB_BAR_ICON_SIZE = 22;
export const TAB_BAR_PADDING_TOP = 6;
export const TAB_BAR_PADDING_BOTTOM = 6;

/**
 * Separación entre la barra de roles flotante y lo que tenga debajo
 * (tab bar o botones de navegación del sistema).
 */
export const ROLE_SWITCHER_GAP = 8;

/** Padding de cortesía para el final de listas y scrolls. */
export const SCROLL_BOTTOM_PADDING = 20;
