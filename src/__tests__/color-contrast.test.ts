import { describe, it, expect } from 'vitest';
import { Colors } from '../theme';
import { getEventStatusConfig, getClaimStatusConfig } from '../utils/format';
import type { EventStatus, ClaimStatus } from '../types';

/**
 * Contraste WCAG 2.1.
 *
 * La paleta anterior usaba el color saturado de cada estado como texto
 * sobre su propio fondo claro: los badges llegaban a 1.9:1, muy por debajo
 * del 4.5:1 que exige AA para texto normal. Estos tests calculan el ratio
 * real de cada combinacion usada en la app, de modo que un cambio de color
 * no pueda volver a introducir el problema.
 */

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

/** AA para texto normal (< 18px o < 24px bold). */
const AA_TEXT = 4.5;
/** AA para texto grande (>= 18px bold o >= 24px). */
const AA_LARGE = 3;
/** AA para elementos no textuales (bordes, iconos de estado). */
const AA_NON_TEXT = 3;

describe('contraste de la paleta', () => {
  it('el texto principal sobre el fondo de la app supera AA', () => {
    expect(contrastRatio(Colors.slate900, Colors.slate50)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('el texto secundario sobre fondo de tarjeta supera AA', () => {
    expect(contrastRatio(Colors.slate600, Colors.white)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('el texto atenuado sobre fondo de tarjeta supera AA', () => {
    expect(contrastRatio(Colors.slate500, Colors.white)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('el blanco sobre el primario supera AA', () => {
    expect(contrastRatio(Colors.white, Colors.primary)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('el blanco sobre el secundario y el peligro supera AA', () => {
    expect(contrastRatio(Colors.white, Colors.secondary)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(Colors.white, Colors.danger)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('el primario sobre su fondo claro supera AA', () => {
    expect(contrastRatio(Colors.primaryDark, Colors.primaryLight)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('los bordes con significado son distinguibles del fondo (AA no textual)', () => {
    // WCAG 1.4.11 exige 3:1 solo para elementos que transmiten informacion o
    // componentes de interfaz. `slate300` se usa como divisor decorativo y
    // esta exento; `slate400` y `focusRing` si deben cumplir.
    expect(contrastRatio(Colors.slate400, Colors.white)).toBeGreaterThanOrEqual(AA_NON_TEXT);
    expect(contrastRatio(Colors.focusRing, Colors.white)).toBeGreaterThanOrEqual(AA_NON_TEXT);
    expect(contrastRatio(Colors.primary, Colors.white)).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });
});

describe('contraste de los badges de estado', () => {
  const eventStatuses: EventStatus[] = [
    'draft',
    'quoted',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
  ];

  it.each(eventStatuses)('el estado de evento "%s" tiene texto legible', (status) => {
    const { bg, text } = getEventStatusConfig(status);
    expect(
      contrastRatio(text, bg),
      `${status}: ${text} sobre ${bg}`
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  const claimStatuses: ClaimStatus[] = [
    'open',
    'in_review',
    'awaiting_provider',
    'awaiting_client',
    'resolved',
    'rejected',
  ];

  it.each(claimStatuses)('el estado de reclamo "%s" tiene texto legible', (status) => {
    const { bg, text } = getClaimStatusConfig(status);
    expect(
      contrastRatio(text, bg),
      `${status}: ${text} sobre ${bg}`
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('ningun color de estado usa el tono saturado como texto', () => {
    const saturated: Record<string, string> = {
      success: Colors.success,
      warning: Colors.warning,
      danger: Colors.danger,
      info: Colors.info,
    };

    for (const status of [...eventStatuses, ...claimStatuses]) {
      const config = status in saturated
        ? null
        : getClaimStatusConfig(status as ClaimStatus);
      if (!config) continue;
      // El texto nunca debe ser el relleno saturado.
      expect(Object.values(saturated)).not.toContain(config.text);
    }
  });
});

describe('color como token', () => {
  it('no quedan colores hex sueltos en los utilidades de formato', () => {
    // Si alguien vuelve a escribir un hex aqui, la paleta deja de
    // ser governable desde un solo sitio.
    const source = require('node:fs').readFileSync(
      require('node:path').join(process.cwd(), 'src/utils/format.ts'),
      'utf8'
    );
    const hexInConfig = source.match(/#[0-9A-Fa-f]{3,8}/g) ?? [];
    expect(hexInConfig).toEqual([]);
  });

  it('StatusBadge usa tokens como valores por defecto', () => {
    const source = require('node:fs').readFileSync(
      require('node:path').join(process.cwd(), 'src/components/ui/StatusBadge.tsx'),
      'utf8'
    );
    expect(source).not.toMatch(/'#[0-9A-Fa-f]{3,8}'/);
  });
});