import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BorderRadius, Colors, Spacing } from '../../theme';

/**
 * Carrusel horizontal generico con responsive matematico y animaciones
 * conducidas por el gesto de scroll (react-native-reanimated).
 *
 * - El ancho de tarjeta se deriva del ancho real de la pantalla, nunca de
 *   un literal: `Math.min(Math.round(screenWidth * ratio), max)`.
 * - Cada tarjeta escala a 1.0 al enfocarse y reposa en 0.93, con opacidad
 *   0.75 fuera de foco y mayor elevacion en la tarjeta activa.
 * - Los puntos de paginacion siguen el scroll en tiempo real mediante
 *   interpolacion; el ancho lleva un resorte para una expansion elastica.
 * - Si el sistema pide reducir movimiento, la escala se degrada a 1.
 */

// Proporciones verificadas en 360 / 390 / 414 / 430px: la tarjeta deja
// asomar entre un 15% y un 25% de la siguiente, invitando al swipe.
export const PLAN_CARD_RATIO = 0.78;
export const PLAN_CARD_MAX_WIDTH = 340;
export const PROVIDER_CARD_RATIO = 0.72;
export const PROVIDER_CARD_MAX_WIDTH = 300;
export const CAROUSEL_GAP = 12;

export const CAROUSEL_SCALE_FOCUSED = 1;
export const CAROUSEL_SCALE_SIDE = 0.93;
export const CAROUSEL_OPACITY_FOCUSED = 1;
export const CAROUSEL_OPACITY_SIDE = 0.75;

/** Ancho responsivo de la tarjeta principal de paquetes. */
export function getPlanCardWidth(screenWidth: number): number {
  return Math.min(Math.round(screenWidth * PLAN_CARD_RATIO), PLAN_CARD_MAX_WIDTH);
}

/** Ancho responsivo de la tarjeta de proveedores. */
export function getProviderCardWidth(screenWidth: number): number {
  return Math.min(
    Math.round(screenWidth * PROVIDER_CARD_RATIO),
    PROVIDER_CARD_MAX_WIDTH
  );
}

const DOT_INACTIVE_WIDTH = 6;
const DOT_ACTIVE_WIDTH = 20;
const DOT_HEIGHT = 6;
const DOT_SPRING = { damping: 22, stiffness: 260 } as const;

interface AnimatedCarouselProps<T> {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderCard: (item: T, index: number, cardWidth: number) => React.ReactElement;
  widthRatio: number;
  maxCardWidth: number;
  accessibilityLabel: string;
  getItemLabel?: (item: T, index: number) => string;
}

interface AnimatedCardItemProps {
  index: number;
  snapInterval: number;
  scrollX: SharedValue<number>;
  reduceMotion: boolean;
  width: number;
  gap: number;
  isLast: boolean;
  positionLabel: string;
  children: React.ReactNode;
}

/** Envoltorio animado: escala, opacidad y elevacion siguen al scroll. */
function AnimatedCardItem({
  index,
  snapInterval,
  scrollX,
  reduceMotion,
  width,
  gap,
  isLast,
  positionLabel,
  children,
}: AnimatedCardItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval,
    ];
    const scaleRange: [number, number, number] = reduceMotion
      ? [1, 1, 1]
      : [CAROUSEL_SCALE_SIDE, CAROUSEL_SCALE_FOCUSED, CAROUSEL_SCALE_SIDE];
    const scale = interpolate(scrollX.value, inputRange, scaleRange, Extrapolation.CLAMP);
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [CAROUSEL_OPACITY_SIDE, CAROUSEL_OPACITY_FOCUSED, CAROUSEL_OPACITY_SIDE],
      Extrapolation.CLAMP
    );
    const elevation = interpolate(scrollX.value, inputRange, [2, 6, 2], Extrapolation.CLAMP);
    const shadowOpacity = interpolate(
      scrollX.value,
      inputRange,
      [0.05, 0.12, 0.05],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }], opacity, elevation, shadowOpacity };
  });
  return (
    <Animated.View
      accessible
      accessibilityLabel={positionLabel}
      style={[styles.cardWrap, { width, marginRight: isLast ? 0 : gap }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

interface CarouselDotProps {
  index: number;
  snapInterval: number;
  scrollX: SharedValue<number>;
}

/**
 * Punto de paginacion reactivo: el ancho interpola en tiempo real con el
 * scroll y el resorte suaviza la expansion a pildora de forma elastica.
 */
function CarouselDot({ index, snapInterval, scrollX }: CarouselDotProps) {
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval,
    ];
    const targetWidth = interpolate(
      scrollX.value,
      inputRange,
      [DOT_INACTIVE_WIDTH, DOT_ACTIVE_WIDTH, DOT_INACTIVE_WIDTH],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(scrollX.value, inputRange, [0.55, 1, 0.55], Extrapolation.CLAMP);
    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      Colors.slate300,
      Colors.primary,
      Colors.slate300,
    ]);
    return {
      width: withSpring(targetWidth, DOT_SPRING),
      opacity,
      backgroundColor,
    };
  });
  return (
    <Animated.View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.dot, animatedDotStyle]}
    />
  );
}

interface CarouselPaginationProps {
  count: number;
  snapInterval: number;
  scrollX: SharedValue<number>;
  carouselLabel: string;
}

/** Indicador de paginacion sincronizado con el scroll del carrusel. */
function CarouselPagination({
  count,
  snapInterval,
  scrollX,
  carouselLabel,
}: CarouselPaginationProps) {
  if (count <= 1) {
    return null;
  }
  return (
    <View
      accessible
      accessibilityLabel={`${carouselLabel}: indicador de página con ${count} elementos`}
      style={styles.dotsRow}
    >
      {Array.from({ length: count }, (_, dotIndex) => (
        <CarouselDot
          key={`${carouselLabel}-dot-${dotIndex}`}
          index={dotIndex}
          snapInterval={snapInterval}
          scrollX={scrollX}
        />
      ))}
    </View>
  );
}

/**
 * Carrusel horizontal reutilizable para el Home. Calcula su geometria desde
 * `useWindowDimensions`, conecta el scroll nativo a un valor compartido y
 * delega el render de cada tarjeta al llamador.
 */
export function AnimatedCarousel<T>({
  data,
  keyExtractor,
  renderCard,
  widthRatio,
  maxCardWidth,
  accessibilityLabel,
  getItemLabel,
}: AnimatedCarouselProps<T>) {
  const { width: screenWidth } = useWindowDimensions();
  const systemReducedMotion = useReducedMotion();
  const [reduceMotionSetting, setReduceMotionSetting] = useState(false);
  const scrollX = useSharedValue(0);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setReduceMotionSetting(enabled);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const cardWidth = Math.min(Math.round(screenWidth * widthRatio), maxCardWidth);
  const snapInterval = cardWidth + CAROUSEL_GAP;
  const reduceMotion = systemReducedMotion || reduceMotionSetting;
  return (
    <View>
      <Animated.FlatList
        horizontal
        data={data}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        accessibilityLabel={`${accessibilityLabel}: ${data.length} elementos. Desliza para ver más.`}
        contentContainerStyle={styles.list}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        initialNumToRender={3}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, itemIndex) => ({
          length: snapInterval,
          offset: snapInterval * itemIndex,
          index: itemIndex,
        })}
        renderItem={({ item, index }: { item: T; index: number }) => (
          <AnimatedCardItem
            index={index}
            snapInterval={snapInterval}
            scrollX={scrollX}
            reduceMotion={reduceMotion}
            width={cardWidth}
            gap={CAROUSEL_GAP}
            isLast={index === data.length - 1}
            positionLabel={
              getItemLabel
                ? getItemLabel(item, index)
                : `${accessibilityLabel}: elemento ${index + 1} de ${data.length}`
            }
          >
            {renderCard(item, index, cardWidth)}
          </AnimatedCardItem>
        )}
      />
      <CarouselPagination
        count={data.length}
        snapInterval={snapInterval}
        scrollX={scrollX}
        carouselLabel={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  cardWrap: {
    justifyContent: 'flex-start',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  dot: {
    height: DOT_HEIGHT,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.slate300,
  },
});
