import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';

import type { Post } from '../api/types';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { FeedPostCard } from '../components/FeedPostCard';
import { FeedTabs } from '../components/FeedTabs';
import { SkeletonCard } from '../components/SkeletonCard';
import { useFeed } from '../hooks/useFeed';
import { useRootStore } from '../store/rootStore';
import { colors, spacing, typography } from '../theme';

const ERROR_MESSAGE = '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438';
const RETRY_LABEL = '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c';
const FEED_TITLE = '\u041b\u0435\u043d\u0442\u0430';

const keyExtractor = (item: Post) => item.id;

export const FeedScreen = observer(function FeedScreen() {
  const { ui } = useRootStore();
  const {
    posts,
    refresh,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefreshing,
    isInitialLoading,
    isError,
    refetch,
  } = useFeed({ tier: ui.tierFilter, simulateError: false, limit: 10 });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  if (isInitialLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.listContent}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <ErrorState
          message={ERROR_MESSAGE}
          retryLabel={RETRY_LABEL}
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => <FeedPostCard post={item} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>{FEED_TITLE}</Text>
              <FeedTabs value={ui.tierFilter} onChange={ui.setTierFilter} />
            </View>
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
          contentContainerStyle={styles.listContent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.purple} />}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerSpacing: {
    height: spacing.md,
  },
});
