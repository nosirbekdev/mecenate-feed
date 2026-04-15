import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { formatCount } from '../utils/format';

type StatsRowProps = {
  likes?: number;
  comments?: number;
};

const StatItem = memo(function StatItem({
  icon,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
}) {
  return (
    <View style={styles.item}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.value}>{formatCount(value)}</Text>
    </View>
  );
});

export const StatsRow = memo(function StatsRow({ likes = 0, comments = 0 }: StatsRowProps) {
  return (
    <View style={styles.row}>
      <StatItem icon="heart-outline" value={likes} />
      <StatItem icon="chatbubble-ellipses-outline" value={comments} />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  value: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
});

export type { StatsRowProps };
