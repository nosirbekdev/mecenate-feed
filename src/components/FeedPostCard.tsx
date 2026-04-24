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
            @{post.author.username} {'\u2022'} {formatDateTime(post.createdAt)}
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

      <StatsRow likes={post.likesCount} comments={post.commentsCount} isLiked={post.isLiked} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  authorName: {
    ...typography.h3,
    color: colors.text,
  },
  meta: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  mediaWrap: {
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  media: {
    backgroundColor: colors.surfaceMuted,
    height: 210,
    width: '100%',
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  preview: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});

export type { FeedPostCardProps };
