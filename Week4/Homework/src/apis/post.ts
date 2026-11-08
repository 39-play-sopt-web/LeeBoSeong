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

type PostDetail = PostSummary & {
  createdAt: string;
};

type PostDetailResponse = {
  isSuccess: boolean;
  data: PostDetail | null;
};

type CreatePostInput = {
  title: string;
  content: string;
  author: string;
  authorizationCode: string;
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

export async function getPostById(postId: number) {
  const { data: response } = await apiClient.get<PostDetailResponse>(`/posts/${postId}`); // data = Axios가 받은 응답 본문
  // response.data = 서버가 보낸 응답 본문

  if (!response.isSuccess || !response.data) {
    throw new Error('게시글을 불러오지 못했습니다.');
  }

  return response.data;
}

export async function createPost({ title, content, author, authorizationCode }: CreatePostInput) {
  const { data: response } = await apiClient.post<PostDetailResponse>(
    '/posts',
    { title, content, author },
    { headers: { Authorization: authorizationCode } },
  );

  if (!response.isSuccess || !response.data) {
    throw new Error('게시글을 작성하지 못했습니다.');
  }

  return response.data;
}
