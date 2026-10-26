import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { UserRole } from '../../types';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchRole } = useAppStore();

  const roles: { role: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { role: 'client', label: 'Cliente', icon: 'person' },
    { role: 'provider', label: 'Proveedor', icon: 'briefcase' },
    { role: 'guest', label: 'Invitado', icon: 'eye' },
  ];

  const handleRoleSelect = (newRole: UserRole) => {
    if (currentUser.role === newRole) return;
    switchRole(newRole);
    if (newRole === 'provider') {
      router.replace('/provider-dashboard');
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.floatingPill}>
      {/* Small Demo Pill Indicator */}
      <View style={styles.indicatorPill}>
        <View style={styles.pulseDot} />
        <Text style={styles.demoLabel}>DEMO</Text>
      </View>

      {/* Segmented Button Group */}
      <View style={styles.buttonGroup}>
        {roles.map((item) => {
          const isActive = currentUser.role === item.role;
          return (
            <TouchableOpacity
              key={item.role}
              activeOpacity={0.8}
              onPress={() => handleRoleSelect(item.role)}
              style={[styles.roleBtn, isActive && styles.roleBtnActive]}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
            >
              <Ionicons
                name={item.icon}
                size={13}
                color={isActive ? Colors.white : Colors.slate600}
                style={styles.btnIcon}
                accessibilityElementsHidden
              />
              <Text style={[styles.roleText, isActive && styles.roleTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingPill: {
    marginHorizontal: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
      },
    }),
  },
  indicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginLeft: 2,
    marginRight: 6,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  demoLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: BorderRadius.full,
    padding: 2,
  },
roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: BorderRadius.sm,
  },
  roleBtnActive: {
    backgroundColor: Colors.primary,
  },
  btnIcon: {
    marginRight: 3,
  },
  roleText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: Typography.weights.medium,
  },
  roleTextActive: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
});
