import { useCallback, useState } from 'react';

/**
 * Estado de foco visible para componentes reutilizables.
 *
 * React Native expone `onFocus`/`onBlur` pero no un estilo `:focus` como en
 * web, asi que cada control necesita su propio estado para dibujar el anillo.
 * Este hook centraliza ese patron.
 *
 * El anillo se usa con `Colors.focusRing`: el foco visible es un requisito
 * de accesibilidad (WCAG 2.4.7), no un adorno.
 */
export function useFocusRing() {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);

  return { isFocused, onFocus, onBlur };
}