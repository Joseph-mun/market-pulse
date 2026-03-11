import type { LiquidityScore, LiquidityZone, SignalResult, FredObservation } from './types';

// 9 key indicators and their signal thresholds
// Ported from Global_Liquidity_Dashboard_v2.html

interface IndicatorConfig {
  id: string;
  name: string;
  evaluate: (observations: FredObservation[]) => { signal: number; interpretation: string };
}

function getLatest(obs: FredObservation[]): number {
  return obs.length > 0 ? obs[obs.length - 1].value : 0;
}

function getYoYChange(obs: FredObservation[]): number {
  if (obs.length < 12) return 0;
  const latest = obs[obs.length - 1].value;
  // Find observation ~12 months ago
  const targetDate = new Date(obs[obs.length - 1].date);
  targetDate.setFullYear(targetDate.getFullYear() - 1);
  let closest = obs[0];
  let minDiff = Infinity;
  for (const o of obs) {
    const diff = Math.abs(new Date(o.date).getTime() - targetDate.getTime());
    if (diff < minDiff) { minDiff = diff; closest = o; }
  }
  if (closest.value === 0) return 0;
  return ((latest - closest.value) / Math.abs(closest.value)) * 100;
}

function getAbsYoYChange(obs: FredObservation[]): number {
  if (obs.length < 12) return 0;
  const latest = obs[obs.length - 1].value;
  const targetDate = new Date(obs[obs.length - 1].date);
  targetDate.setFullYear(targetDate.getFullYear() - 1);
  let closest = obs[0];
  let minDiff = Infinity;
  for (const o of obs) {
    const diff = Math.abs(new Date(o.date).getTime() - targetDate.getTime());
    if (diff < minDiff) { minDiff = diff; closest = o; }
  }
  return latest - closest.value;
}

const INDICATOR_CONFIGS: IndicatorConfig[] = [
  {
    id: 'M2SL',
    name: 'M2 YoY',
    evaluate: (obs) => {
      const yoy = getYoYChange(obs);
      if (yoy > 0) return { signal: 1, interpretation: `M2 YoY +${yoy.toFixed(1)}% → 통화 확장` };
      return { signal: -1, interpretation: `M2 YoY ${yoy.toFixed(1)}% → 통화 축소` };
    },
  },
  {
    id: 'FEDFUNDS',
    name: 'Fed Rate YoY',
    evaluate: (obs) => {
      const absYoY = getAbsYoYChange(obs);
      if (absYoY < 0) return { signal: 1, interpretation: `금리 YoY ${absYoY.toFixed(2)}%p → 금리 인하 중` };
      return { signal: -1, interpretation: `금리 YoY +${absYoY.toFixed(2)}%p → 고금리 유지/인상` };
    },
  },
  {
    id: 'WALCL',
    name: 'Fed B/S YoY',
    evaluate: (obs) => {
      const yoy = getYoYChange(obs);
      if (yoy >= -2) return { signal: 0.5, interpretation: `Fed B/S YoY ${yoy.toFixed(1)}% → 완만한 QT/중립` };
      return { signal: -1, interpretation: `Fed B/S YoY ${yoy.toFixed(1)}% → 적극적 QT` };
    },
  },
  {
    id: 'RRPONTSYD',
    name: '역레포 잔고',
    evaluate: (obs) => {
      const latest = getLatest(obs);
      if (latest >= 300) return { signal: 0.5, interpretation: `역레포 $${latest.toFixed(0)}B → 유동성 쿠션 건재` };
      if (latest >= 50) return { signal: 0, interpretation: `역레포 $${latest.toFixed(0)}B → 보통 수준` };
      return { signal: -0.5, interpretation: `역레포 $${latest.toFixed(1)}B → 유동성 쿠션 소진` };
    },
  },
  {
    id: 'BAMLH0A0HYM2',
    name: 'HY 신용스프레드',
    evaluate: (obs) => {
      const latest = getLatest(obs);
      const bp = latest * 100; // Convert to basis points
      if (bp < 350) return { signal: 1, interpretation: `HY OAS ${latest.toFixed(0)}bp → 리스크 온` };
      if (bp < 500) return { signal: 0.5, interpretation: `HY OAS ${latest.toFixed(0)}bp → 정상` };
      return { signal: -1, interpretation: `HY OAS ${latest.toFixed(0)}bp → 리스크 오프` };
    },
  },
  {
    id: 'STLFSI4',
    name: '금융스트레스',
    evaluate: (obs) => {
      const latest = getLatest(obs);
      if (latest < -0.5) return { signal: 1, interpretation: `FSI ${latest.toFixed(2)} → 평균 이하 스트레스` };
      if (latest < 0) return { signal: 0.5, interpretation: `FSI ${latest.toFixed(2)} → 정상` };
      return { signal: -1, interpretation: `FSI ${latest.toFixed(2)} → 평균 이상 스트레스` };
    },
  },
  {
    id: 'T10Y2Y',
    name: '수익률 곡선',
    evaluate: (obs) => {
      const latest = getLatest(obs);
      if (latest > 0) return { signal: 0.5, interpretation: `10Y-2Y ${latest.toFixed(2)}%p → 정상 곡선` };
      return { signal: -1, interpretation: `10Y-2Y ${latest.toFixed(2)}%p → 역전 (침체 경고)` };
    },
  },
  {
    id: 'DTWEXBGS',
    name: '달러 인덱스',
    evaluate: (obs) => {
      const latest = getLatest(obs);
      if (latest <= 110) return { signal: 1, interpretation: `달러 ${latest.toFixed(1)} → 약세 (EM 호재)` };
      if (latest <= 120) return { signal: 0, interpretation: `달러 ${latest.toFixed(1)} → 보통` };
      return { signal: -0.5, interpretation: `달러 ${latest.toFixed(1)} → 강세 (EM 부담)` };
    },
  },
  {
    id: 'NFCI',
    name: '금융여건',
    evaluate: (obs) => {
      const latest = getLatest(obs);
      if (latest < -0.5) return { signal: 1, interpretation: `NFCI ${latest.toFixed(2)} → 매우 완화적` };
      if (latest < 0) return { signal: 0.5, interpretation: `NFCI ${latest.toFixed(2)} → 정상` };
      return { signal: -1, interpretation: `NFCI ${latest.toFixed(2)} → 긴축적` };
    },
  },
];

export function calculateLiquidityScore(
  seriesData: Map<string, FredObservation[]>
): LiquidityScore {
  const signals: SignalResult[] = [];
  const warnings: string[] = [];

  for (const config of INDICATOR_CONFIGS) {
    const obs = seriesData.get(config.id);
    if (!obs || obs.length === 0) {
      signals.push({ id: config.id, name: config.name, value: 0, signal: 0, interpretation: '데이터 없음' });
      continue;
    }
    const result = config.evaluate(obs);
    signals.push({
      id: config.id,
      name: config.name,
      value: getLatest(obs),
      signal: result.signal,
      interpretation: result.interpretation,
    });
  }

  // Check for specific warnings
  const rrp = seriesData.get('RRPONTSYD');
  if (rrp && rrp.length > 0 && getLatest(rrp) < 50) {
    warnings.push('역레포 거의 소진 → 유동성 쿠션 부재, QT 충격 직접 전달 위험');
  }

  const fedRate = seriesData.get('FEDFUNDS');
  if (fedRate && fedRate.length > 0 && getLatest(fedRate) > 5) {
    warnings.push(`Fed 금리 ${getLatest(fedRate).toFixed(2)}% → 높은 금리 수준 유지`);
  }

  // Calculate composite score
  const positive = signals.filter(s => s.signal > 0).reduce((a, s) => a + s.signal, 0);
  const negative = signals.filter(s => s.signal < 0).reduce((a, s) => a + Math.abs(s.signal), 0);
  const neutralCount = signals.filter(s => s.signal === 0).length;
  const neutralBonus = neutralCount * 0.25;

  const total = positive + negative + neutralBonus || 1;
  const score = Math.round(((positive + neutralBonus * 0.5) / total) * 100);

  let zone: LiquidityZone;
  let emoji: string;
  let color: string;
  if (score >= 65) {
    zone = 'EXPANSIONARY';
    emoji = '🟢';
    color = '#22c55e';
  } else if (score >= 45) {
    zone = 'TRANSITIONAL';
    emoji = '🟡';
    color = '#f59e0b';
  } else {
    zone = 'RESTRICTIVE';
    emoji = '🔴';
    color = '#ef4444';
  }

  return { score, zone, emoji, color, signals, warnings };
}

export const KEY_INDICATOR_IDS = INDICATOR_CONFIGS.map(c => c.id);
