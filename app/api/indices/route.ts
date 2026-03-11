import { NextResponse } from 'next/server';
import { fetchMarketIndices } from '@/lib/indices';

export const revalidate = 1800;

export async function GET() {
  try {
    const indices = await fetchMarketIndices();
    return NextResponse.json({
      indices,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Market indices fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch market indices', indices: [] }, { status: 500 });
  }
}
