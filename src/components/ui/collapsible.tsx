import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Colors, Spacing, Typography } from '../../theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Pressable
        style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={styles.button}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="bold"
            tintColor={Colors.slate700}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.xl,
    height: Spacing.xl,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: '600',
    color: Colors.slate700,
  },
  content: {
    marginTop: Spacing.md,
    borderRadius: Spacing.md,
    marginLeft: Spacing.xl,
    padding: Spacing.xl,
  },
});
