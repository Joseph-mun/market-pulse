import { NextResponse } from 'next/server';
import { fetchFredSeries, computeChanges, determineSignal } from '@/lib/fred';
import { ALL_INDICATORS, getUpdateFrequency } from '@/data/indicator-meta';
import type { IndicatorRow } from '@/lib/types';

export const revalidate = 1800; // 30 min ISR

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'FRED_API_KEY not configured' }, { status: 500 });
  }

  const allIds = ALL_INDICATORS.map(i => i.id);
  // Remove duplicates (FEDFUNDS etc. appear in both PPI and Liquidity meta)
  const uniqueIds = [...new Set(allIds)];

  const results: IndicatorRow[] = [];

  // Fetch in batches of 8 to stay within rate limits
  const batchSize = 8;
  for (let i = 0; i < uniqueIds.length; i += batchSize) {
    const batch = uniqueIds.slice(i, i + batchSize);
    const promises = batch.map(async (id) => {
      const meta = ALL_INDICATORS.find(m => m.id === id);
      if (!meta) return null;

      try {
        const observations = await fetchFredSeries(id, apiKey, { limit: 120 });
        if (observations.length === 0) return null;

        const latest = observations[observations.length - 1];
        const changes = computeChanges(observations, meta.isRate);
        const { signal, label } = determineSignal(changes, meta.isRate);

        return {
          id: meta.id,
          name: meta.name,
          nameKr: meta.nameKr,
          category: meta.category,
          subCategory: meta.subCategory,
          latestValue: latest.value,
          latestDate: latest.date,
          unit: meta.unit,
          mom: changes.mom,
          threeMonth: changes.threeMonth,
          sixMonth: changes.sixMonth,
          yoy: changes.yoy,
          signal: signal as IndicatorRow['signal'],
          signalLabel: label,
          description: meta.description,
          interpretation: meta.interpretation,
          krInvestmentLink: meta.krCompanyLink,
          updateFrequency: getUpdateFrequency(meta.id),
          observations: observations.map(o => ({ date: o.date, value: o.value })),
        } satisfies IndicatorRow;
      } catch (err) {
        console.error(`Error fetching ${id}:`, err);
        return null;
      }
    });

    const batchResults = await Promise.allSettled(promises);
    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    }
  }

  return NextResponse.json({
    indicators: results,
    lastUpdated: new Date().toISOString(),
  });
}
