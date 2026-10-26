import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { mockProviders } from '../../mocks';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import {
  ScreenContainer,
  AppHeader,
  ServiceCard,
  EmptyState,
} from '../../components';
import { ProviderProfileCard } from '../../components/provider/ProviderProfileCard';
import { ProviderGallery } from '../../components/provider/ProviderGallery';
import { ProviderReviews } from '../../components/provider/ProviderReviews';

/** Controlador del perfil: guarda, header y servicios ofertados. */
export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeCart, addServiceToCart, providerServices: allServices, conversations } = useAppStore();

  const provider = mockProviders.find((p) => p.id === id);

  if (!provider) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50}>
        <AppHeader title="Proveedor no encontrado" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Proveedor no encontrado"
          description="El proveedor que buscas no existe o no está disponible."
          actionTitle="Volver al inicio"
          onActionPress={() => router.replace('/')}
        />
      </ScreenContainer>
    );
  }

  const providerServices = allServices.filter((s) => s.providerId === provider.id);

  const handleChatPress = () => {
    const existingChat = conversations.find((c) => c.providerId === provider.id);
    if (existingChat) {
      router.push(`/chat/${existingChat.id}`);
    } else {
      router.push('/chats');
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <AppHeader
        title={provider.name}
        subtitle={provider.category}
        showBack
        rightElement={
          <TouchableOpacity
            onPress={() => router.push('/chats')}
            accessibilityRole="button"
            accessibilityLabel="Ir a mis chats"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProviderProfileCard provider={provider} onChatPress={handleChatPress} />

        <ProviderGallery images={provider.gallery} />

        {/* Services Offered */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Servicios Ofertados ({providerServices.length})
          </Text>

          {providerServices.map((service) => {
            const isInCart = activeCart.services.some((s) => s.serviceId === service.id);
            return (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => router.push(`/service/${service.id}`)}
                onAddToCart={() => addServiceToCart(service, 1)}
                isInCart={isInCart}
              />
            );
          })}
        </View>

        <ProviderReviews reviews={provider.reviews} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  section: {
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: Spacing.md,
  },
});
