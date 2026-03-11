'use client';

import type { ChartRange } from '@/lib/types';

interface Props {
  value: ChartRange;
  onChange: (range: ChartRange) => void;
}

const RANGES: { value: ChartRange; label: string }[] = [
  { value: '1Y', label: '1Y' },
  { value: '3Y', label: '3Y' },
  { value: '5Y', label: '5Y' },
  { value: '7Y', label: '7Y' },
];

export default function TimeRangeControl({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-[var(--bg-primary)] rounded-lg p-0.5 border border-[var(--border)]">
      {RANGES.map(r => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            value === r.value
              ? 'bg-[var(--accent-cyan)] text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
