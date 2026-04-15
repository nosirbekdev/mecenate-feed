import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '../theme';

type SkeletonCardProps = {
  withImage?: boolean;
};

type BoneWidth = number | `${number}%`;

const Bone = ({ width, height, rounded }: { width: BoneWidth; height: number; rounded?: boolean }) => (
  <View
    style={[
      styles.bone,
      {
        width,
        height,
        borderRadius: rounded ? 999 : radius.sm,
      },
    ]}
  />
);

export const SkeletonCard = memo(function SkeletonCard({ withImage = true }: SkeletonCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Bone width={40} height={40} rounded />
        <View style={styles.headerText}>
          <Bone width="62%" height={12} />
          <Bone width="35%" height={10} />
        </View>
      </View>

      <Bone width="100%" height={12} />
      <Bone width="88%" height={12} />
      <Bone width="76%" height={12} />

      {withImage ? <Bone width="100%" height={170} /> : null}


      <View style={styles.stats}>
        <Bone width={52} height={12} />
        <Bone width={52} height={12} />
        <Bone width={52} height={12} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  bone: {
    backgroundColor: colors.skeletonBase,
    marginBottom: spacing.xs,
  },
});

export type { SkeletonCardProps };
