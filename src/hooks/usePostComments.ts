import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getComments } from '../api/posts';
import type { Comment } from '../api/types';

export const commentsQueryKeys = {
  all: ['comments'] as const,
  list: (postId: string, limit: number) => ['comments', postId, { limit }] as const,
};

export function usePostComments(postId: string, limit = 20) {
  const query = useInfiniteQuery({
    queryKey: commentsQueryKeys.list(postId, limit),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getComments({
        postId,
        limit,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });

  const comments = useMemo<Comment[]>(
    () => query.data?.pages.flatMap((page) => page.comments) ?? [],
    [query.data],
  );

  return {
    comments,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isInitialLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
