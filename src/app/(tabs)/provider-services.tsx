import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LayoutAnimation, stagger } from '../../constants/animations';
import { ScreenContainer, AppButton, PriceTag } from '../../components';
import { Service } from '../../types';

interface ProviderServiceCardProps {
  item: Service;
  index: number;
  onToggleAvailability: (id: string) => void;
}

const ProviderServiceCard: React.FC<ProviderServiceCardProps> = ({
  item,
  index,
  onToggleAvailability,
}) => {
  const toggleScale = useSharedValue(1);

  const animatedToggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: toggleScale.value }],
  }));

  const handleToggle = () => {
    toggleScale.value = withSequence(
      withTiming(0.88, { duration: 80 }),
      withSpring(1, { damping: 10, stiffness: 220 })
    );
    onToggleAvailability(item.id);
  };

  return (
    <Animated.View entering={stagger(index)} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.categoryName}</Text>
        </View>

        <Animated.View style={animatedToggleStyle}>
          <TouchableOpacity
            style={[
              styles.statusToggle,
              item.available ? styles.statusActive : styles.statusPaused,
            ]}
            onPress={handleToggle}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar estado de ${item.name}, actualmente ${item.available ? 'Publicado' : 'Pausado'}`}
          >
            <Ionicons
              name={item.available ? 'checkmark-circle' : 'pause-circle'}
              size={14}
              color={item.available ? Colors.success : Colors.slate500}
            />
            <Text
              style={[
                styles.statusText,
                item.available ? styles.statusTextActive : styles.statusTextPaused,
              ]}
            >
              {item.available ? 'Publicado' : 'Pausado'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.shortDescription}
      </Text>

      <View style={styles.pricingRow}>
        <PriceTag price={item.price} unit={item.priceUnit} size="md" />
        <Text style={styles.locationText}>{item.location.split(',')[0]}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/provider-portal/update-price?serviceId=${item.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Actualizar precio de ${item.name}`}
        >
          <Ionicons name="pricetag-outline" size={14} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Actualizar precio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/provider-portal/service-edit?id=${item.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Editar servicio ${item.name}`}
        >
          <Ionicons name="create-outline" size={14} color={Colors.slate700} />
          <Text style={[styles.actionBtnText, { color: Colors.slate700 }]}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/service/${item.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${item.name}`}
        >
          <Ionicons name="eye-outline" size={14} color={Colors.slate500} />
          <Text style={[styles.actionBtnText, { color: Colors.slate500 }]}>Ver</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function ProviderServicesScreen() {
  const { providerServices, toggleServiceAvailability, currentUser } = useAppStore();

  useEffect(() => {
    if (currentUser.role !== 'provider') {
      router.replace('/');
    }
  }, [currentUser.role]);

  if (currentUser.role !== 'provider') {
    return null;
  }

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Mis Servicios ({providerServices.length})</Text>
          <AppButton
            title="+ Nuevo Servicio"
            size="sm"
            onPress={() => router.push('/provider-portal/service-edit')}
          />
        </View>
        <Text style={styles.headerSubtitle}>
          Administra la disponibilidad, detalles y tarifas de tu catálogo
        </Text>
      </View>

      <Animated.FlatList
        itemLayoutAnimation={LayoutAnimation}
        data={providerServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProviderServiceCard
            item={item}
            index={index}
            onToggleAvailability={toggleServiceAvailability}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusPaused: {
    backgroundColor: Colors.slate100,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextPaused: {
    color: Colors.slate500,
  },
  serviceName: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginBottom: 4,
  },
  description: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.slate50,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: Spacing.sm,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.slate100,
  },
  actionBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
});
