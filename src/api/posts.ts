import { apiClient } from './client';
import type { GetPostsParams, PostsData, PostsResponse } from './types';

export async function getPosts(params: GetPostsParams = {}): Promise<PostsData> {
	const { data } = await apiClient.get<PostsResponse>('/posts', {
		params: {
			limit: params.limit,
			cursor: params.cursor ?? undefined,
			tier: params.tier === 'all' ? undefined : params.tier,
			simulate_error: params.simulate_error,
		},
	});

	return data.data;
}
