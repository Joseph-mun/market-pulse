import { NextResponse } from 'next/server';
import { fetchExchangeRates } from '@/lib/exchange';

export const revalidate = 1800;

export async function GET() {
  try {
    const rates = await fetchExchangeRates();
    return NextResponse.json({
      rates,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Exchange rate fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch exchange rates', rates: [] }, { status: 500 });
  }
}
