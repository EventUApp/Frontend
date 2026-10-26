import React from 'react';
import { FlatList, type RefreshControlProps } from 'react-native';
import { PlanCard } from '../domain/PlanCard';
import { listStyles } from './listStyles';
import { EventPlan } from '../../types';

interface PlansListProps {
  plans: EventPlan[];
  refreshControl: React.ReactElement<RefreshControlProps>;
  listRef: React.Ref<FlatList>;
  onPlanPress: (plan: EventPlan) => void;
  onUsePlan: (plan: EventPlan) => void;
  renderEmpty: () => React.ReactElement | null;
}

/** Lista virtualizada de planes preconfigurados. */
export const PlansList: React.FC<PlansListProps> = ({
  plans,
  refreshControl,
  listRef,
  onPlanPress,
  onUsePlan,
  renderEmpty,
}) => {
  return (
    <FlatList
      ref={listRef}
      data={plans}
      keyExtractor={(item) => item.id}
      renderItem={({ item: plan }) => (
        <PlanCard
          plan={plan}
          onPress={() => onPlanPress(plan)}
          onUsePlan={() => onUsePlan(plan)}
        />
      )}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={listStyles.listContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews
    />
  );
};
