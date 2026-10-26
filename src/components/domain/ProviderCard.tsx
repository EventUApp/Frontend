import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Rating } from '../ui/Rating';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onPress,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.card, style]}
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${provider.name}${provider.verified ? ', verificado' : ''}`}
      accessibilityHint={`${provider.category}, ${provider.experienceYears} años de experiencia`}
    >
      <View style={styles.topRow}>
        <Avatar
          source={provider.logo}
          name={provider.name}
          size={52}
          verified={provider.verified}
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {provider.name}
            </Text>
          </View>
          <Text style={styles.category}>{provider.category}</Text>
          <View style={styles.metaRow}>
            <Rating score={provider.rating} count={provider.reviewCount} size={12} />
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.expText}>{provider.experienceYears} años exp.</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {provider.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationBox}>
          <Ionicons name="location-outline" size={14} color={Colors.slate400} />
          <Text style={styles.locationText} numberOfLines={1}>
            {provider.location}
          </Text>
        </View>

        <View style={styles.servicesBadge}>
          <Text style={styles.servicesCountText}>
            {provider.servicesCount} servicios
          </Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  category: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginVertical: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaDot: {
    marginHorizontal: Spacing.xs,
    color: Colors.slate300,
  },
  expText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  description: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.sm,
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginLeft: 3,
  },
  servicesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicesCountText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    marginRight: 2,
  },
});
