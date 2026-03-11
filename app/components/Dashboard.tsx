'use client';

import { useState, useCallback } from 'react';
import type { IndicatorRow, ExchangeRate, MarketIndex, LiquidityScore } from '@/lib/types';
import { INDUSTRIES } from '@/data/industry-map';
import MarketTicker from './MarketTicker';
import IndustryFilter from './IndustryFilter';
import LiquidityScorePanel from './LiquidityScorePanel';
import IndicatorTable from './IndicatorTable';
import ImpactAnalysis from './ImpactAnalysis';
import DetailPanel from './DetailPanel';

interface Props {
  indicators: IndicatorRow[];
  exchangeRates: ExchangeRate[];
  marketIndices: MarketIndex[];
  liquidityScore: LiquidityScore;
  lastUpdated: string;
}

export default function Dashboard({
  indicators,
  exchangeRates,
  marketIndices,
  liquidityScore,
  lastUpdated,
}: Props) {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorRow | null>(null);

  const selectedIndustry = selectedIndustryId
    ? INDUSTRIES.find(i => i.id === selectedIndustryId) ?? null
    : null;

  const handleIndustrySelect = useCallback((id: string | null) => {
    setSelectedIndustryId(id);
    setSelectedIndicator(null);
  }, []);

  const handleIndicatorSelect = useCallback((indicator: IndicatorRow) => {
    setSelectedIndicator(prev => prev?.id === indicator.id ? null : indicator);
  }, []);

  // Summary stats
  const ppiCount = indicators.filter(i => i.category === 'PPI').length;
  const liqCount = indicators.filter(i => i.category === 'Liquidity').length;
  const strongUp = indicators.filter(i => i.signal === 'strong_up').length;
  const deepDown = indicators.filter(i => i.signal === 'deep_decline').length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ticker */}
      <MarketTicker
        indices={marketIndices}
        exchangeRates={exchangeRates}
        lastUpdated={lastUpdated}
      />

      {/* Industry Filter */}
      <IndustryFilter
        selected={selectedIndustryId}
        onSelect={handleIndustrySelect}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 max-w-[1600px] mx-auto w-full">
        {/* Top row: Score + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Liquidity Score */}
          <LiquidityScorePanel score={liquidityScore} />

          {/* Market Summary */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border)] p-4">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Market Summary
            </h3>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">PPI 시리즈</div>
                <div className="text-lg font-bold">{ppiCount}</div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">유동성 지표</div>
                <div className="text-lg font-bold">{liqCount}</div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Strong Uptrend</div>
                <div className="text-lg font-bold text-[var(--accent-red)]">{strongUp}</div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Deep Decline</div>
                <div className="text-lg font-bold text-[var(--accent-blue)]">{deepDown}</div>
              </div>
            </div>

            {/* Signal pills for indices */}
            <div className="flex flex-wrap gap-2 mb-3">
              {marketIndices.map(idx => (
                <div key={idx.symbol} className="flex items-center gap-1.5 bg-[var(--bg-primary)] rounded px-2.5 py-1.5">
                  <span className="text-xs text-[var(--text-secondary)]">{idx.nameKr}</span>
                  <span className="text-xs font-semibold tabular-nums">{idx.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span className={`text-[10px] tabular-nums ${idx.changePercent >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                    {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Exchange rate pills */}
            <div className="flex flex-wrap gap-2">
              {exchangeRates.map(rate => (
                <div key={rate.pair} className="flex items-center gap-1.5 bg-[var(--bg-primary)] rounded px-2.5 py-1.5">
                  <span className="text-xs text-[var(--text-secondary)]">{rate.pair}</span>
                  <span className="text-xs font-semibold tabular-nums">{rate.rate.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                  {rate.change1d !== null && (
                    <span className={`text-[10px] tabular-nums ${rate.change1d >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      {rate.change1d >= 0 ? '+' : ''}{rate.change1d.toFixed(2)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Impact Analysis (only when industry is selected) */}
        {selectedIndustry && (
          <div className="mb-4">
            <ImpactAnalysis
              industry={selectedIndustry}
              indicators={indicators}
            />
          </div>
        )}

        {/* Main content: Table + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={selectedIndicator ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <IndicatorTable
              indicators={indicators}
              selectedIndustry={selectedIndustry}
              onSelect={handleIndicatorSelect}
              selectedId={selectedIndicator?.id ?? null}
            />
          </div>

          {/* Detail Panel */}
          {selectedIndicator && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <DetailPanel
                  indicator={selectedIndicator}
                  onClose={() => setSelectedIndicator(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-4 py-3 text-center text-[10px] text-[var(--text-muted)]">
        Data: FRED (Federal Reserve) · Frankfurter (ECB) · Yahoo Finance · 30분 자동 갱신 (ISR)
      </footer>
    </div>
  );
}
