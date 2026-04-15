import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getPosts } from '../api/posts';
import type { FeedTier, Post } from '../api/types';

export interface UseFeedOptions {
  limit?: number;
  tier?: FeedTier;
  simulateError?: boolean;
}

export function useFeed(options: UseFeedOptions = {}) {
  const { limit = 10, tier = 'all', simulateError = false } = options;

  const query = useInfiniteQuery({
    queryKey: ['feed', { limit, tier, simulateError }],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getPosts({
        limit,
        cursor: pageParam,
        tier,
        simulate_error: simulateError,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });

  const posts = useMemo<Post[]>(() => query.data?.pages.flatMap((page) => page.posts) ?? [], [query.data]);

  return {
    posts,
    refresh: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isInitialLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
