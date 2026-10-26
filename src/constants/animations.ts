import {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
  LinearTransition,
  ReduceMotion,
  SlideInDown,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

import { MotionDuration, staggerDelay } from './motion';

/**
 * Builders de animacion derivados de las duraciones de `motion.ts`.
 *
 * Todos llevan `reduceMotion(ReduceMotion.System)`: si el usuario activo
 * "reducir movimiento" en los ajustes del sistema, las animaciones se
 * desactivan. Es un requisito de accesibilidad, no un extra.
 */

/** Entrada estandar para contenido condicional (estados vacios, errores). */
export const EnterFade = FadeIn.duration(MotionDuration.enter).reduceMotion(
  ReduceMotion.System
);

/**
 * Entrada con un leve desplazamiento vertical. El desplazamiento es de 10px:
 * suficiente para dar vida al elemento sin desplazar la lectura.
 */
export const EnterFadeUp = FadeInDown.duration(MotionDuration.enter).reduceMotion(
  ReduceMotion.System
);

export const ExitFade = FadeOut.duration(MotionDuration.fade).reduceMotion(
  ReduceMotion.System
);

/**
 * Transicion entre pasos del asistente: el paso nuevo entra deslizando
 * desde la derecha y el anterior sale hacia la izquierda.
 */
export const StepEnter = SlideInRight.duration(MotionDuration.enter).reduceMotion(
  ReduceMotion.System
);

export const StepExit = SlideOutLeft.duration(MotionDuration.fade).reduceMotion(
  ReduceMotion.System
);

/** Entrada de barras flotantes: sube suavemente desde abajo. */
export const BottomEnter = SlideInDown.duration(MotionDuration.enter).reduceMotion(
  ReduceMotion.System
);

/**
 * Entrada escalonada para listas cortas, como los mensajes de un chat.
 * El retardo se acota en `motion.ts` para no retrasar listas largas.
 */
export const stagger = (index: number) =>
  EnterFadeUp.delay(staggerDelay(index));
/**
 * Animacion de layout para listas.
 *
 * Se aplica en el FlatList (`itemLayoutAnimation`) y no involve a cada celda:
 * cuando un elemento se anade, se elimina o se reordena, el resto se desliza
 * solo hasta su nueva posicion. Es la forma de dar vida a una lista sin
 * envolver cada item en un Animated.View, que romperia el `flex` de las
 * celdas en las rejillas de varias columnas.
 */
export const LayoutAnimation = Layout.duration(MotionDuration.enter).reduceMotion(
  ReduceMotion.System
);

/**
 * Transicion al cambiar el orden de los datos. Acompana a `LayoutAnimation`:
 * sin ella los elementos saltarian de posicion en un solo fotograma.
 */
export const ItemTransition = LinearTransition.duration(
  MotionDuration.enter
).reduceMotion(ReduceMotion.System);
