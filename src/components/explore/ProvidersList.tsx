import React from 'react';
import { FlatList, type RefreshControlProps } from 'react-native';
import { ProviderCard } from '../domain/ProviderCard';
import { listStyles } from './listStyles';
import { Provider } from '../../types';

interface ProvidersListProps {
  providers: Provider[];
  refreshControl: React.ReactElement<RefreshControlProps>;
  listRef: React.Ref<FlatList>;
  onProviderPress: (provider: Provider) => void;
  renderEmpty: () => React.ReactElement | null;
}

/** Lista virtualizada de proveedores. */
export const ProvidersList: React.FC<ProvidersListProps> = ({
  providers,
  refreshControl,
  listRef,
  onProviderPress,
  renderEmpty,
}) => {
  return (
    <FlatList
      ref={listRef}
      data={providers}
      keyExtractor={(item) => item.id}
      renderItem={({ item: provider }) => (
        <ProviderCard
          provider={provider}
          onPress={() => onProviderPress(provider)}
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
