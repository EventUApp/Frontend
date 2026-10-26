import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Typography } from '../theme';
import { MotionDuration, STAGGER_MAX, STAGGER_STEP, staggerDelay } from '../constants/motion';

/**
 * Guard de tipografia y motion.
 *
 * Tipografia: Nielsen Norman Group recomienda 12px como minimo legible en
 * movil y ~1.4x de interlineado. Antes el proyecto tenia 81 `fontSize`
 * literales saltandose el sistema de tokens, incluidos 9px y 10px.
 *
 * Motion: las transiciones deben ser rapidas y sutiles, y respetar la
 * preferencia de reducir movimiento del sistema.
 */

const SRC = join(process.cwd(), 'src');

function walk(dir: string): string[] {
  const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    // themed-text.tsx es la libreria por defecto de Expo, ajena al tema.
    // theme/index.ts es donde se DEFINEN los tokens: alli los literales
    // son la fuente, no una violation.
    // Se filtra por la ruta completa: `entry` es solo el nombre de archivo.
    return /\.tsx?$/.test(entry) &&
      !/themed-text|\.test\.|theme.index/.test(full)
      ? [full]
      : [];
  });
}

describe('escala tipografica', () => {
  it('ningun tamano es inferior a 12px', () => {
    for (const [name, value] of Object.entries(Typography.sizes)) {
      expect(value, `Typography.sizes.${name} es ${value}px`).toBeGreaterThanOrEqual(12);
    }
  });

  it('la escala es estrictamente creciente', () => {
    const values = [
      Typography.sizes.xs,
      Typography.sizes.sm,
      Typography.sizes.md,
      Typography.sizes.lg,
      Typography.sizes.xl,
      Typography.sizes.xxl,
      Typography.sizes.title,
      Typography.sizes.display,
    ];
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it('el cuerpo de texto llega a 16px (evita el zoom automatico de iOS)', () => {
    expect(Typography.sizes.md).toBeGreaterThanOrEqual(16);
  });

  it('cada tamano tiene su interlineado', () => {
    for (const size of Object.keys(Typography.sizes)) {
      expect(Typography.lineHeights[size as keyof typeof Typography.lineHeights]).toBeGreaterThan(0);
    }
  });

  it('el interlineado esta entre 1.2x y 1.6x del tamano', () => {
    const sizes = Typography.sizes as Record<string, number>;
    const heights = Typography.lineHeights as Record<string, number>;
    for (const size of Object.keys(sizes)) {
      const ratio = heights[size] / sizes[size];
      expect(ratio, `lineHeight de ${size} = ${ratio.toFixed(2)}x`).toBeGreaterThanOrEqual(1.2);
      expect(ratio, `lineHeight de ${size} = ${ratio.toFixed(2)}x`).toBeLessThanOrEqual(1.6);
    }
  });

  it('no quedan fontSize literales fuera del theme', () => {
    const offenders: string[] = [];

    for (const file of walk(SRC)) {
      const rel = file.replace(process.cwd() + '/', '');
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/fontSize:\s*\d/.test(line)) offenders.push(`${rel}:${i + 1}`);
        });
    }

    expect(offenders).toEqual([]);
  });

  it('expone estilos semanticos para la jerarquia visual', () => {
    for (const key of ['display', 'title', 'heading', 'body', 'label', 'caption']) {
      expect(Typography.text[key as keyof typeof Typography.text]).toBeTruthy();
    }
  });
});

describe('sistema de movimiento', () => {
  it('las transiciones son rapidas (por encima de 350ms se siente lento)', () => {
    for (const [name, ms] of Object.entries(MotionDuration)) {
      expect(ms, `MotionDuration.${name} = ${ms}ms`).toBeGreaterThan(0);
      expect(ms, `MotionDuration.${name} = ${ms}ms`).toBeLessThanOrEqual(350);
    }
  });

  it('el escalonado de listas esta acotado para no retrasar el contenido', () => {
    // A partir de STAGGER_MAX todos los elementos entran a la vez.
    expect(staggerDelay(STAGGER_MAX)).toBe(STAGGER_MAX * STAGGER_STEP);
    expect(staggerDelay(99)).toBe(staggerDelay(STAGGER_MAX));
    expect(staggerDelay(0)).toBe(0);
  });

  it('las animaciones respetan la preferencia de reducir movimiento', () => {
    // animations.ts importa reanimated (no carga en Node), asi que se
    // verifica el codigo fuente: cada builder debe reducir movimiento.
    // Sin comentarios: la documentacion tambien menciona reduceMotion y
    // inflaria el conteo.
    const source = readFileSync(join(SRC, 'constants/animations.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
    // Todo builder de animacion exportado debe reducir movimiento.
    // Cubre FadeIn/FadeInDown/FadeOut y tambien Layout y LinearTransition.
    const exported = [...source.matchAll(/export const (\w+) =/g)].map((m) => m[1]);
    const builders = exported.filter(
      (name) => !/^(MotionDuration|stagger|staggerDelay)/.test(name)
    ).length;
    const reduceMotion =
      source.match(/reduceMotion\(\s*ReduceMotion\.System\s*\)/g)?.length ?? 0;

    expect(builders).toBeGreaterThan(0);
    expect(reduceMotion).toBe(builders);
  });

  it('cada transicion de navegacion declara su duracion', () => {
    const source = readFileSync(join(SRC, 'app/_layout.tsx'), 'utf8');
    const screens = source.match(/<Stack\.Screen/g)?.length ?? 0;
    const own = source.match(/animationDuration:/g)?.length ?? 0;
    const hasDefault = /screenOptions=\{\{[\s\S]*?animationDuration/.test(source);
    // Las pantallas de detalle heredan la duracion del screenOptions.
    const inherited =
      source.match(/animation: 'slide_from_right'/g)?.length ?? 0;

    expect(screens).toBeGreaterThan(0);
    expect(hasDefault).toBe(true);
    // Cada pantalla o trae su duracion, o hereda la del stack.
    expect(own + inherited).toBeGreaterThanOrEqual(screens);
  });
});