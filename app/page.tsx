import Dashboard from './components/Dashboard';
import { ALL_INDICATORS } from '@/data/indicator-meta';
import { fetchFredSeries, computeChanges, determineSignal } from '@/lib/fred';
import { fetchExchangeRates } from '@/lib/exchange';
import { fetchMarketIndices } from '@/lib/indices';
import { calculateLiquidityScore, KEY_INDICATOR_IDS } from '@/lib/scoring';
import type { IndicatorRow, FredObservation } from '@/lib/types';

export const revalidate = 1800; // 30 min ISR

// Fallback data for when APIs are unavailable (dev/build without API key)
function getFallbackData() {
  const indicators: IndicatorRow[] = ALL_INDICATORS.map(meta => ({
    id: meta.id,
    name: meta.name,
    nameKr: meta.nameKr,
    category: meta.category,
    subCategory: meta.subCategory,
    latestValue: 0,
    latestDate: '—',
    unit: meta.unit,
    mom: null,
    threeMonth: null,
    sixMonth: null,
    yoy: null,
    signal: 'mild_decline' as const,
    signalLabel: '⚪ 데이터 로딩 중',
    description: meta.description,
    interpretation: meta.interpretation,
    krInvestmentLink: meta.krCompanyLink,
  }));

  return {
    indicators,
    exchangeRates: [],
    marketIndices: [],
    liquidityScore: {
      score: 0,
      zone: 'TRANSITIONAL' as const,
      emoji: '🟡',
      color: '#f59e0b',
      signals: [],
      warnings: ['API 키가 설정되지 않았습니다. FRED_API_KEY 환경변수를 확인하세요.'],
    },
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchAllFredData(apiKey: string) {
  const uniqueIds = [...new Set(ALL_INDICATORS.map(i => i.id))];
  const allObservations = new Map<string, FredObservation[]>();
  const indicators: IndicatorRow[] = [];

  // Fetch in batches
  const batchSize = 8;
  for (let i = 0; i < uniqueIds.length; i += batchSize) {
    const batch = uniqueIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (id) => {
        const obs = await fetchFredSeries(id, apiKey, { limit: 120 });
        return { id, obs };
      })
    );
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.obs.length > 0) {
        allObservations.set(result.value.id, result.value.obs);
      }
    }
  }

  // Process into IndicatorRows
  for (const meta of ALL_INDICATORS) {
    // Skip duplicates (keep first occurrence)
    if (indicators.some(ind => ind.id === meta.id)) continue;

    const obs = allObservations.get(meta.id);
    if (!obs || obs.length === 0) continue;

    const latest = obs[obs.length - 1];
    const changes = computeChanges(obs, meta.isRate);
    const { signal, label } = determineSignal(changes, meta.isRate);

    indicators.push({
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
    });
  }

  return { indicators, allObservations };
}

export default async function Home() {
  const apiKey = process.env.FRED_API_KEY;

  // If no API key, show fallback
  if (!apiKey) {
    const fallback = getFallbackData();
    return <Dashboard {...fallback} />;
  }

  try {
    // Fetch all data in parallel
    const [fredResult, exchangeRates, marketIndices] = await Promise.all([
      fetchAllFredData(apiKey),
      fetchExchangeRates().catch(() => []),
      fetchMarketIndices().catch(() => []),
    ]);

    // Calculate liquidity score using key indicators
    const keySeriesData = new Map<string, FredObservation[]>();
    for (const id of KEY_INDICATOR_IDS) {
      const obs = fredResult.allObservations.get(id);
      if (obs) keySeriesData.set(id, obs);
    }
    const liquidityScore = calculateLiquidityScore(keySeriesData);

    return (
      <Dashboard
        indicators={fredResult.indicators}
        exchangeRates={exchangeRates}
        marketIndices={marketIndices}
        liquidityScore={liquidityScore}
        lastUpdated={new Date().toISOString()}
      />
    );
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    const fallback = getFallbackData();
    return <Dashboard {...fallback} />;
  }
}
