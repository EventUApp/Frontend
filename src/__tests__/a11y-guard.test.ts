import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard de accesibilidad.
 *
 * Los componentes interactivos (TouchableOpacity, Pressable) que no
 * declaran un nombre accesible son invisibles para un usuario de lector
 * de pantalla: VoiceOver y TalkBack anuncian simplemente "botón".
 *
 * No hay @testing-library/react-native en el proyecto, asi que esto valida
 * el codigo fuente de forma estatica. Cuando se anadan pruebas de render,
 * este guard debe complementarse, no sustituirse.
 */

const SRC = join(process.cwd(), 'src');

/** Componentes que por diseno no llevan label propio. */
const ALLOWED_WITHOUT_LABEL = new Set([
  // Ya envuelve la fila en un nodo agrupado con `accessible`.
  'components/domain/ServiceCartItem.tsx',
]);

interface Finding {
  file: string;
  line: number;
  code: string;
}

function auditInteractiveComponents(): Finding[] {
  const findings: Finding[] = [];
  const files = collectFiles(join(SRC, 'components'));

  for (const file of files) {
    const rel = file.replace(SRC + '/', '');
    const source = readFileSync(file, 'utf8');
    const lines = source.split('\n');

    lines.forEach((line, index) => {
      const isInteractive =
        /<(TouchableOpacity|Pressable|TouchableWithoutFeedback)\b/.test(line);
      if (!isInteractive) return;

      // Extrae el bloque del elemento buscando su cierre.
      const block = extractBlock(lines, index);
      const hasLabel = /accessibilityLabel\s*=/.test(block);
      const hasRole = /accessibilityRole\s*=/.test(block);

      if (!hasLabel && !hasRole) {
        findings.push({ file: rel, line: index + 1, code: 'sin rol ni etiqueta' });
      } else if (!hasLabel && !ALLOWED_WITHOUT_LABEL.has(rel)) {
        findings.push({ file: rel, line: index + 1, code: 'sin accessibilityLabel' });
      }
    });
  }

  return findings;
}

function collectFiles(dir: string): string[] {
  const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectFiles(full);
    // Las variantes .web.tsx corren en navegador, no en lector de pantalla móvil.
    if (/\.tsx$/.test(entry) && !/\.web\.tsx$/.test(entry)) return [full];
    return [];
  });
}

/**
 * Devuelve las lineas del elemento hasta el cierre de su etiqueta de
 * apertura.
 *
 * Solo cuentan los `<` y `>` que estan fuera de llaves `{}` y corchetes
 * `[]`: dentro de las props hay operadores de comparacion (`a > b`) y
 * funciones flecha (`() => ...`)whose '>' no cierran ninguna etiqueta.
 */
function extractBlock(lines: string[], start: number): string {
  let curly = 0;
  let square = 0;
  let angle = 0;
  const out: string[] = [];

  for (let i = start; i < Math.min(start + 60, lines.length); i++) {
    const line = lines[i];
    out.push(line);

    // Elemento auto-cerrado: no hay etiqueta que cerrar.
    if (/<[A-Za-z][^<>]*\/>/.test(line)) {
      return out.join('\n');
    }

    for (const ch of line) {
      if (ch === '{') curly++;
      else if (ch === '}') curly--;
      else if (ch === '[') square++;
      else if (ch === ']') square--;
      else if (curly === 0 && square === 0) {
        if (ch === '<') angle++;
        else if (ch === '>') angle--;
      }
    }

    if (angle <= 0 && i > start) break;
  }

  return out.join('\n');
}

describe('accesibilidad de componentes interactivos', () => {
  it('todo control interactivo declara rol o nombre accesible', () => {
    const findings = auditInteractiveComponents();
    const report = findings
      .map((f) => `  ${f.file}:${f.line} → ${f.code}`)
      .join('\n');

    expect(report || 'sin hallazgos').toBe('sin hallazgos');
  });

  it('AppButton expone rol, etiqueta y estado', () => {
    const src = readFileSync(join(SRC, 'components/ui/AppButton.tsx'), 'utf8');
    expect(src).toMatch(/accessibilityRole="button"/);
    expect(src).toMatch(/accessibilityLabel=\{title\}/);
    expect(src).toMatch(/accessibilityState=\{\{ disabled/);
  });

  it('AppButton respeta el area tactil minima de 44pt', () => {
    const src = readFileSync(join(SRC, 'components/ui/AppButton.tsx'), 'utf8');
    expect(src).toMatch(/minHeight:\s*44/);
  });

  it('PasswordInput anuncia el estado del toggle', () => {
    const src = readFileSync(join(SRC, 'components/ui/PasswordInput.tsx'), 'utf8');
    expect(src).toMatch(/rightIconLabel=/);
    expect(src).toMatch(/Mostrar contraseña/);
    expect(src).toMatch(/Ocultar contraseña/);
  });

  it('Rating agrupa la nota en un nodo con nombre accesible', () => {
    const src = readFileSync(join(SRC, 'components/ui/Rating.tsx'), 'utf8');
    expect(src).toMatch(/accessible\b/);
    expect(src).toMatch(/accessibilityLabel=/);
  });

  it('ConfirmDialog aísla el contenido de fondo para el lector', () => {
    const src = readFileSync(join(SRC, 'components/ui/ConfirmDialog.tsx'), 'utf8');
    expect(src).toMatch(/accessibilityViewIsModal/);
  });

  it('AppInput asocia el label visual al campo', () => {
    const src = readFileSync(join(SRC, 'components/ui/AppInput.tsx'), 'utf8');
    expect(src).toMatch(/accessibilityLabel=\{fieldLabel\}/);
    expect(src).toMatch(/accessibilityHint=\{error\}/);
  });
});
describe('AppHeader a sangre', () => {
  /**
   * `AppHeader` se renderiza dentro de `ScreenContainer`, que ya aplica
   * padding horizontal al contenido. Sin margenes negativos el header:
   * - deja su fondo blanco y su borde recortados (franjas a los lados),
   * - indenta el titulo mas que las pantallas con cabecera propia.
   *
   * Se comprueba que compense el padding del contenedor en vez de relied
   * en que cada pantalla pase el header por una prop especial.
   */
  it('escapa del padding del contenedor', () => {
    const src = readFileSync(join(SRC, 'components/ui/AppHeader.tsx'), 'utf8');
    expect(src).toMatch(/marginHorizontal:\s*-padding/);
    expect(src).toMatch(/paddingHorizontal:\s*padding\s*\+\s*Spacing\.lg/);
  });

  it('no depende de una prop header del contenedor', () => {
    const container = readFileSync(join(SRC, 'components/ui/ScreenContainer.tsx'), 'utf8');
    expect(container).not.toMatch(/header\?:/);
  });
});
