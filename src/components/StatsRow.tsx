import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withSpring,
} from 'react-native-reanimated';

import { togglePostLike } from '../api/posts';
import type { Post, PostsData } from '../api/types';
import { feedQueryKeys, postQueryKeys } from '../hooks/useFeed';
import { colors, spacing, typography } from '../theme';
import { formatCount } from '../utils/format';

type StatsRowProps = {
  postId: string;
	likes?: number;
	comments?: number;
	isLiked?: boolean;
};

type LikeMutationContext = {
  previousDetailPost: Post | undefined;
  previousFeedPages: Array<[readonly unknown[], InfiniteData<PostsData> | undefined]>;
};

function updatePostLike(post: Post, liked: boolean): Post {
  const likeDelta = liked === post.isLiked ? 0 : liked ? 1 : -1;

  return {
    ...post,
    isLiked: liked,
    likesCount: Math.max(0, post.likesCount + likeDelta),
  };
}

function updateFeedPost(
  data: InfiniteData<PostsData> | undefined,
  postId: string,
  liked: boolean,
): InfiniteData<PostsData> | undefined {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) => (post.id === postId ? updatePostLike(post, liked) : post)),
    })),
  };
}

const StatItem = memo(function StatItem({
	icon,
	value,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	value: number;
}) {
	return (
		<View style={styles.item}>
			<Ionicons name={icon} size={18} color={colors.textMuted} />
			<Text style={styles.value}>{formatCount(value)}</Text>
		</View>
	);
});

const LikeStatItem = memo(function LikeStatItem({
  postId,
	value,
	isLiked,
}: {
  postId: string;
	value: number;
	isLiked: boolean;
}) {
  const queryClient = useQueryClient();
	const progress = useSharedValue(isLiked ? 1 : 0);

	useEffect(() => {
		progress.value = isLiked ? 1 : 0;
	}, [isLiked, progress]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 + progress.value * 0.06 }],
	}));

  const likeMutation = useMutation<Post, Error, boolean, LikeMutationContext>({
    mutationFn: (nextLiked) => togglePostLike(postId, nextLiked),
    onMutate: async (nextLiked) => {
      await Haptics.selectionAsync();
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.all });

      const previousFeedPages = queryClient.getQueriesData<InfiniteData<PostsData>>({
        queryKey: feedQueryKeys.all,
      });
      const detailQueryKey = postQueryKeys.detail(postId);
      const previousDetailPost = queryClient.getQueryData<Post>(detailQueryKey);

      queryClient.setQueriesData<InfiniteData<PostsData>>(
        { queryKey: feedQueryKeys.all },
        (current) => updateFeedPost(current, postId, nextLiked),
      );
      queryClient.setQueryData<Post>(detailQueryKey, (current) =>
        current ? updatePostLike(current, nextLiked) : current,
      );

      progress.value = withSequence(
        withSpring(nextLiked ? 1.2 : 0.85, { damping: 12, stiffness: 260 }),
        withSpring(nextLiked ? 1 : 0, { damping: 14, stiffness: 220 }),
      );

      return { previousDetailPost, previousFeedPages };
    },
    onError: (_error, _nextLiked, context) => {
      context?.previousFeedPages.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      queryClient.setQueryData(postQueryKeys.detail(postId), context?.previousDetailPost);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
    },
  });

	const onToggleLike = useCallback(() => {
    likeMutation.mutate(!isLiked);
	}, [isLiked, likeMutation]);

	return (
		<Animated.View style={[styles.item, animatedStyle]}>
			<Pressable accessibilityRole='button' onPress={onToggleLike} style={styles.likeButton}>
				<Ionicons
					name={isLiked ? 'heart' : 'heart-outline'}
					size={18}
					color={isLiked ? colors.danger : colors.textMuted}
				/>
				<Text style={[styles.value, isLiked ? styles.valueLiked : null]}>{formatCount(value)}</Text>
			</Pressable>
		</Animated.View>
	);
});

export const StatsRow = memo(function StatsRow({
  postId,
	likes = 0,
	comments = 0,
	isLiked = false,
}: StatsRowProps) {
	return (
		<View style={styles.row}>
			<LikeStatItem postId={postId} value={likes} isLiked={isLiked} />
			<StatItem icon='chatbubble-ellipses-outline' value={comments} />
		</View>
	);
});

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	item: {
		alignItems: 'center',
		backgroundColor: 'transparent',
		flexDirection: 'row',
		minHeight: 28,
	},
	likeButton: {
		alignItems: 'center',
		backgroundColor: 'transparent',
		flexDirection: 'row',
		minHeight: 28,
	},
	value: {
		...typography.body,
		color: colors.textMuted,
		marginLeft: spacing.xs,
	},
	valueLiked: {
		color: colors.danger,
	},
});

export type { StatsRowProps };
