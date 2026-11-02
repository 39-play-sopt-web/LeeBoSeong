import PageMessage from '../components/PageMessage';

export default function ErrorPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <PageMessage
        title="화면을 불러오지 못했어요"
        description="잠시 후 다시 시도하거나 영화 목록으로 이동해 주세요."
        onRetry={() => window.location.reload()}
        isError
      />
    </main>
  );
}
