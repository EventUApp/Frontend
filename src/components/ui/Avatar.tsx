import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography } from '../../theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  verified?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = 'U',
  size = 44,
  verified = false,
  style,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[{ width: size, height: size }, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
      )}

      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: size * 0.35,
              height: size * 0.35,
              borderRadius: (size * 0.35) / 2,
              bottom: 0,
              right: 0,
            },
          ]}
        >
          <Ionicons name="checkmark" size={size * 0.22} color={Colors.white} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.slate200,
  },
  fallback: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  initials: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: Colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});
