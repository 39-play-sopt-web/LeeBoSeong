export function formatCount(count: number): string {
  return Number.isFinite(count) && count >= 0 ? `${count}` : '정보 없음';
}

export function formatRuntime(runtime: number | null): string {
  return runtime !== null && Number.isFinite(runtime) && runtime > 0 ? `${runtime}분` : '정보 없음';
}

export function formatMoney(amount: number): string {
  return Number.isFinite(amount) && amount > 0 ? `${amount} USD` : '정보 없음';
}

export function formatStatus(status: string): string {
  switch (status) {
    case 'Rumored':
      return '제작 논의 중';
    case 'Planned':
      return '제작 예정';
    case 'In Production':
      return '제작 중';
    case 'Post Production':
      return '후반 작업 중';
    case 'Released':
      return '개봉';
    case 'Canceled':
      return '제작 취소';
    default:
      return status.trim() || '정보 없음';
  }
}
