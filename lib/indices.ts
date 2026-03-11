import type { MarketIndex } from './types';

interface YahooChartResult {
  meta: {
    regularMarketPrice: number;
    previousClose: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    shortName?: string;
  };
}

const INDEX_SYMBOLS: { symbol: string; name: string; nameKr: string }[] = [
  { symbol: '^GSPC', name: 'S&P 500', nameKr: 'S&P500' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', nameKr: '나스닥' },
  { symbol: '^KS11', name: 'KOSPI', nameKr: '코스피' },
  { symbol: '^N225', name: 'Nikkei 225', nameKr: '니케이' },
  { symbol: '^GDAXI', name: 'DAX', nameKr: 'DAX' },
  { symbol: '^HSI', name: 'Hang Seng', nameKr: '항셍' },
];

async function fetchYahooIndex(symbol: string): Promise<YahooChartResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result?.meta) return null;
    return result as YahooChartResult;
  } catch {
    return null;
  }
}

export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  const results: MarketIndex[] = [];

  const promises = INDEX_SYMBOLS.map(async (idx) => {
    const data = await fetchYahooIndex(idx.symbol);
    if (!data) return null;

    const price = data.meta.regularMarketPrice;
    const prevClose = data.meta.previousClose;
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;

    return {
      symbol: idx.symbol,
      name: idx.name,
      nameKr: idx.nameKr,
      price,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high52w: data.meta.fiftyTwoWeekHigh,
      low52w: data.meta.fiftyTwoWeekLow,
      updatedAt: new Date().toISOString(),
    } satisfies MarketIndex;
  });

  const settled = await Promise.allSettled(promises);
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) {
      results.push(result.value);
    }
  }

  return results;
}
