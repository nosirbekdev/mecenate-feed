import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import type { Post } from '../api/types';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { formatDateTime } from '../utils/format';
import { Avatar } from './Avatar';
import { PaidPostOverlay } from './PaidPostOverlay';
import { StatsRow } from './StatsRow';

type FeedPostCardProps = {
  post: Post;
  onPressSubscribe?: () => void;
};

export const FeedPostCard = memo(function FeedPostCard({ post, onPressSubscribe }: FeedPostCardProps) {
  const isPaid = post.tier === 'paid';

  return (
    <Pressable style={styles.card}>
      <View style={styles.header}>
        <Avatar name={post.author.displayName} uri={post.author.avatarUrl} />
        <View style={styles.headerText}>
          <Text style={styles.authorName} numberOfLines={1}>
            {post.author.displayName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            @{post.author.username} - {formatDateTime(post.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.mediaWrap}>
        <Image source={post.coverUrl} contentFit="cover" style={styles.media} transition={120} />
        {isPaid ? <PaidPostOverlay onPressSubscribe={onPressSubscribe} /> : null}
      </View>

      {!isPaid ? (
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
      ) : null}
      {!isPaid ? (
        <Text style={styles.preview} numberOfLines={3}>
          {post.preview}
        </Text>
      ) : null}

      <StatsRow likes={post.likesCount} comments={post.commentsCount} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  authorName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  mediaWrap: {
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  media: {
    backgroundColor: colors.surfaceMuted,
    height: 170,
    width: '100%',
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  preview: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});

export type { FeedPostCardProps };
