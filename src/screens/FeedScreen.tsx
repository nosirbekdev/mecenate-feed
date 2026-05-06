import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { FEED_ERROR_MESSAGE, RETRY_LABEL } from '../constants/messages';
import { useFeed } from '../hooks/useFeed';
import type { RootStackParamList } from '../navigation/types';
import { useRootStore } from '../store/rootStore';
import { colors, spacing, typography } from '../theme';

const FEED_TITLE = '\u041b\u0435\u043d\u0442\u0430';

const keyExtractor = (item: Post) => item.id;
type FeedNavigation = NativeStackNavigationProp<RootStackParamList, 'Feed'>;

export const FeedScreen = observer(function FeedScreen() {
  const { ui } = useRootStore();
  const navigation = useNavigation<FeedNavigation>();
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
  } = useFeed({ tier: ui.tierFilter, limit: 10 });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const onPressPost = useCallback(
    (post: Post) => {
      navigation.navigate('PostDetail', { post });
    },
    [navigation],
  );

  if (isInitialLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{FEED_TITLE}</Text>
          <FeedTabs value={ui.tierFilter} onChange={ui.setTierFilter} />
        </View>
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
          message={FEED_ERROR_MESSAGE}
          retryLabel={RETRY_LABEL}
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <FeedPostCard post={item} onPress={onPressPost} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{FEED_TITLE}</Text>
            <FeedTabs value={ui.tierFilter} onChange={ui.setTierFilter} />
          </View>
        }
        ListEmptyComponent={<EmptyState ctaLabel="\u0412\u0441\u0435 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438" onPressCta={() => ui.setTierFilter('all')} />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.purple} />
            </View>
          ) : (
            <View style={styles.footerSpacing} />
          )
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyListContent : styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.purple} />}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
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
