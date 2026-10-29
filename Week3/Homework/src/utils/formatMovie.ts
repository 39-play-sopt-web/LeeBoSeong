const numberFormat = new Intl.NumberFormat('ko-KR');
const moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatCount(count: number): string {
  return Number.isFinite(count) && count >= 0 ? numberFormat.format(count) : '정보 없음';
}

export function formatRuntime(runtime: number | null): string {
  return runtime !== null && Number.isFinite(runtime) && runtime > 0 ? `${runtime}분` : '정보 없음';
}

export function formatMoney(amount: number): string {
  return Number.isFinite(amount) && amount > 0 ? moneyFormat.format(amount) : '정보 없음';
}

export function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    Rumored: '제작 논의 중',
    Planned: '제작 예정',
    'In Production': '제작 중',
    'Post Production': '후반 작업 중',
    Released: '개봉',
    Canceled: '제작 취소',
  };

  return labels[status] || status.trim() || '정보 없음';
}

export function formatLanguage(code: string, fallback?: string): string {
  if (!code.trim()) return fallback || '정보 없음';

  try {
    return new Intl.DisplayNames(['ko'], { type: 'language', fallback: 'none' }).of(code) || fallback || code;
  } catch {
    return fallback || code;
  }
}

export function formatCountry(code: string, fallback?: string): string {
  if (!code.trim()) return fallback || '정보 없음';

  try {
    return new Intl.DisplayNames(['ko'], { type: 'region', fallback: 'none' }).of(code) || fallback || code;
  } catch {
    return fallback || code;
  }
}
