import type { Post } from '../api/types';

export type RootStackParamList = {
  Feed: undefined;
  PostDetail: {
    post: Post;
  };
};
