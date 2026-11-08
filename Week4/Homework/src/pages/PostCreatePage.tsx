import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { createPost } from '../apis/post';
import { useAuthStore } from '../stores/useAuthStore';

export default function PostCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const authorizationCode = useAuthStore((state) => state.session?.authorizationCode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
  const post = { title: title.trim(), content: content.trim(), author: author.trim() };
  const canSubmit = Boolean(post.title && post.content && post.author);

  return (
    <>
      <h1>게시글 작성</h1>
      <form
        className="post-create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!authorizationCode || !canSubmit || isPending) return;

          mutate({ ...post, authorizationCode }, {
            onSuccess: () => {
              window.alert('게시글을 작성했습니다.');
              void navigate('/posts', { replace: true });
            },
            onError: () => {
              window.alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
            },
          });
        }}
      >
        <label htmlFor="post-title">제목</label>
        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={50}
          disabled={isPending}
          required
        />
        <label htmlFor="post-content">본문</label>
        <textarea
          id="post-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={6}
          maxLength={1000}
          disabled={isPending}
          required
        />
        <label htmlFor="post-author">작성자</label>
        <input
          id="post-author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          maxLength={20}
          disabled={isPending}
          required
        />
        <button type="submit" disabled={!canSubmit || isPending}>
          작성
        </button>
      </form>
      <Link to="/posts" className="post-list-link">게시글 목록으로 돌아가기</Link>
    </>
  );
}
