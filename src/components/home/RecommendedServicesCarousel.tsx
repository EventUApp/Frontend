import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Spacing } from '../../theme';
import { ServiceCard } from '../domain/ServiceCard';
import { Service } from '../../types';

const CARD_WIDTH = 280;
const CARD_GAP = 12;

interface RecommendedServicesCarouselProps {
  services: Service[];
  cartServiceIds: string[];
  onServicePress: (service: Service) => void;
  onAddToCart: (service: Service) => void;
}

/** Carrusel horizontal de servicios con snap centrado premium. */
export const RecommendedServicesCarousel: React.FC<RecommendedServicesCarouselProps> = ({
  services,
  cartServiceIds,
  onServicePress,
  onAddToCart,
}) => {
  return (
    <FlatList
      horizontal
      data={services}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + CARD_GAP}
      snapToAlignment="center"
      initialNumToRender={3}
      windowSize={3}
      removeClippedSubviews
      getItemLayout={(_, index) => ({
        length: CARD_WIDTH + CARD_GAP,
        offset: (CARD_WIDTH + CARD_GAP) * index,
        index,
      })}
      renderItem={({ item: service }) => (
        <View style={styles.cardWrap}>
          <ServiceCard
            service={service}
            onPress={() => onServicePress(service)}
            onAddToCart={() => onAddToCart(service)}
            isInCart={cartServiceIds.includes(service.id)}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: Spacing.xs,
  },
  cardWrap: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
  },
});
