'use client';

import type { Industry, IndicatorRow } from '@/lib/types';

interface Props {
  industry: Industry;
  indicators: IndicatorRow[];
}

export default function ImpactAnalysis({ industry, indicators }: Props) {
  // Build impact analysis from current data
  const impactItems = industry.impacts.map(impact => {
    const indicator = indicators.find(ind => ind.id === impact.indicatorId);
    const yoy = indicator?.yoy ?? 0;
    const isPositive = yoy >= 0;
    const interpretation = isPositive ? impact.whenUp : impact.whenDown;
    const emoji = impact.relevance === 'high'
      ? (isPositive ? '✅' : '⚠️')
      : (isPositive ? '🔹' : '🔸');

    return {
      ...impact,
      indicator,
      yoy,
      isPositive,
      interpretation,
      emoji,
    };
  });

  const highImpact = impactItems.filter(i => i.relevance === 'high');
  const medImpact = impactItems.filter(i => i.relevance === 'medium');

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] p-4">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">{industry.icon}</span>
          {industry.name} 산업 영향 분석
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">{industry.summary}</p>
      </div>

      {/* Megatrend */}
      <div className="bg-[var(--bg-primary)] rounded px-3 py-2 mb-3">
        <div className="text-[10px] text-[var(--accent-cyan)] uppercase tracking-wider mb-0.5">메가트렌드</div>
        <div className="text-xs text-[var(--text-primary)]">{industry.megatrend}</div>
      </div>

      {/* High impact indicators */}
      {highImpact.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">핵심 영향 지표</div>
          <div className="space-y-1.5">
            {highImpact.map(item => (
              <div key={item.indicatorId} className="flex items-start gap-2 text-xs">
                <span>{item.emoji}</span>
                <div className="flex-1">
                  <span className="font-medium text-[var(--text-primary)]">{item.indicatorName}</span>
                  {item.indicator && (
                    <span className={`ml-1.5 tabular-nums ${item.yoy >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      YoY {item.yoy >= 0 ? '+' : ''}{item.yoy?.toFixed(1)}%
                    </span>
                  )}
                  <span className="text-[var(--text-secondary)] ml-1">→ {item.interpretation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium impact indicators */}
      {medImpact.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">보조 지표</div>
          <div className="space-y-1">
            {medImpact.map(item => (
              <div key={item.indicatorId} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                <span>{item.emoji}</span>
                <span>{item.indicatorName}</span>
                {item.indicator && (
                  <span className={`tabular-nums ${item.yoy >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                    {item.yoy >= 0 ? '+' : ''}{item.yoy?.toFixed(1)}%
                  </span>
                )}
                <span>→ {item.interpretation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors */}
      <div className="mb-3 pt-3 border-t border-[var(--border)]">
        <div className="text-[10px] text-[var(--accent-amber)] uppercase tracking-wider mb-1.5">리스크 팩터</div>
        {industry.riskFactors.map((risk, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] mb-1">
            <span className="text-[var(--accent-amber)]">⚠️</span>
            <span>{risk}</span>
          </div>
        ))}
      </div>

      {/* Korean Companies */}
      <div className="pt-3 border-t border-[var(--border)]">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">관련 한국 기업</div>
        <div className="flex flex-wrap gap-1.5">
          {industry.krCompanies.map(company => (
            <span
              key={company}
              className="px-2 py-0.5 text-xs bg-[var(--bg-primary)] rounded border border-[var(--border)] text-[var(--text-secondary)]"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-3 pt-3 border-t border-[var(--border)]">
        <div className="flex items-start gap-2 text-xs text-[var(--accent-cyan)]">
          <span>💡</span>
          <span>같은 Strong Uptrend라도 속사정이 다르다: 원자재(구리/알루미늄)와 완제품(배전반/변압기)이 동시 상승하면 수요가 비용을 소화하고 있다는 의미</span>
        </div>
      </div>
    </div>
  );
}
