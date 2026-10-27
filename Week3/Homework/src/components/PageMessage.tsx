import { Link } from 'react-router';

interface PageMessageProps {
  title: string;
  description: string;
}

export default function PageMessage({ title, description }: PageMessageProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-4 text-sm text-muted sm:text-base">{description}</p>
      <Link
        to="/"
        className="mt-8 rounded-full border border-line px-6 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-surface"
      >
        ← 목록으로 돌아가기
      </Link>
    </section>
  );
}
