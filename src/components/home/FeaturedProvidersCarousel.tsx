import React from 'react';
import { StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import { ProviderCard } from '../domain/ProviderCard';
import { Provider } from '../../types';
import {
  AnimatedCarousel,
  PROVIDER_CARD_MAX_WIDTH,
  PROVIDER_CARD_RATIO,
} from './AnimatedCarousel';

interface FeaturedProvidersCarouselProps {
  providers: Provider[];
  onProviderPress: (provider: Provider) => void;
}

/** Carrusel de proveedores con ancho responsivo y animacion por scroll. */
export const FeaturedProvidersCarousel: React.FC<FeaturedProvidersCarouselProps> = ({
  providers,
  onProviderPress,
}) => {
  return (
    <AnimatedCarousel<Provider>
      data={providers}
      keyExtractor={(item) => item.id}
      widthRatio={PROVIDER_CARD_RATIO}
      maxCardWidth={PROVIDER_CARD_MAX_WIDTH}
      accessibilityLabel="Proveedores top"
      getItemLabel={(provider, index) =>
        `Proveedor ${index + 1} de ${providers.length}: ${provider.name}`
      }
      renderCard={(provider, providerIndex, cardWidth) => (
        <ProviderCard
          provider={provider}
          onPress={() => onProviderPress(provider)}
          style={[styles.card, { width: cardWidth }]}
          testID={`featured-provider-card-${providerIndex}`}
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
