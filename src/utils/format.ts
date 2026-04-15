export function formatCount(value: number): string {
  if (value < 1000) {
    return `${value}`;
  }

  if (value < 1_000_000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

export function formatDateTime(input: string): string {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  });
}
