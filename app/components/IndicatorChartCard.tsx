'use client';

import { useMemo, useRef, useEffect } from 'react';
import type { IndicatorRow, ChartRange } from '@/lib/types';

interface Props {
  indicator: IndicatorRow;
  chartRange: ChartRange;
  isSelected: boolean;
  onClick: () => void;
}

const RANGE_MONTHS: Record<ChartRange, number> = {
  '1Y': 12,
  '3Y': 36,
  '5Y': 60,
  '7Y': 84,
};

function SignalDot({ signal }: { signal: string }) {
  const colors: Record<string, string> = {
    strong_up: '#ef4444',
    moderate_up: '#f59e0b',
    reversal: '#eab308',
    cooling: '#6b7280',
    mild_decline: '#6b7280',
    deep_decline: '#3b82f6',
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: colors[signal] ?? '#6b7280' }}
    />
  );
}

function formatValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(value) >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function ChangeTag({ value, unit }: { value: number | null; unit: string }) {
  if (value === null) return <span className="text-[9px] text-[var(--text-muted)]">—</span>;
  const color = value > 0 ? 'text-[var(--accent-green)]' : value < 0 ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]';
  const prefix = value > 0 ? '+' : '';
  const suffix = unit === '%' || unit === '%p' ? '%p' : '%';
  return <span className={`text-[9px] tabular-nums ${color}`}>{prefix}{value.toFixed(1)}{suffix}</span>;
}

export default function IndicatorChartCard({ indicator, chartRange, isSelected, onClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filteredObs = useMemo(() => {
    if (!indicator.observations || indicator.observations.length === 0) return [];
    const months = RANGE_MONTHS[chartRange];
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return indicator.observations.filter(o => o.date >= cutoffStr);
  }, [indicator.observations, chartRange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || filteredObs.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const values = filteredObs.map(o => o.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const padding = { top: 8, bottom: 20, left: 0, right: 0 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(42, 58, 78, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    // Draw area fill
    const trend = values[values.length - 1] >= values[0];
    const lineColor = trend ? '#22c55e' : '#ef4444';
    const fillColor = trend ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)';

    const stepX = chartW / (values.length - 1);
    const getY = (val: number) => padding.top + chartH - ((val - min) / range) * chartH;

    // Fill area
    ctx.beginPath();
    ctx.moveTo(padding.left, getY(values[0]));
    values.forEach((val, i) => {
      ctx.lineTo(padding.left + i * stepX, getY(val));
    });
    ctx.lineTo(padding.left + (values.length - 1) * stepX, h - padding.bottom);
    ctx.lineTo(padding.left, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    values.forEach((val, i) => {
      const x = padding.left + i * stepX;
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw latest value dot
    const lastX = padding.left + (values.length - 1) * stepX;
    const lastY = getY(values[values.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Y-axis labels (min/max)
    ctx.fillStyle = '#6b7280';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(formatValue(max), w - 2, padding.top + 8);
    ctx.fillText(formatValue(min), w - 2, h - padding.bottom - 2);

    // X-axis labels (first/last date)
    ctx.textAlign = 'left';
    ctx.fillText(filteredObs[0].date.slice(2, 7), padding.left, h - 4);
    ctx.textAlign = 'right';
    ctx.fillText(filteredObs[filteredObs.length - 1].date.slice(2, 7), w - padding.right, h - 4);
  }, [filteredObs]);

  return (
    <div
      onClick={onClick}
      className={`bg-[var(--bg-card)] rounded-lg border cursor-pointer card-hover transition-all ${
        isSelected
          ? 'border-[var(--accent-cyan)] ring-1 ring-[var(--accent-cyan)]/30'
          : 'border-[var(--border)]'
      }`}
    >
      {/* Header */}
      <div className="px-3 pt-2.5 pb-1 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <SignalDot signal={indicator.signal} />
            <span className="text-[11px] font-medium text-[var(--text-primary)] truncate">{indicator.nameKr}</span>
          </div>
          <div className="text-[9px] text-[var(--text-muted)] mt-0.5 truncate">{indicator.id}</div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="text-xs font-semibold tabular-nums">{formatValue(indicator.latestValue)}</div>
          <div className="text-[9px] text-[var(--text-muted)]">{indicator.unit}</div>
        </div>
      </div>

      {/* Chart area */}
      <div className="px-2 pb-1" style={{ height: 80 }}>
        {filteredObs.length >= 2 ? (
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-[var(--text-muted)]">
            데이터 부족
          </div>
        )}
      </div>

      {/* Footer: change metrics */}
      <div className="px-3 pb-2 flex items-center justify-between border-t border-[var(--border)]/50 pt-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[var(--text-muted)]">MoM</span>
          <ChangeTag value={indicator.mom} unit={indicator.unit} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[var(--text-muted)]">YoY</span>
          <ChangeTag value={indicator.yoy} unit={indicator.unit} />
        </div>
        <span className="text-[9px] text-[var(--text-muted)]">{indicator.latestDate}</span>
      </div>
    </div>
  );
}
