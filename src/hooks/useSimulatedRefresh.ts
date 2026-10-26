import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Simula una recarga pull-to-refresh de `delayMs` (aún no hay API real).
 * Limpia el timer al desmontar y evita re-entradas mientras ya recarga.
 */
export function useSimulatedRefresh(delayMs = 1000) {
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise<void>((resolve) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => resolve(), delayMs);
    });
    timer.current = null;
    if (mounted.current) setRefreshing(false);
  }, [delayMs]);

  return { refreshing, onRefresh };
}
