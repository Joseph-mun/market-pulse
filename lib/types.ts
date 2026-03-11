// ============================================================
// Core Types for Bloom Monitor
// ============================================================

// --- Indicator Types ---

export type SignalLevel = 'strong_up' | 'moderate_up' | 'reversal' | 'cooling' | 'mild_decline' | 'deep_decline';
export type LiquidityZone = 'EXPANSIONARY' | 'TRANSITIONAL' | 'RESTRICTIVE';
export type IndicatorCategory = 'PPI' | 'Liquidity' | 'Exchange' | 'Index';
export type Relevance = 'high' | 'medium';
export type TimeFrame = 'mom' | '3m' | '6m' | 'yoy';
export type UpdateFrequency = 'realtime' | 'daily' | 'monthly' | 'quarterly';
export type ChartRange = '1Y' | '3Y' | '5Y' | '7Y';

export interface FredObservation {
  date: string;
  value: number;
}

export interface FredSeriesData {
  id: string;
  name: string;
  category: string;
  unit: string;
  observations: FredObservation[];
  latestValue: number;
  latestDate: string;
  changes: {
    mom: number | null;
    threeMonth: number | null;
    sixMonth: number | null;
    yoy: number | null;
  };
  signal: SignalLevel;
  signalLabel: string;
}

// --- Exchange Rate Types ---

export interface ExchangeRate {
  pair: string;
  label: string;
  rate: number;
  change1d: number | null;
  change1w: number | null;
  change1m: number | null;
  updatedAt: string;
}

// --- Market Index Types ---

export interface MarketIndex {
  symbol: string;
  name: string;
  nameKr: string;
  price: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  updatedAt: string;
}

// --- Liquidity Score ---

export interface SignalResult {
  id: string;
  name: string;
  value: number;
  signal: number;
  interpretation: string;
}

export interface LiquidityScore {
  score: number;
  zone: LiquidityZone;
  emoji: string;
  color: string;
  signals: SignalResult[];
  warnings: string[];
}

// --- Industry Impact ---

export interface IndustryImpact {
  indicatorId: string;
  indicatorName: string;
  relevance: Relevance;
  whenUp: string;
  whenDown: string;
  category: IndicatorCategory;
  upIsGood: boolean; // true = 상승 시 해당 섹터에 긍정, false = 상승 시 부정
}

export interface Industry {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  impacts: IndustryImpact[];
  krCompanies: string[];
  summary: string;
  megatrend: string;
  riskFactors: string[];
}

// --- Unified Indicator (for table display) ---

export interface IndicatorRow {
  id: string;
  name: string;
  nameKr: string;
  category: IndicatorCategory;
  subCategory: string;
  latestValue: number;
  latestDate: string;
  unit: string;
  mom: number | null;
  threeMonth: number | null;
  sixMonth: number | null;
  yoy: number | null;
  signal: SignalLevel;
  signalLabel: string;
  description: string;
  interpretation: string;
  krInvestmentLink: string;
  updateFrequency: UpdateFrequency;
  observations: { date: string; value: number }[];
  // For industry filter
  industryRelevance?: Relevance;
  whenUp?: string;
  whenDown?: string;
  upIsGood?: boolean;
}

// --- API Response Types ---

export interface DashboardData {
  indicators: IndicatorRow[];
  exchangeRates: ExchangeRate[];
  marketIndices: MarketIndex[];
  liquidityScore: LiquidityScore;
  lastUpdated: string;
}
