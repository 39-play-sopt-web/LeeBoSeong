interface MovieListFeedbackProps {
  title: string;
  message: string;
  isError?: boolean;
  onRetry: () => void;
}

export default function MovieListFeedback({
  title,
  message,
  isError = false,
  onRetry,
}: MovieListFeedbackProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
      <div role={isError ? 'alert' : 'status'}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-7 cursor-pointer rounded-full border border-line px-6 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-canvas"
      >
        다시 불러오기
      </button>
    </div>
  );
}
