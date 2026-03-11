'use client';

import { useState, useMemo } from 'react';
import type { IndicatorRow } from '@/lib/types';
import type { Industry } from '@/lib/types';

interface Props {
  indicators: IndicatorRow[];
  selectedIndustry: Industry | null;
  onSelect: (indicator: IndicatorRow) => void;
  selectedId: string | null;
}

type SortKey = 'name' | 'yoy' | 'mom' | 'threeMonth' | 'signal';
type SortDir = 'asc' | 'desc';

const SIGNAL_ORDER: Record<string, number> = {
  strong_up: 0, moderate_up: 1, reversal: 2, cooling: 3, mild_decline: 4, deep_decline: 5,
};

function ChangeCell({ value, unit }: { value: number | null; unit?: string }) {
  if (value === null) return <td className="px-2 py-2 text-xs text-[var(--text-muted)] text-right">—</td>;
  const color = value > 0 ? 'text-[var(--accent-green)]' : value < 0 ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]';
  const prefix = value > 0 ? '+' : '';
  const suffix = unit === '%' || unit === '%p' ? '%p' : '%';
  return (
    <td className={`px-2 py-2 text-xs text-right tabular-nums ${color}`}>
      {prefix}{value.toFixed(2)}{suffix}
    </td>
  );
}

function SignalPill({ signal, label }: { signal: string; label: string }) {
  const colors: Record<string, string> = {
    strong_up: 'bg-red-500/20 text-red-400 border-red-500/30',
    moderate_up: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    reversal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    cooling: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    mild_decline: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    deep_decline: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors[signal] ?? colors.mild_decline}`}>
      {label}
    </span>
  );
}

export default function IndicatorTable({ indicators, selectedIndustry, onSelect, selectedId }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('yoy');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get unique sub-categories
  const subCategories = useMemo(() => {
    const cats = new Set(indicators.map(i => i.subCategory));
    return ['all', ...Array.from(cats).sort()];
  }, [indicators]);

  // Filter by industry impacts if selected
  const filteredIndicators = useMemo(() => {
    let list = indicators;

    if (selectedIndustry) {
      const impactIds = new Set(selectedIndustry.impacts.map(imp => imp.indicatorId));
      list = list.filter(ind => impactIds.has(ind.id));
      // Enrich with impact data
      list = list.map(ind => {
        const impact = selectedIndustry.impacts.find(imp => imp.indicatorId === ind.id);
        return {
          ...ind,
          industryRelevance: impact?.relevance,
          whenUp: impact?.whenUp,
          whenDown: impact?.whenDown,
        };
      });
    }

    if (categoryFilter !== 'all') {
      list = list.filter(i => i.subCategory === categoryFilter);
    }

    return list;
  }, [indicators, selectedIndustry, categoryFilter]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filteredIndicators];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = a.nameKr.localeCompare(b.nameKr); break;
        case 'yoy': cmp = (a.yoy ?? -999) - (b.yoy ?? -999); break;
        case 'mom': cmp = (a.mom ?? -999) - (b.mom ?? -999); break;
        case 'threeMonth': cmp = (a.threeMonth ?? -999) - (b.threeMonth ?? -999); break;
        case 'signal': cmp = (SIGNAL_ORDER[a.signal] ?? 5) - (SIGNAL_ORDER[b.signal] ?? 5); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return arr;
  }, [filteredIndicators, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortHeader = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => (
    <th
      className={`px-2 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] select-none ${className ?? ''}`}
      onClick={() => toggleSort(k)}
    >
      {label} {sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          지표 테이블
          <span className="ml-2 text-[var(--text-muted)] normal-case">
            ({sorted.length}개{selectedIndustry ? ` · ${selectedIndustry.name}` : ''})
          </span>
        </h3>
        {!selectedIndustry && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-[var(--text-secondary)]"
          >
            {subCategories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? '전체 카테고리' : cat}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <SortHeader k="name" label="지표명" className="text-left pl-4" />
              <th className="px-2 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase">카테고리</th>
              <th className="px-2 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase text-right">최신값</th>
              <SortHeader k="mom" label="MoM" className="text-right" />
              <SortHeader k="threeMonth" label="3M" className="text-right" />
              <SortHeader k="yoy" label="YoY" className="text-right" />
              <SortHeader k="signal" label="신호" className="text-center" />
              {selectedIndustry && (
                <th className="px-2 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase">영향</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((ind) => (
              <tr
                key={ind.id}
                className={`border-b border-[var(--border)]/50 cursor-pointer card-hover ${
                  selectedId === ind.id ? 'bg-[var(--accent-cyan)]/10' : ''
                }`}
                onClick={() => onSelect(ind)}
              >
                <td className="pl-4 pr-2 py-2">
                  <div className="text-xs font-medium text-[var(--text-primary)]">{ind.nameKr}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{ind.id}</div>
                </td>
                <td className="px-2 py-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-muted)]">
                    {ind.category === 'PPI' ? 'PPI' : 'LIQ'}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs text-right tabular-nums font-medium">
                  {ind.latestValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
                <ChangeCell value={ind.mom} unit={ind.unit} />
                <ChangeCell value={ind.threeMonth} unit={ind.unit} />
                <ChangeCell value={ind.yoy} unit={ind.unit} />
                <td className="px-2 py-2 text-center">
                  <SignalPill signal={ind.signal} label={ind.signalLabel} />
                </td>
                {selectedIndustry && (
                  <td className="px-2 py-2 text-[10px] max-w-[200px]">
                    {ind.industryRelevance && (
                      <div>
                        <span className={`font-medium ${ind.industryRelevance === 'high' ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}`}>
                          {ind.industryRelevance === 'high' ? '●' : '○'}
                        </span>
                        <span className="text-[var(--text-secondary)] ml-1">
                          {(ind.yoy ?? 0) >= 0 ? `↑ ${ind.whenUp}` : `↓ ${ind.whenDown}`}
                        </span>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={selectedIndustry ? 8 : 7} className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
                  해당하는 지표가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
