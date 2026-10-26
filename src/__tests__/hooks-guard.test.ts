import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard de análisis estático para la clase de bug P0 más grave del
 * frontend: invocar un hook dentro de una función auxiliar.
 *
 * No podemos detectarlo en runtime porque hoy no falla (el orden de
 * llamadas es estable), pero rompe la app en cuanto alguien agrega una
 * rama condicional alrededor de la llamada. Se detecta en el código
 * fuente: un hook nunca debe estar anidado dentro de otro cuerpo de
 * función.
 *
 * Heurística: en este proyecto el cuerpo de un componente o hook
 * propio está indentado a 2 espacios. Cualquier llamada a hook con
 * indentación mayor está anidada.
 */

const SRC = join(process.cwd(), 'src');
const HOOK_CALL = /\buse[A-Z][A-Za-z0-9]*\s*\(/;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(entry) && !/\.test\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

function indentationOf(line: string): number {
  return line.length - line.trimStart().length;
}

describe('reglas de hooks', () => {
  const files = walk(SRC);

  it('encuentra archivos para analizar', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('no invoca hooks dentro de funciones auxiliares', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');

      lines.forEach((line, index) => {
        // Ignora declaraciones de hooks (`const useX = ...`) y comentarios.
        const trimmed = line.trim();
        if (!HOOK_CALL.test(line)) return;
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
        if (/^(export\s+)?(function|const)\s+use[A-Z]/.test(trimmed)) return;

        if (indentationOf(line) > 2) {
          offenders.push(
            `${file.replace(SRC, 'src')}:${index + 1} → ${trimmed}`
          );
        }
      });
    }

    expect(offenders).toEqual([]);
  });

  it('AppButton invoca useResponsive una sola vez y a nivel superior', () => {
    const source = readFileSync(join(SRC, 'components/ui/AppButton.tsx'), 'utf8');
    // Solo `useResponsive`: el archivo usa otros hooks a proposito
    // (`useFocusRing`), y el regex general los contaria como repeticiones.
    const calls = source
      .split('\n')
      .filter((l) => /\buseResponsive\s*\(/.test(l) && !l.trim().startsWith('//'));

    expect(calls).toHaveLength(1);
    expect(indentationOf(calls[0])).toBe(2);
  });

  it('no reusa un hook ya disponible en el scope del componente', () => {
    const source = readFileSync(join(SRC, 'components/ui/AppButton.tsx'), 'utf8');
    const [firstLine] = source.split('\n').filter((l) => /const \{ isSmall \}/.test(l));

    expect(firstLine).toBeDefined();
    const occurrences = source.split('\n').filter((l) => /const \{ isSmall \}/.test(l));
    expect(occurrences).toHaveLength(1);
  });
});