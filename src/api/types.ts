export type FeedTier = 'all' | 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: Exclude<FeedTier, 'all'>;
  createdAt: string;
}

export interface PostsData {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  data: T;
}

export type PostsResponse = ApiEnvelope<PostsData>;

export interface GetPostsParams {
  limit?: number;
  cursor?: string | null;
  tier?: FeedTier;
  simulate_error?: boolean;
}
