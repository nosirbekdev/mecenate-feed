import { Ionicons } from '@expo/vector-icons';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createComment } from '../api/posts';
import type { Comment, CommentsData, PostsData } from '../api/types';
import { CommentPreview } from '../components/CommentPreview';
import { ErrorState } from '../components/ErrorState';
import { InputTextRow } from '../components/InputTextRow';
import { StatsRow } from '../components/StatsRow';
import { postQueryKeys } from '../hooks/useFeed';
import { commentsQueryKeys, usePostComments } from '../hooks/usePostComments';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { env } from '../utils/env';
import { formatDateTime } from '../utils/format';

type PostDetailRoute = RouteProp<RootStackParamList, 'PostDetail'>;

function prependComment(
  data: InfiniteData<CommentsData> | undefined,
  comment: Comment,
): InfiniteData<CommentsData> | undefined {
  if (!data) {
    return {
      pageParams: [null],
      pages: [{ comments: [comment], hasMore: false, nextCursor: null }],
    };
  }

  const [firstPage, ...restPages] = data.pages;
  const nextFirstPage = firstPage
    ? { ...firstPage, comments: [comment, ...firstPage.comments.filter((item) => item.id !== comment.id)] }
    : { comments: [comment], hasMore: false, nextCursor: null };

  return {
    ...data,
    pages: [nextFirstPage, ...restPages],
  };
}

function incrementFeedCommentCount(
  data: InfiniteData<PostsData> | undefined,
  postId: string,
): InfiniteData<PostsData> | undefined {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((item) =>
        item.id === postId ? { ...item, commentsCount: item.commentsCount + 1 } : item,
      ),
    })),
  };
}

export function PostDetailScreen() {
  const route = useRoute<PostDetailRoute>();
  const { post } = route.params;
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const { data: currentPost } = useQuery({
    queryKey: postQueryKeys.detail(post.id),
    queryFn: () => Promise.resolve(post),
    initialData: post,
    staleTime: Infinity,
  });
  const commentsQueryKey = useMemo(() => commentsQueryKeys.list(post.id, 20), [post.id]);
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    isError,
    refetch,
  } = usePostComments(post.id);

  useEffect(() => {
    const socket = new WebSocket(env.getCommentsWebSocketUrl(post.id));

    socket.addEventListener('message', (event) => {
      try {
        const comment = JSON.parse(String(event.data)) as Comment;

        if (comment.postId === post.id) {
          queryClient.setQueryData<InfiniteData<CommentsData>>(commentsQueryKey, (current) =>
            prependComment(current, comment),
          );
          queryClient.setQueriesData<InfiniteData<PostsData>>({ queryKey: ['feed'] }, (current) =>
            incrementFeedCommentCount(current, post.id),
          );
          queryClient.setQueryData(postQueryKeys.detail(post.id), (current: typeof currentPost | undefined) => ({
            ...(current ?? currentPost),
            commentsCount: (current ?? currentPost).commentsCount + 1,
          }));
        }
      } catch {
        // Ignore malformed live-update payloads.
      }
    });

    return () => {
      socket.close();
    };
  }, [commentsQueryKey, post.id, queryClient]);

  const commentMutation = useMutation({
    mutationFn: (nextText: string) => createComment({ postId: post.id, text: nextText }),
    onSuccess: async (comment) => {
      setText('');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.setQueryData<InfiniteData<CommentsData>>(commentsQueryKey, (current) =>
        prependComment(current, comment),
      );
      queryClient.setQueriesData<InfiniteData<PostsData>>({ queryKey: ['feed'] }, (current) =>
        incrementFeedCommentCount(current, post.id),
      );
      queryClient.setQueryData(postQueryKeys.detail(post.id), (current: typeof currentPost | undefined) => ({
        ...(current ?? currentPost),
        commentsCount: (current ?? currentPost).commentsCount + 1,
      }));
    },
    onError: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const onSend = useCallback(() => {
    const trimmed = text.trim();

    if (trimmed.length === 0 || commentMutation.isPending) {
      return;
    }

    commentMutation.mutate(trimmed);
  }, [commentMutation, text]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}
        style={styles.keyboard}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.postCard}>
              <Text style={styles.author}>{currentPost.author.displayName}</Text>
              <Text style={styles.meta}>
                @{currentPost.author.username} {'\u2022'} {formatDateTime(currentPost.createdAt)}
              </Text>
              <Image source={currentPost.coverUrl} contentFit="cover" style={styles.cover} transition={120} />
              <Text style={styles.title}>{currentPost.title}</Text>
              <Text style={styles.body}>{currentPost.body}</Text>
              <StatsRow
                postId={currentPost.id}
                likes={currentPost.likesCount}
                comments={currentPost.commentsCount}
                isLiked={currentPost.isLiked}
              />
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>{'\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438'}</Text>
                {isInitialLoading ? <ActivityIndicator color={colors.purple} /> : null}
              </View>
            </View>
          }
          ListEmptyComponent={
            isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : isInitialLoading ? null : (
              <Text style={styles.emptyText}>{'\u041f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432'}</Text>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.purple} />
              </View>
            ) : (
              <View style={styles.footerSpacing} />
            )
          }
          contentContainerStyle={styles.content}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => <CommentPreview authorName={item.author.displayName} text={item.text} />}
        />

        <View style={styles.inputBar}>
          <InputTextRow
            editable={!commentMutation.isPending}
            onChangeText={setText}
            onSubmitEditing={onSend}
            value={text}
          />
          <Pressable
            accessibilityRole="button"
            disabled={commentMutation.isPending || text.trim().length === 0}
            onPress={onSend}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendPressed,
              (commentMutation.isPending || text.trim().length === 0) && styles.sendDisabled,
            ]}
          >
            <Ionicons name="send" size={18} color={colors.surface} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    gap: spacing.md,
    padding: spacing.sm,
    paddingBottom: spacing.lg,
  },
  postCard: {
    ...shadows.card,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.md,
  },
  author: {
    ...typography.h3,
    color: colors.text,
  },
  meta: {
    ...typography.body,
    color: colors.textMuted,
  },
  cover: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    height: 240,
    width: '100%',
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  body: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  commentsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  commentsTitle: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    padding: spacing.md,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerSpacing: {
    height: spacing.md,
  },
  inputBar: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.purple,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sendPressed: {
    opacity: 0.86,
  },
  sendDisabled: {
    opacity: 0.48,
  },
});
