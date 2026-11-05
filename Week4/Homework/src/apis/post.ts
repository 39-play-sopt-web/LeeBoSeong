import apiClient from './apiClient';

type PostSummary = {
  id: number;
  title: string;
  content: string;
  author: string;
};

type PostListResponse = {
  isSuccess: boolean;
  data: { posts: PostSummary[] } | null;
};

export async function getPosts(keyword: string) {
  const { data: response } = await apiClient.get<PostListResponse>('/posts', {
    params: { keyword: keyword || undefined, size: 30 },
  });

  const posts = response.data?.posts;
  if (!response.isSuccess || !Array.isArray(posts)) {
    throw new Error('게시글 목록을 불러오지 못했습니다.');
  }

  return posts;
}
