import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FeedTier } from '../api/types';
import { colors, radius, spacing, typography } from '../theme';

type FeedTabsProps = {
  value: FeedTier;
  onChange: (tier: FeedTier) => void;
};

const tabs: Array<{ key: FeedTier; label: string }> = [
  { key: 'all', label: '\u0412\u0441\u0435' },
  { key: 'free', label: '\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0435' },
  { key: 'paid', label: '\u041f\u043b\u0430\u0442\u043d\u044b\u0435' },
];

export const FeedTabs = memo(function FeedTabs({ value, onChange }: FeedTabsProps) {
  return (
    <View style={styles.row}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.text,
    fontWeight: '700',
  },
});

export type { FeedTabsProps };
