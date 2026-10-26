import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveConfig {
  width: number;
  breakpoint: Breakpoint;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  padding: number;
  maxWidth: number;
}

const BREAKPOINTS = {
  xs: 0,
  sm: 360,
  md: 414,
  lg: 768,
  xl: 1024,
};

export function useResponsive(): ResponsiveConfig {
  const { width } = useWindowDimensions();

  let breakpoint: Breakpoint = 'xs';
  if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
  else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
  else if (width >= BREAKPOINTS.md) breakpoint = 'md';
  else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';

  const isSmall = breakpoint === 'xs' || breakpoint === 'sm';
  const isMedium = breakpoint === 'md';
  const isLarge = breakpoint === 'lg' || breakpoint === 'xl';

  const padding = isSmall ? 12 : isMedium ? 16 : 20;
  const maxWidth = isLarge ? 600 : width;

  return {
    width,
    breakpoint,
    isSmall,
    isMedium,
    isLarge,
    padding,
    maxWidth,
  };
}

export function getResponsiveValue<T>(
  config: ResponsiveConfig,
  values: { xs: T; sm: T; md: T; lg: T; xl: T }
): T {
  return values[config.breakpoint];
}

export function getColumns(config: ResponsiveConfig): number {
  if (config.isLarge) return 3;
  if (config.isMedium) return 2;
  return 1;
}
