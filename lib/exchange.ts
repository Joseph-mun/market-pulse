import type { ExchangeRate } from './types';

const FRANKFURTER_BASE = 'https://api.frankfurter.app';

interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Frankfurter API supports: USD, EUR, GBP, JPY, CNY, KRW, etc.
const PAIRS: { from: string; to: string; label: string }[] = [
  { from: 'USD', to: 'KRW', label: 'USD/KRW' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY' },
  { from: 'EUR', to: 'USD', label: 'EUR/USD' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY' },
  { from: 'EUR', to: 'KRW', label: 'EUR/KRW' },
  { from: 'GBP', to: 'USD', label: 'GBP/USD' },
];

async function fetchRate(from: string, to: string): Promise<{ rate: number; date: string } | null> {
  try {
    const res = await fetch(`${FRANKFURTER_BASE}/latest?base=${from}&symbols=${to}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data: FrankfurterResponse = await res.json();
    return { rate: data.rates[to], date: data.date };
  } catch {
    return null;
  }
}

async function fetchHistoricalRate(from: string, to: string, date: string): Promise<number | null> {
  try {
    const res = await fetch(`${FRANKFURTER_BASE}/${date}?base=${from}&symbols=${to}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data: FrankfurterResponse = await res.json();
    return data.rates[to] ?? null;
  } catch {
    return null;
  }
}

function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function calcChange(current: number, previous: number | null): number | null {
  if (previous === null || previous === 0) return null;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
}

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const results: ExchangeRate[] = [];

  for (const pair of PAIRS) {
    const current = await fetchRate(pair.from, pair.to);
    if (!current) continue;

    // Fetch historical rates for change calculation
    const [rate1d, rate1w, rate1m] = await Promise.all([
      fetchHistoricalRate(pair.from, pair.to, getDateString(1)),
      fetchHistoricalRate(pair.from, pair.to, getDateString(7)),
      fetchHistoricalRate(pair.from, pair.to, getDateString(30)),
    ]);

    results.push({
      pair: pair.label,
      label: pair.label,
      rate: current.rate,
      change1d: calcChange(current.rate, rate1d),
      change1w: calcChange(current.rate, rate1w),
      change1m: calcChange(current.rate, rate1m),
      updatedAt: current.date,
    });
  }

  return results;
}
