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

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface CommentsData {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  data: T;
}

export type PostsResponse = ApiEnvelope<PostsData>;
export type CommentsResponse = ApiEnvelope<CommentsData>;
export type CommentResponse = ApiEnvelope<Comment>;

export interface GetPostsParams {
  limit?: number;
  cursor?: string | null;
  tier?: FeedTier;
}

export interface GetCommentsParams {
  postId: string;
  limit?: number;
  cursor?: string | null;
}

export interface CreateCommentParams {
  postId: string;
  text: string;
}
