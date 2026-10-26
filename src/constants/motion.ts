/**
 * Sistema de movimiento: duraciones.
 *
 * Este modulo no importa reanimated a proposito: son datos puros y asi
 * pueden verificarse en tests sin cargar el runtime nativo.
 *
 * Criterios (heuristica de Nielsen "diseno estetico y minimalistico" y
 * guias de motion de Android/iOS):
 *
 * - Las transiciones comunican la relacion entre pantallas, no decoran.
 *   Son rapidas: por encima de ~350ms la app se siente lenta y el usuario
 *   percibe que esta "arrastrando" la pantalla.
 * - Sutiles: un desplazamiento corto y un fundido. Nada de rebotes o
 *   escalados, que compiten con el contenido.
 * - Coherentes: la misma intencion usa el mismo movimiento.
 */
export const MotionDuration = {
  /** Cambio de contexto dentro de la misma seccion (listas, formularios). */
  fade: 180,
  /** Detalle: empuje horizontal. */
  push: 280,
  /** Modal: entra desde abajo. */
  modal: 300,
  /** Elementos que aparecen dentro de una pantalla. */
  enter: 220,
} as const;

/** Retardo entre elementos de una lista escalonada. */
export const STAGGER_STEP = 40;

/**
 * Numero maximo de elementos con retardo.
 *
 * En una lista larga, animar cada fila retrasa justo el contenido que el
 * usuario quiere ver de inmediato; a partir de este indice todos entran
 * a la vez.
 */
export const STAGGER_MAX = 6;

/** Calcula el retardo de entrada para el elemento `index` de una lista. */
export function staggerDelay(index: number): number {
  return Math.min(index, STAGGER_MAX) * STAGGER_STEP;
}