import { Link } from 'react-router';

interface PageMessageProps {
  title: string;
  description: string;
  onRetry?: () => void;
  isError?: boolean;
}

export default function PageMessage({ title, description, onRetry, isError = false }: PageMessageProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <div role={isError ? 'alert' : undefined}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-4 text-sm text-muted sm:text-base">{description}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-8 cursor-pointer rounded-full bg-accent px-6 py-3 text-sm font-semibold text-canvas hover:bg-accent/85">
          다시 불러오기
        </button>
      )}
      <Link
        to="/"
        className="mt-8 rounded-full border border-line px-6 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-surface"
      >
        ← 목록으로 돌아가기
      </Link>
    </section>
  );
}
