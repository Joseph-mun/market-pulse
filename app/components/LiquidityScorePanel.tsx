'use client';

import type { LiquidityScore } from '@/lib/types';

interface Props {
  score: LiquidityScore;
}

const ZONE_LABELS: Record<string, { kr: string; en: string }> = {
  EXPANSIONARY: { kr: '유동성 확장', en: 'Expansionary' },
  TRANSITIONAL: { kr: '유동성 전환', en: 'Transitional' },
  RESTRICTIVE: { kr: '유동성 긴축', en: 'Restrictive' },
};

function SignalBar({ signal }: { signal: number }) {
  const width = Math.abs(signal) * 100;
  const color = signal > 0 ? 'var(--accent-green)' : signal < 0 ? 'var(--accent-red)' : 'var(--text-muted)';
  return (
    <div className="w-12 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function LiquidityScorePanel({ score }: Props) {
  const zoneInfo = ZONE_LABELS[score.zone] ?? { kr: '—', en: '—' };
  const bullish = score.signals.filter(s => s.signal > 0).length;
  const bearish = score.signals.filter(s => s.signal < 0).length;

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] p-4">
      <div className="flex items-center gap-1 mb-3">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Liquidity Score</h3>
      </div>

      {/* Score display */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-center">
          <div
            className="text-4xl font-extrabold tabular-nums"
            style={{ color: score.color, minWidth: '70px' }}
          >
            {score.score}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5 uppercase tracking-wider">Score</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{score.emoji}</span>
            <span className="text-sm font-semibold" style={{ color: score.color }}>{zoneInfo.kr}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{zoneInfo.en}</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-[var(--accent-green)]">{bullish} bullish</span>
            <span className="text-[var(--text-muted)]">vs</span>
            <span className="text-[var(--accent-red)]">{bearish} bearish</span>
          </div>
        </div>
      </div>

      {/* Signal breakdown */}
      <div className="space-y-1.5">
        {score.signals.map((sig) => (
          <div key={sig.id} className="flex items-center gap-2 text-xs">
            <span className="w-20 text-[var(--text-muted)] truncate">{sig.name}</span>
            <SignalBar signal={sig.signal} />
            <span className="flex-1 text-[var(--text-secondary)] truncate">{sig.interpretation}</span>
          </div>
        ))}
      </div>

      {/* Warnings */}
      {score.warnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          {score.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-[var(--accent-amber)] mb-1">
              <span>⚠️</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Structural context disclaimer */}
      <div className="mt-3 pt-3 border-t border-[var(--border)]">
        <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
          <p className="text-[10px] text-[var(--accent-cyan)] leading-relaxed">
            <span className="font-semibold">유의:</span>{' '}
            {score.score}점 = <em>지금 이 순간</em>의 환경이 {score.score >= 65 ? '좋다' : score.score >= 45 ? '혼재' : '나쁘다'}는 의미이지,
            앞으로도 {score.score >= 65 ? '좋을' : '그럴'} 거라는 뜻이 아닙니다.
            역레포 소진 같은 구조적 변화는 다음 변동성이 왔을 때 과거보다 더 날카롭게 올 수 있다는 경고입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
