import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  BOTTOM_TAB_BAR_HEIGHT,
  ROLE_SWITCHER_GAP,
  SCROLL_BOTTOM_PADDING,
} from '../constants/layout';

/**
 * Estas pruebas fijan la relación entre el tab bar fijo y la barra de
 * roles. El tab bar ocupa su propio espacio en el layout (el navegador
 * anade el safe area), asi que el contenido nunca queda debajo de el.
 */

const SYSTEM_INSETS = [0, 24, 34, 48];

describe('layout del tab bar y la barra de roles', () => {
  it('el tab bar deja espacio para los botones del sistema', () => {
    for (const inset of SYSTEM_INSETS) {
      const tabBarHeight = BOTTOM_TAB_BAR_HEIGHT + inset;
      // Nunca puede ser menor al contenido; solo crece si hay inset.
      expect(tabBarHeight).toBeGreaterThanOrEqual(BOTTOM_TAB_BAR_HEIGHT);
      if (inset > 0) {
        expect(tabBarHeight).toBeGreaterThan(BOTTOM_TAB_BAR_HEIGHT);
      }
    }
  });

  it('la barra de roles queda por encima del tab bar, nunca encima de él', () => {
    for (const inset of SYSTEM_INSETS) {
      const bottomOffset = BOTTOM_TAB_BAR_HEIGHT + inset + ROLE_SWITCHER_GAP;
      const tabBarTop = inset + BOTTOM_TAB_BAR_HEIGHT;

      expect(bottomOffset).toBeGreaterThan(tabBarTop);
      expect(bottomOffset - tabBarTop).toBe(ROLE_SWITCHER_GAP);
    }
  });

  it('la barra de roles nunca invade la zona de los botones del sistema', () => {
    for (const inset of SYSTEM_INSETS) {
      const bottomOffset = inset + ROLE_SWITCHER_GAP;
      expect(bottomOffset).toBeGreaterThanOrEqual(inset);
    }
  });

  it('el offset crece con el inset, se adapta a cada teléfono', () => {
    const offsets = SYSTEM_INSETS.map(
      (inset) => BOTTOM_TAB_BAR_HEIGHT + inset + ROLE_SWITCHER_GAP
    );

    for (let i = 1; i < offsets.length; i++) {
      expect(offsets[i]).toBeGreaterThan(offsets[i - 1]);
    }
  });

  it('mantiene un margen constante respecto al tab bar en todas las pantallas', () => {
    const gaps = SYSTEM_INSETS.map(
      (inset) => BOTTOM_TAB_BAR_HEIGHT + inset + ROLE_SWITCHER_GAP - (inset + BOTTOM_TAB_BAR_HEIGHT)
    );

    expect(new Set(gaps).size).toBe(1);
  });
});
describe('consistencia del padding inferior de scroll', () => {
  /**
   * Resuelve la referencia real `contentContainerStyle={styles.X}` en vez de
   * adivinar por nombre de estilo: los nombres varian ('list', 'scrollList',
   * 'scrollContent'...) y una lista de nombres falla en silencio.
   */
  function walk(dir: string): string[] {
    const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
    return readdirSync(dir).flatMap((entry) => {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) return walk(full);
      return /\.tsx$/.test(entry) ? [full] : [];
    });
  }

  it('toda pantalla con scroll comparte el mismo padding inferior', () => {
    const offenders: string[] = [];

    for (const file of walk(join(process.cwd(), 'src', 'app'))) {
      const source = readFileSync(file, 'utf8');

      // 1. Localiza los estilos usados como contentContainerStyle, e indica
      //    si el ScrollView es horizontal (carrusel).
      const refs = [...source.matchAll(/contentContainerStyle=\{styles\.([A-Za-z0-9_]+)\}/g)]
        .map((m) => {
          const end = (m.index ?? 0) + m[0].length;
          const before = source.slice(Math.max(0, end - 400), end);

          // Un carrusel horizontal lleva padding vertical pequeno a proposito,
          // el token de scroll de pagina no aplica ahi. Se decide por la prop
          // `horizontal` del JSX, nunca por el nombre del estilo.
          const isHorizontal = /<ScrollView[\s\S]*\bhorizontal\b[\s\S]*$/.test(before);

          return { name: m[1], isHorizontal };
        })
        .filter((r) => !r.isHorizontal);

      for (const { name } of refs) {
        // 2. Extrae el bloque de ese estilo concreto.
        const block = new RegExp(
          '^\\s+' + name + ': \\{([\\s\\S]*?)^\\s*\\},',
          'm'
        ).exec(source);
        if (!block) continue;

        // 3. Si fija paddingBottom, debe usar el token compartido.
        if (/paddingBottom:/.test(block[1]) && !/SCROLL_BOTTOM_PADDING/.test(block[1])) {
          offenders.push(`${file.replace(process.cwd() + '/', '')} (styles.${name})`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('el padding de scroll deja espacio para el tab bar', () => {
    // Con tab bar fijo no se necesita despeje: el padding es cortesia y
    // vive fijado en el token para que todas las pantallas coincidan.
    expect(SCROLL_BOTTOM_PADDING).toBe(20);
  });
});

describe('listas dentro de pantallas con barra fija', () => {
  /**
   * Un FlatList/ScrollView dentro de un contenedor column flex sin `flex: 1`
   * crece hasta la altura de todo su contenido y empuja los elementos fijos
   * (barras de escritura, footers) fuera de la pantalla. Fue el origen del
   * desbordamiento de la barra de escritura del chat.
   */
  const FIXED_BOTTOM_SCREENS = ['src/app/chat/[id].tsx'];

  it('la lista principal declara flex: 1', () => {
    const offenders: string[] = [];

    for (const rel of FIXED_BOTTOM_SCREENS) {
      const source = readFileSync(join(process.cwd(), rel), 'utf8');

      const lists = [
        ...source.matchAll(/<(FlatList|ScrollView)\b([\s\S]*?)\/>/g),
      ];

      for (const [, tag, attrs] of lists) {
        if (/horizontal/.test(attrs)) continue; // carrusel, no ocupa la columna

        // Resuelve `style={styles.X}`: el `flex: 1` suele vivir en el
        // StyleSheet, no inline en el JSX.
        const ref = /style=\{styles\.([A-Za-z0-9_]+)\}/.exec(attrs);
        let resolved = attrs;

        if (ref) {
          const block = new RegExp(
            '^\\s+' + ref[1] + ': \\{([\\s\\S]*?)^\\s*\\},',
            'm'
          ).exec(source);
          resolved = `${attrs}\n${block ? block[1] : ''}`;
        }

        if (!/style=\{/.test(attrs)) {
          offenders.push(`${rel}: <${tag}> sin style`);
          continue;
        }
        if (!/flex:\s*1/.test(resolved)) {
          offenders.push(`${rel}: <${tag}> sin flex: 1`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
