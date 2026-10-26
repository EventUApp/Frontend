import React from 'react';
import { StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import { PlanCard } from '../domain/PlanCard';
import { EventPlan } from '../../types';
import {
  AnimatedCarousel,
  PLAN_CARD_MAX_WIDTH,
  PLAN_CARD_RATIO,
} from './AnimatedCarousel';

interface PopularPlansCarouselProps {
  plans: EventPlan[];
  onPlanPress: (plan: EventPlan) => void;
  onUsePlan: (plan: EventPlan) => void;
}

/** Carrusel de paquetes con ancho responsivo y animacion por scroll. */
export const PopularPlansCarousel: React.FC<PopularPlansCarouselProps> = ({
  plans,
  onPlanPress,
  onUsePlan,
}) => {
  return (
    <AnimatedCarousel<EventPlan>
      data={plans}
      keyExtractor={(item) => item.id}
      widthRatio={PLAN_CARD_RATIO}
      maxCardWidth={PLAN_CARD_MAX_WIDTH}
      accessibilityLabel="Paquetes todo incluido"
      getItemLabel={(plan, index) =>
        `Paquete ${index + 1} de ${plans.length}: ${plan.name}`
      }
      renderCard={(plan, planIndex, cardWidth) => (
        <PlanCard
          plan={plan}
          onPress={() => onPlanPress(plan)}
          onUsePlan={() => onUsePlan(plan)}
          style={[styles.card, { width: cardWidth }]}
          testID={`popular-plan-card-${planIndex}`}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
});
