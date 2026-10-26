import { useEffect, useState } from 'react';

/**
 * Retorna `value` con un retraso de `delay` ms después del último cambio.
 * Evita filtrar/renderizar por cada pulsación cuando el usuario escribe rápido.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Normaliza texto para búsquedas tolerantes: minúsculas, sin tildes
 * y sin espacios de más. Así "Fotografo" encuentra "fotógrafo".
 */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}
