import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Rating } from '../ui/Rating';
import { AppButton } from '../ui/AppButton';
import { Provider } from '../../types';

interface ProviderProfileCardProps {
  provider: Provider;
  onChatPress: () => void;
}

/** Cabecera del perfil con botones de contacto (chat/teléfono). */
export const ProviderProfileCard: React.FC<ProviderProfileCardProps> = ({
  provider,
  onChatPress,
}) => {
  const handleCall = () => {
    if (provider.phone) {
      const phoneUrl = `tel:${provider.phone.replace(/[^0-9+]/g, '')}`;
      Linking.canOpenURL(phoneUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(phoneUrl);
          } else {
            Alert.alert('Contacto Telefónico', `Número directo del proveedor: ${provider.phone}`);
          }
        })
        .catch(() => {
          Alert.alert('Contacto Telefónico', `Número directo del proveedor: ${provider.phone}`);
        });
    } else {
      Alert.alert('Contacto', 'El proveedor no tiene teléfono publicado.');
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(80).reduceMotion(ReduceMotion.System)}
      style={styles.header}
    >
      <Avatar
        source={provider.logo}
        name={provider.name}
        size={76}
        verified={provider.verified}
      />
      <Text style={styles.name}>{provider.name}</Text>
      <Text style={styles.category}>{provider.category}</Text>

      <View style={styles.metaRow}>
        <Rating score={provider.rating} count={provider.reviewCount} size={14} />
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.experience}>
          {provider.experienceYears} años de experiencia
        </Text>
      </View>

      <View style={styles.locationBox}>
        <Ionicons name="location-outline" size={14} color={Colors.slate500} />
        <Text style={styles.locationText}>{provider.location}</Text>
      </View>

      <Text style={styles.description}>{provider.description}</Text>

      <View style={styles.contactRow}>
        <AppButton
          title="Contactar por Chat"
          icon="chatbubble-outline"
          size="sm"
          onPress={onChatPress}
          style={styles.chatBtn}
        />
        <AppButton
          title="Llamar"
          icon="call-outline"
          size="sm"
          variant="outline"
          onPress={handleCall}
          style={styles.callBtn}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.slate900,
    marginTop: Spacing.sm,
  },
  category: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaDot: {
    marginHorizontal: Spacing.xs,
    color: Colors.slate300,
  },
  experience: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginLeft: 3,
  },
  description: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.slate600,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: Spacing.xs,
  },
  chatBtn: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  callBtn: {
    flex: 1,
  },
});
