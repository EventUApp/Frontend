import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';
import Animated from 'react-native-reanimated';
import { LayoutAnimation } from '../../constants/animations';
import { ScreenContainer, Avatar, EmptyState } from '../../components';
import { ChatConversation } from '../../types';

export default function ChatsScreen() {
  const { conversations, currentUser } = useAppStore();
  const isProvider = currentUser.role === 'provider';

  const renderConversation = ({ item }: { item: ChatConversation }) => {
    const avatarUrl = isProvider ? item.clientAvatar : item.providerAvatar;
    const name = isProvider ? item.clientName : item.providerName;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.chatCard}
        onPress={() => router.push(`/chat/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`${name}. ${item.eventName}, ${item.serviceName}`}
        accessibilityHint={`Último mensaje: ${item.lastMessage}. ${item.lastMessageTime}${
          item.unreadCount > 0 ? `. ${item.unreadCount} sin leer` : ''
        }`}
      >
        <Avatar source={avatarUrl} name={name} size={50} />

        <View style={styles.contentCol}>
          <View style={styles.topRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.timeText}>{item.lastMessageTime}</Text>
          </View>

          {/* Context pill: Event & Service */}
          <View style={styles.contextRow}>
            <View style={styles.contextBadge}>
              <Text style={styles.contextEventText} numberOfLines={1}>
                🎉 {item.eventName}
              </Text>
            </View>
            <Text style={styles.contextServiceText} numberOfLines={1}>
              • {item.serviceName}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer backgroundColor={Colors.slate50}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isProvider ? 'Mensajes de Clientes' : 'Mensajes con Proveedores'}
        </Text>
        <Text style={styles.headerSubtitle}>
          Canal directo asociado a contrataciones y cotizaciones
        </Text>
      </View>

      <Animated.FlatList
        itemLayoutAnimation={LayoutAnimation}
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="Sin conversaciones aún"
            description="Tus chats con proveedores de servicios contratados o consultados aparecerán aquí."
          />
        }
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
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  contentCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    flex: 1,
    marginRight: Spacing.xs,
  },
  timeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  contextBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    maxWidth: '55%',
  },
  contextEventText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: Typography.weights.semibold,
  },
  contextServiceText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginLeft: 4,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
