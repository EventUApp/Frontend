import { describe, it, expect } from 'vitest';
import { getResponsiveValue, getColumns, type Breakpoint } from '../hooks/useResponsive';

const ALL: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/** Réplica de la lógica de useResponsive, para poder probarla sin renderizar. */
function configAt(breakpoint: Breakpoint) {
  const isSmall = breakpoint === 'xs' || breakpoint === 'sm';
  const isMedium = breakpoint === 'md';
  const isLarge = breakpoint === 'lg' || breakpoint === 'xl';
  return {
    breakpoint,
    isSmall,
    isMedium,
    isLarge,
    padding: isSmall ? 12 : isMedium ? 16 : 20,
    maxWidth: isLarge ? 600 : 390,
    width: 390,
  };
}

describe('useResponsive helpers', () => {
  it('clasifica cada breakpoint en un grupo de tamaño', () => {
    expect(configAt('xs').isSmall).toBe(true);
    expect(configAt('sm').isSmall).toBe(true);
    expect(configAt('md').isMedium).toBe(true);
    expect(configAt('lg').isLarge).toBe(true);
    expect(configAt('xl').isLarge).toBe(true);
  });

  it('getResponsiveValue devuelve el valor del breakpoint exacto', () => {
    for (const bp of ALL) {
      const index = ALL.indexOf(bp) + 1;
      const values = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };
      expect(getResponsiveValue(configAt(bp), values)).toBe(index);
    }
  });

  it('getColumns escala 1 → 2 → 3 con el tamaño de pantalla', () => {
    expect(getColumns(configAt('xs'))).toBe(1);
    expect(getColumns(configAt('sm'))).toBe(1);
    expect(getColumns(configAt('md'))).toBe(2);
    expect(getColumns(configAt('lg'))).toBe(3);
    expect(getColumns(configAt('xl'))).toBe(3);
  });

  it('el padding crece con el tamaño de pantalla', () => {
    const paddings = ALL.map((bp) => configAt(bp).padding);
    expect(paddings).toEqual([12, 12, 16, 20, 20]);
  });
});