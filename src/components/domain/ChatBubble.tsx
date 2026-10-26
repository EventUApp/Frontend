import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';

interface ChatBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMe }) => {
  const statusLabel =
    message.status === 'read'
      ? 'Leído'
      : message.status === 'delivered'
        ? 'Entregado'
        : 'Enviado';

  // Agrupado en un solo nodo: la alineacion y el color no bastan para que
  // un lector de pantalla distinga un mensaje propio de uno ajeno, ni para
  // transmitir el estado de entrega.
  return (
    <View
      style={[styles.container, isMe ? styles.alignRight : styles.alignLeft]}
      accessible
      accessibilityLabel={`${isMe ? 'Tú' : 'Proveedor'}: ${message.text}. ${
        message.timestamp
      }${isMe ? `. ${statusLabel}` : ''}`}
    >
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
        ]}
      >
        <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]} accessibilityElementsHidden>
          {message.text}
        </Text>

        <View style={styles.metaRow}>
          <Text
            style={[styles.timeText, isMe ? styles.timeMe : styles.timeOther]}
            accessibilityElementsHidden
          >
            {message.timestamp}
          </Text>
          {isMe && (
            // Blanco puro en ambos estados: el azul claro de "leído" y el
            // blanco atenuado (~3.9:1 y ~4.2:1) no llegan al 4.5:1 de WCAG AA
            // sobre el primario; el estado se distingue por el ícono
            // (doble vs. simple check) y el anuncio accesible.
            <Ionicons
              name={message.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={13}
              color={Colors.white}
              style={styles.statusIcon}
              accessibilityElementsHidden
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.xl,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    // Cola de globo asimétrica clásica del lado propio.
    borderBottomRightRadius: BorderRadius.xs,
    ...Shadows.sm,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: Colors.slate200,
    ...Shadows.sm,
  },
  text: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
  },
  textMe: {
    color: Colors.white,
  },
  textOther: {
    color: Colors.slate900,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.xs,
  },
  timeText: {
    fontSize: Typography.sizes.xs,
  },
  timeMe: {
    // Blanco puro (~5.8:1 sobre el primario); el tono atenuado no
    // alcanzaba el 4.5:1 de WCAG AA para texto de 12px.
    color: Colors.white,
  },
  timeOther: {
    color: Colors.slate400,
  },
  statusIcon: {
    marginLeft: 3,
  },
});
