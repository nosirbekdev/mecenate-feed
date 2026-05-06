import { apiClient } from './client';
import type {
  ApiEnvelope,
  Comment,
  CommentResponse,
  CommentsData,
  CommentsResponse,
  CreateCommentParams,
  GetCommentsParams,
  GetPostsParams,
  Post,
  PostsData,
  PostsResponse,
} from './types';

export async function getPosts(params: GetPostsParams = {}): Promise<PostsData> {
	const { data } = await apiClient.get<PostsResponse>('/posts', {
		params: {
			limit: params.limit,
			cursor: params.cursor ?? undefined,
			tier: params.tier === 'all' ? undefined : params.tier,
		},
	});

	return data.data;
}

export async function togglePostLike(postId: string, liked: boolean): Promise<Post> {
  const { data } = await apiClient.post<ApiEnvelope<Post>>(`/posts/${postId}/like`, { liked });

  return data.data;
}

export async function getComments(params: GetCommentsParams): Promise<CommentsData> {
  const { data } = await apiClient.get<CommentsResponse>(`/posts/${params.postId}/comments`, {
    params: {
      limit: params.limit,
      cursor: params.cursor ?? undefined,
    },
  });

  return data.data;
}

export async function createComment(params: CreateCommentParams): Promise<Comment> {
  const { data } = await apiClient.post<CommentResponse>(`/posts/${params.postId}/comments`, {
    text: params.text,
  });

  return data.data;
}
