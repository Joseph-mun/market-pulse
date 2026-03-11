'use client';

import type { IndicatorRow } from '@/lib/types';
import { getIndustriesForIndicator } from '@/data/industry-map';

interface Props {
  indicator: IndicatorRow;
  onClose: () => void;
}

function ChangeBadge({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  if (value === null) return null;
  const color = value > 0 ? 'text-[var(--accent-green)]' : value < 0 ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]';
  const prefix = value > 0 ? '+' : '';
  const suffix = unit === '%' || unit === '%p' ? '%p' : '%';
  return (
    <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
      <div className="text-[10px] text-[var(--text-muted)] uppercase">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${color}`}>{prefix}{value.toFixed(2)}{suffix}</div>
    </div>
  );
}

export default function DetailPanel({ indicator, onClose }: Props) {
  const relatedIndustries = getIndustriesForIndicator(indicator.id);

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">{indicator.nameKr}</h3>
          <p className="text-[10px] text-[var(--text-muted)]">{indicator.name} · {indicator.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
        >
          ✕
        </button>
      </div>

      {/* Latest value */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl font-bold tabular-nums">
          {indicator.latestValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-[var(--text-muted)]">{indicator.unit}</span>
        <span className="text-xs text-[var(--text-muted)]">({indicator.latestDate})</span>
      </div>

      {/* Change metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <ChangeBadge label="MoM" value={indicator.mom} unit={indicator.unit} />
        <ChangeBadge label="3M" value={indicator.threeMonth} unit={indicator.unit} />
        <ChangeBadge label="6M" value={indicator.sixMonth} unit={indicator.unit} />
        <ChangeBadge label="YoY" value={indicator.yoy} unit={indicator.unit} />
      </div>

      {/* Description */}
      <div className="mb-3">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">설명</div>
        <p className="text-xs text-[var(--text-secondary)]">{indicator.description}</p>
      </div>

      {/* Interpretation */}
      <div className="mb-3">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">해석</div>
        <p className="text-xs text-[var(--text-secondary)]">{indicator.interpretation}</p>
      </div>

      {/* Korean investment link */}
      {indicator.krInvestmentLink && (
        <div className="mb-3">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">관련 한국 기업</div>
          <p className="text-xs text-[var(--accent-cyan)]">{indicator.krInvestmentLink}</p>
        </div>
      )}

      {/* Related industries */}
      {relatedIndustries.length > 0 && (
        <div className="pt-3 border-t border-[var(--border)]">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">관련 산업</div>
          <div className="space-y-2">
            {relatedIndustries.map(({ industry, impact }) => (
              <div key={industry.id} className="text-xs">
                <span className="font-medium">{industry.icon} {industry.name}</span>
                <span className={`ml-1 ${impact.relevance === 'high' ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}`}>
                  ({impact.relevance})
                </span>
                <div className="text-[var(--text-secondary)] ml-4 mt-0.5">
                  <div>↑ {impact.whenUp}</div>
                  <div>↓ {impact.whenDown}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
