import { useState, type ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { createPost } from '../apis/post';
import { useAuthStore } from '../stores/useAuthStore';

const POST_STEPS = [
  { name: 'title', label: '제목', limit: 50 },
  { name: 'content', label: '본문', limit: 1000 },
  { name: 'author', label: '작성자', limit: 20 },
] as const;

export default function PostCreatePage() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({ title: '', content: '', author: '' });
  const authorizationCode = useAuthStore((state) => state.session?.authorizationCode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
  const field = POST_STEPS[step];
  const value = inputs[field.name];
  const isTooLong = value.length > field.limit;
  const canContinue = value.trim().length > 0 && !isTooLong;
  const isLastStep = step === POST_STEPS.length - 1;
  const inputProps = {
    id: `post-${field.name}`,
    value,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInputs({ ...inputs, [field.name]: event.target.value });
    },
    'aria-invalid': isTooLong,
    'aria-describedby': isTooLong ? 'post-field-error' : undefined,
    autoFocus: true,
    disabled: isPending,
    required: true,
  };

  return (
    <>
      <h1>게시글 작성</h1>
      <form
        className="post-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!authorizationCode || !canContinue || isPending) return;

          if (!isLastStep) {
            setStep(step + 1);
            return;
          }

          const post = {
            title: inputs.title.trim(),
            content: inputs.content.trim(),
            author: inputs.author.trim(),
          };

          mutate({ ...post, authorizationCode }, {
            onSuccess: () => {
              window.alert(`${post.author}님, 게시글을 작성했습니다.`);
              void navigate('/posts', { replace: true });
            },
            onError: () => {
              window.alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
            },
          });
        }}
      >
        <p>단계 {step + 1} / {POST_STEPS.length}</p>
        <label htmlFor={inputProps.id}>{field.label}</label>
        {field.name === 'content' ? <textarea {...inputProps} rows={6} /> : <input {...inputProps} />}
        {field.name === 'content' && <p>{value.length} / {field.limit}</p>}
        {isTooLong && (
          <p id="post-field-error" className="post-form-error" role="alert">
            최대 {field.limit}자까지 입력할 수 있어요.
          </p>
        )}
        <div className="post-form-actions">
          {step > 0 && (
            <button type="button" disabled={isPending} onClick={() => setStep(step - 1)}>이전</button>
          )}
          <button type="submit" disabled={!canContinue || isPending}>
            {isLastStep ? '작성' : '다음'}
          </button>
        </div>
      </form>
      <Link to="/posts" className="post-list-link">게시글 목록으로 돌아가기</Link>
    </>
  );
}
