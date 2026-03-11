import type { FredObservation } from './types';

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

export async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  opts?: { startDate?: string; limit?: number }
): Promise<FredObservation[]> {
  const startDate = opts?.startDate ?? '2019-01-01';
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&observation_start=${startDate}&sort_order=desc&limit=${opts?.limit ?? 100}`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    console.error(`FRED API error for ${seriesId}: ${res.status}`);
    return [];
  }

  const data = await res.json();
  if (!data.observations) return [];

  return data.observations
    .filter((o: { value: string }) => o.value !== '.')
    .map((o: { date: string; value: string }) => ({
      date: o.date,
      value: parseFloat(o.value),
    }))
    .reverse(); // chronological order
}

export function computeChanges(observations: FredObservation[], isRate: boolean) {
  if (observations.length < 2) {
    return { mom: null, threeMonth: null, sixMonth: null, yoy: null };
  }

  const latest = observations[observations.length - 1];
  const len = observations.length;

  const findByOffset = (monthsBack: number): FredObservation | undefined => {
    const target = new Date(latest.date);
    target.setMonth(target.getMonth() - monthsBack);
    // Find closest observation to target date
    let best: FredObservation | undefined;
    let bestDiff = Infinity;
    for (const obs of observations) {
      const diff = Math.abs(new Date(obs.date).getTime() - target.getTime());
      if (diff < bestDiff) {
        bestDiff = diff;
        best = obs;
      }
    }
    // Only accept if within 45 days
    if (best && bestDiff < 45 * 24 * 60 * 60 * 1000) return best;
    return undefined;
  };

  const calc = (prev: FredObservation | undefined): number | null => {
    if (!prev || prev.value === 0) return null;
    if (isRate) {
      // For rates, show absolute difference in percentage points
      return parseFloat((latest.value - prev.value).toFixed(3));
    }
    return parseFloat((((latest.value - prev.value) / Math.abs(prev.value)) * 100).toFixed(2));
  };

  return {
    mom: calc(findByOffset(1)),
    threeMonth: calc(findByOffset(3)),
    sixMonth: calc(findByOffset(6)),
    yoy: calc(findByOffset(12)),
  };
}

export function determineSignal(changes: ReturnType<typeof computeChanges>, isRate: boolean): { signal: string; label: string } {
  const yoy = changes.yoy;
  const sixM = changes.sixMonth;

  if (yoy === null || sixM === null) return { signal: 'mild_decline', label: '⚪ 데이터 부족' };

  // For rates (liquidity indicators), different logic applies
  if (isRate) {
    return { signal: 'moderate_up', label: '🟠 Moderate' };
  }

  // PPI signal logic (from extracted dashboard)
  const mom = changes.mom ?? 0;
  const threeM = changes.threeMonth ?? 0;

  // Strong Uptrend: YoY > 8% AND 6M > 2%
  if (yoy > 8 && sixM > 2) return { signal: 'strong_up', label: '🔴 Strong Uptrend' };

  // Moderate Uptrend: YoY > 2% OR 6M > 1%
  if (yoy > 2 || sixM > 1) return { signal: 'moderate_up', label: '🟠 Moderate Uptrend' };

  // Deep Decline: YoY < -3% AND 6M < -1%
  if (yoy < -3 && sixM < -1) return { signal: 'deep_decline', label: '🔵 Deep Decline' };

  // Potential Reversal: YoY < 0 but recent positive
  if (yoy < 0 && (mom > 0 || threeM > 0)) return { signal: 'reversal', label: '🟡 Potential Reversal' };

  // Cooling: YoY > 0 but 6M declining
  if (yoy > 0 && sixM < 0) return { signal: 'cooling', label: '⚪ Cooling' };

  // Mild Decline
  return { signal: 'mild_decline', label: '⚪ Mild Decline' };
}

// Batch fetch multiple series with rate limiting
export async function fetchMultipleFredSeries(
  seriesIds: string[],
  apiKey: string
): Promise<Map<string, FredObservation[]>> {
  const results = new Map<string, FredObservation[]>();

  // Fetch in batches of 10 to respect rate limits
  const batchSize = 10;
  for (let i = 0; i < seriesIds.length; i += batchSize) {
    const batch = seriesIds.slice(i, i + batchSize);
    const promises = batch.map(id =>
      fetchFredSeries(id, apiKey).then(obs => ({ id, obs }))
    );
    const batchResults = await Promise.allSettled(promises);
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.set(result.value.id, result.value.obs);
      }
    }
  }

  return results;
}
