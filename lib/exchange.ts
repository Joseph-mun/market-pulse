import type { ExchangeRate } from './types';

const FRANKFURTER_BASE = 'https://api.frankfurter.app';

// Frankfurter supports ECB currencies. Fetch all needed in batch.
const USD_TARGETS = ['KRW', 'JPY', 'CNY'];
const EUR_TARGETS = ['USD', 'KRW'];
const GBP_TARGETS = ['USD'];

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

async function fetchBatch(base: string, symbols: string[]): Promise<FrankfurterResponse | null> {
  const url = `${FRANKFURTER_BASE}/latest?base=${base}&symbols=${symbols.join(',')}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Frankfurter ${base} error: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Frankfurter ${base} fetch failed:`, err);
    return null;
  }
}

async function fetchHistoricalBatch(base: string, symbols: string[], date: string): Promise<Record<string, number> | null> {
  const url = `${FRANKFURTER_BASE}/${date}?base=${base}&symbols=${symbols.join(',')}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: FrankfurterResponse = await res.json();
    return data.rates;
  } catch {
    return null;
  }
}

function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function calcChange(current: number, previous: number | undefined): number | null {
  if (!previous || previous === 0) return null;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
}

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const results: ExchangeRate[] = [];

  // Batch fetch: 3 base currencies × (latest + 3 historical) = 12 requests total (vs 24 before)
  const [usdLatest, eurLatest, gbpLatest] = await Promise.all([
    fetchBatch('USD', USD_TARGETS),
    fetchBatch('EUR', EUR_TARGETS),
    fetchBatch('GBP', GBP_TARGETS),
  ]);

  const date1d = getDateString(1);
  const date1w = getDateString(7);
  const date1m = getDateString(30);

  const [usdHist1d, usdHist1w, usdHist1m, eurHist1d, eurHist1w, eurHist1m, gbpHist1d, gbpHist1w, gbpHist1m] = await Promise.all([
    fetchHistoricalBatch('USD', USD_TARGETS, date1d),
    fetchHistoricalBatch('USD', USD_TARGETS, date1w),
    fetchHistoricalBatch('USD', USD_TARGETS, date1m),
    fetchHistoricalBatch('EUR', EUR_TARGETS, date1d),
    fetchHistoricalBatch('EUR', EUR_TARGETS, date1w),
    fetchHistoricalBatch('EUR', EUR_TARGETS, date1m),
    fetchHistoricalBatch('GBP', GBP_TARGETS, date1d),
    fetchHistoricalBatch('GBP', GBP_TARGETS, date1w),
    fetchHistoricalBatch('GBP', GBP_TARGETS, date1m),
  ]);

  // USD pairs
  if (usdLatest) {
    for (const symbol of USD_TARGETS) {
      const rate = usdLatest.rates[symbol];
      if (rate === undefined) continue;
      results.push({
        pair: `USD/${symbol}`,
        label: `USD/${symbol}`,
        rate,
        change1d: calcChange(rate, usdHist1d?.[symbol]),
        change1w: calcChange(rate, usdHist1w?.[symbol]),
        change1m: calcChange(rate, usdHist1m?.[symbol]),
        updatedAt: usdLatest.date,
      });
    }
  }

  // EUR pairs
  if (eurLatest) {
    for (const symbol of EUR_TARGETS) {
      const rate = eurLatest.rates[symbol];
      if (rate === undefined) continue;
      results.push({
        pair: `EUR/${symbol}`,
        label: `EUR/${symbol}`,
        rate,
        change1d: calcChange(rate, eurHist1d?.[symbol]),
        change1w: calcChange(rate, eurHist1w?.[symbol]),
        change1m: calcChange(rate, eurHist1m?.[symbol]),
        updatedAt: eurLatest.date,
      });
    }
  }

  // GBP pairs
  if (gbpLatest) {
    for (const symbol of GBP_TARGETS) {
      const rate = gbpLatest.rates[symbol];
      if (rate === undefined) continue;
      results.push({
        pair: `GBP/${symbol}`,
        label: `GBP/${symbol}`,
        rate,
        change1d: calcChange(rate, gbpHist1d?.[symbol]),
        change1w: calcChange(rate, gbpHist1w?.[symbol]),
        change1m: calcChange(rate, gbpHist1m?.[symbol]),
        updatedAt: gbpLatest.date,
      });
    }
  }

  return results;
}
