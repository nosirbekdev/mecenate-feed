import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withSpring,
} from 'react-native-reanimated';

import { colors, spacing, typography } from '../theme';
import { formatCount } from '../utils/format';

type StatsRowProps = {
	likes?: number;
	comments?: number;
	isLiked?: boolean;
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
			<Ionicons name={icon} size={18} color={colors.textMuted} />
			<Text style={styles.value}>{formatCount(value)}</Text>
		</View>
	);
});

const LikeStatItem = memo(function LikeStatItem({
	initialValue,
	initialLiked,
}: {
	initialValue: number;
	initialLiked: boolean;
}) {
	const [liked, setLiked] = useState(initialLiked);
	const [likes, setLikes] = useState(initialValue);
	const progress = useSharedValue(initialLiked ? 1 : 0);

	useEffect(() => {
		setLiked(initialLiked);
		setLikes(initialValue);
		progress.value = initialLiked ? 1 : 0;
	}, [initialLiked, initialValue, progress]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 + progress.value * 0.06 }],
	}));

	const onToggleLike = useCallback(() => {
		setLiked(currentLiked => {
			const nextLiked = !currentLiked;

			setLikes(currentLikes => Math.max(0, currentLikes + (nextLiked ? 1 : -1)));
			progress.value = withSequence(
				withSpring(nextLiked ? 1.2 : 0.85, { damping: 12, stiffness: 260 }),
				withSpring(nextLiked ? 1 : 0, { damping: 14, stiffness: 220 }),
			);

			return nextLiked;
		});
	}, [progress]);

	return (
		<Animated.View style={[styles.item, animatedStyle]}>
			<Pressable accessibilityRole='button' onPress={onToggleLike} style={styles.likeButton}>
				<Ionicons
					name={liked ? 'heart' : 'heart-outline'}
					size={18}
					color={liked ? colors.danger : colors.textMuted}
				/>
				<Text style={[styles.value, liked ? styles.valueLiked : null]}>{formatCount(likes)}</Text>
			</Pressable>
		</Animated.View>
	);
});

export const StatsRow = memo(function StatsRow({
	likes = 0,
	comments = 0,
	isLiked = false,
}: StatsRowProps) {
	return (
		<View style={styles.row}>
			<LikeStatItem initialValue={likes} initialLiked={isLiked} />
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
