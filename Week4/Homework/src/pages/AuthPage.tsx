import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { issueAuthorizationCode, PARTS, type Part } from '../apis/member';
import { useAuthStore } from '../stores/useAuthStore';

export default function AuthPage() {
  const [part, setPart] = useState<Part | ''>('');
  const [storageError, setStorageError] = useState(false);
  const saveSession = useAuthStore((state) => state.saveSession);
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: issueAuthorizationCode,
  });

  return (
    <main>
      <h1>회원 코드 발급</h1>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!part || isPending) return;

          setStorageError(false);
          mutate(part, {
            onSuccess: (authorizationCode, issuedPart) => {
              try {
                saveSession({ authorizationCode, part: issuedPart });
              } catch {
                setStorageError(true);
                return;
              }

              void navigate('/posts', { replace: true });
            },
          });
        }}
      >
        <label htmlFor="part">파트</label>
        <select
          id="part"
          value={part}
          onChange={(event) => {
            const selected = PARTS.find((option) => option === event.target.value);
            setPart(selected ?? '');
          }}
          disabled={isPending}
          required
        >
          <option value="">파트를 선택하세요</option>
          {PARTS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button type="submit" className="auth-submit" disabled={!part || isPending}>
          {isPending ? '발급 중…' : '코드 발급'}
        </button>
        {isError && <p role="alert">회원 코드 발급에 실패했습니다. 다시 시도해주세요.</p>}
        {storageError && <p role="alert">회원 코드를 저장할 수 없습니다. 브라우저 저장 설정을 확인해주세요.</p>}
      </form>
      <Link to="/posts">게시글 목록으로 이동</Link>
    </main>
  );
}
