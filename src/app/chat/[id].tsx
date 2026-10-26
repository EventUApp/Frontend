import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { ScreenContainer, AppHeader, ChatBubble, Avatar, EmptyState } from '../../components';
import { stagger } from '../../constants/animations';

export default function SingleChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { conversations, messages, sendMessage, currentUser } = useAppStore();
  const insets = useSafeAreaInsets();

  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<any>(null);

  const isProvider = currentUser.role === 'provider';
  const conversation = conversations.find((c) => c.id === id);
  const chatMessages = conversation ? (messages[conversation.id] ?? []) : [];

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 80);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages.length]);

  // Si el teclado está abierto, el KAV ya empuja la barra sobre las teclas:
  // no sumamos insets.bottom para no dejar un espacio en blanco innecesario.
  const inputBarPaddingBottom = isKeyboardVisible
    ? Spacing.xs
    : Math.max(insets.bottom, Spacing.sm);

  // Sin esta guarda la pantalla lee conversations[0] y muestra otro chat
  // cuando el id no existe. Va después de todos los hooks por reglas de React.
  if (!conversation) {
    return (
      <ScreenContainer backgroundColor={Colors.slate50} edges={['top']} avoidKeyboard={false}>
        <AppHeader title="Conversación no encontrada" showBack />
        <EmptyState
          icon="chatbubbles-outline"
          title="Conversación no encontrada"
          description="Este chat no existe o ya no está disponible."
          actionTitle="Volver a mis chats"
          onActionPress={() => router.replace('/chats')}
        />
      </ScreenContainer>
    );
  }

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) return;
    sendMessage(conversation.id, trimmed);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const handleAttachMock = () => {
    sendMessage(
      conversation.id,
      '📎 [Documento adjunto: Comprobante_Contrato_Eventos.pdf]'
    );
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

    const otherName = isProvider ? conversation.clientName : conversation.providerName;
    const otherAvatar = isProvider ? conversation.clientAvatar : conversation.providerAvatar;
    const canSend = inputText.trim().length > 0;

    return (
      <ScreenContainer backgroundColor={Colors.slate50} edges={['top']} avoidKeyboard={false}>
        {/* Unico KAV de la pantalla (el de `ScreenContainer` esta
            desactivado): en iOS compensa el area superior, en Android el
            modo `height` encoge la vista y el teclado nunca tapa la barra
            de escritura. */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
          style={styles.keyboardView}
        >
        <AppHeader
          title={otherName}
          subtitle={`${conversation.eventName} • ${conversation.serviceName}`}
          showBack
          rightElement={<Avatar source={otherAvatar} name={otherName} size={36} />}
        />

        {/* Context Badge Ribbon */}
        <View
          style={styles.contextRibbon}
          accessibilityRole="summary"
          accessibilityLabel={`Canal verificado para el evento ${conversation.eventName}, servicio ${conversation.serviceName}`}
        >
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={Colors.primary}
            accessibilityElementsHidden
          />
          <Text style={styles.contextRibbonText} numberOfLines={1} accessibilityElementsHidden>
            Canal verificado para:{' '}
            <Text style={styles.bold}>{conversation.eventName}</Text> ({conversation.serviceName})
          </Text>
        </View>

        {/* Messages List */}
        {/* `style.messagesListFlex` es imprescindible: sin flex:1 la lista
            crece hasta la altura de todo su contenido y empuja la barra de
            escritura fuera de la pantalla. */}
        <FlatList
          ref={flatListRef}
          style={styles.messagesListFlex}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="interactive"
          renderItem={({ item, index }) => {
            const isMe = isProvider
              ? item.senderRole === 'provider'
              : item.senderRole === 'client';
            return (
              // Entrada sutil y escalonada: da sensacion de continuidad sin
              // competir con la lectura. Se limita a los primeros elementos
              // (ver `stagger`) para no retrasar una lista larga.
              <Animated.View entering={stagger(index)}>
                <ChatBubble message={item} isMe={isMe} />
              </Animated.View>
            );
          }}
          contentContainerStyle={styles.messagesList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Ionicons name="chatbubble-ellipses-outline" size={32} color={Colors.slate300} />
              <Text style={styles.emptyMessagesText}>
                Aún no hay mensajes. Envía el primero para iniciar la conversación.
              </Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: inputBarPaddingBottom }]}>
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={handleAttachMock}
            accessibilityRole="button"
            accessibilityLabel="Adjuntar documento"
          >
            <Ionicons name="attach" size={22} color={Colors.slate500} accessibilityElementsHidden />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Escribe un mensaje a ${isProvider ? 'el cliente' : 'el proveedor'}...`}
            placeholderTextColor={Colors.slate400}
            multiline
            accessibilityLabel="Mensaje"
          />

          <TouchableOpacity
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            accessibilityState={{ disabled: !canSend }}
          >
            <Ionicons name="send" size={18} color={Colors.white} accessibilityElementsHidden />
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    </ScreenContainer>
    );
  }

  const styles = StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    contextRibbon: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primaryLight,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: Colors.slate200,
    },
    contextRibbonText: {
      fontSize: Typography.sizes.xs,
      color: Colors.slate700,
      marginLeft: Spacing.xs,
      flex: 1,
    },
    bold: {
      fontWeight: Typography.weights.bold,
      color: Colors.primaryDark,
    },
    messagesListFlex: {
      flex: 1,
    },
    messagesList: {
      paddingHorizontal: Spacing.xs,
      paddingTop: Spacing.md,
      // Sin paddingBottom: la separacion con la barra de escritura la dan
      // el marginVertical de cada burbuja. Aqui el scroll de pagina no aplica
      // SCROLL_BOTTOM_PADDING porque la barra de escritura es fija.
      flexGrow: 1,
    },
    emptyMessages: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xxl,
      gap: Spacing.sm,
    },
    emptyMessagesText: {
      fontSize: Typography.sizes.sm,
      lineHeight: Typography.lineHeights.sm,
      color: Colors.slate500,
      textAlign: 'center',
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: Spacing.xs,
      backgroundColor: Colors.white,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: Colors.slate200,
    },
    attachBtn: {
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.slate100,
    },
    textInput: {
      flex: 1,
      backgroundColor: Colors.slate100,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
      fontSize: Typography.sizes.md,
      lineHeight: Typography.lineHeights.md,
      color: Colors.slate900,
      maxHeight: 110,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnDisabled: {
      backgroundColor: Colors.slate300,
    },
  });
