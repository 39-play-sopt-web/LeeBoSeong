import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import { deletePost, getPostById, updatePost } from '../apis/post';
import { useAuthStore } from '../stores/useAuthStore';

type EditDraft = {
  postId: number;
  title: string;
  content: string;
};

export default function PostDetailPage() {
  const { postId } = useParams();
  const id = Number(postId);
  const isValidId = Number.isSafeInteger(id) && id > 0;
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const draft = editDraft?.postId === id ? editDraft : null;
  const canSave = Boolean(draft?.title.trim() && draft.content.trim());
  const authorizationCode = useAuthStore((state) => state.session?.authorizationCode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: post, isPending, isError } = useQuery({
    queryKey: ['post', id], // 게시글별로 캐시를 구분.
    queryFn: () => getPostById(id),
    enabled: isValidId,
  });
  const { mutate: savePost, isPending: isUpdating } = useMutation({
    mutationFn: updatePost,
    onSuccess: async (_post, { postId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['post', postId] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
      ]);
    },
  });
  const { mutate: removePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePost,
    onSuccess: (_result, { postId }) => {
      queryClient.removeQueries({ queryKey: ['post', postId], exact: true });
      return queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  function handleDelete() {
    if (!authorizationCode || isUpdating || isDeleting) return;
    if (!window.confirm('이 게시글을 삭제할까요?')) return;

    removePost({ postId: id, authorizationCode }, {
      onSuccess: () => {
        void navigate('/posts', { replace: true });
      },
      onError: () => {
        window.alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
      },
    });
  }

  return (
    <>
      <h1>게시글 상세</h1>
      {!isValidId && <p role="alert">올바르지 않은 게시글 번호입니다.</p>}
      {isValidId && isPending && <p role="status">게시글을 불러오는 중입니다.</p>}
      {isError && <p role="alert">게시글을 불러오지 못했습니다.</p>}
      {post && (
        <article className="post-detail">
          {draft ? (
            <form
              className="post-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!authorizationCode || !canSave || isUpdating) return;

                savePost({ ...draft, authorizationCode }, {
                  onSuccess: () => {
                    setEditDraft(null);
                    window.alert('게시글을 수정했습니다.');
                  },
                  onError: () => {
                    window.alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
                  },
                });
              }}
            >
              <label htmlFor="edit-title">제목</label>
              <input
                id="edit-title"
                value={draft.title}
                onChange={(event) => setEditDraft({ ...draft, title: event.target.value })}
                maxLength={50}
                disabled={isUpdating}
                required
              />
              <label htmlFor="edit-content">본문</label>
              <textarea
                id="edit-content"
                value={draft.content}
                onChange={(event) => setEditDraft({ ...draft, content: event.target.value })}
                rows={6}
                maxLength={1000}
                disabled={isUpdating}
                required
              />
              <div className="post-form-actions">
                <button type="submit" disabled={!canSave || isUpdating}>저장</button>
                <button type="button" disabled={isUpdating} onClick={() => setEditDraft(null)}>취소</button>
              </div>
            </form>
          ) : (
            <>
              <h2>{post.title}</h2>
              <p>
                작성자: {post.author} · 작성일: <time dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time>
              </p>
              <p className="post-detail-content">{post.content}</p>
              <div className="post-detail-actions">
                <button
                  type="button"
                  disabled={isDeleting || isUpdating}
                  onClick={() => setEditDraft({ postId: id, title: post.title, content: post.content })}
                >
                  수정
                </button>
                <button type="button" disabled={isDeleting || isUpdating} onClick={handleDelete}>
                  삭제
                </button>
              </div>
            </>
          )}
        </article>
      )}
      <Link to="/posts" className="post-list-link">게시글 목록으로 돌아가기</Link>
    </>
  );
}
