import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getPosts } from '../api/posts';
import type { FeedTier, Post } from '../api/types';

export const feedQueryKeys = {
  all: ['feed'] as const,
  list: (limit: number, tier: FeedTier) => ['feed', { limit, tier }] as const,
};

export const postQueryKeys = {
  detail: (postId: string) => ['post', postId] as const,
};

export interface UseFeedOptions {
  limit?: number;
  tier?: FeedTier;
}

export function useFeed(options: UseFeedOptions = {}) {
  const { limit = 10, tier = 'all' } = options;

  const query = useInfiniteQuery({
    queryKey: feedQueryKeys.list(limit, tier),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getPosts({
        limit,
        cursor: pageParam,
        tier,
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
