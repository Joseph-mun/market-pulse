'use client';

import type { ExchangeRate, MarketIndex } from '@/lib/types';

interface Props {
  indices: MarketIndex[];
  exchangeRates: ExchangeRate[];
  lastUpdated: string;
}

function formatPrice(value: number): string {
  if (value >= 10000) return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (value >= 100) return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function ChangeArrow({ value }: { value: number }) {
  if (value > 0) return <span className="text-[var(--accent-green)]">▲{Math.abs(value).toFixed(2)}%</span>;
  if (value < 0) return <span className="text-[var(--accent-red)]">▼{Math.abs(value).toFixed(2)}%</span>;
  return <span className="text-[var(--text-muted)]">―0.00%</span>;
}

export default function MarketTicker({ indices, exchangeRates, lastUpdated }: Props) {
  const items = [
    ...indices.map(idx => ({
      label: idx.nameKr,
      value: formatPrice(idx.price),
      change: idx.changePercent,
    })),
    ...exchangeRates.map(rate => ({
      label: rate.pair,
      value: formatPrice(rate.rate),
      change: rate.change1d ?? 0,
    })),
  ];

  const formatted = lastUpdated
    ? new Date(lastUpdated).toLocaleString('ko-KR', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
      })
    : '';

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-[var(--accent-green)]" />
          <span className="text-sm font-bold tracking-wide">Bloom Monitor</span>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          마지막 업데이트: {formatted}
        </span>
      </div>

      {/* Ticker strip */}
      <div className="overflow-hidden py-2">
        <div className="ticker-animate flex gap-8 whitespace-nowrap px-4">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)]">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
              <ChangeArrow value={item.change} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
