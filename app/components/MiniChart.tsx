'use client';

import { useRef, useEffect } from 'react';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function MiniChart({ data, width = 60, height = 20, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const stepX = width / (data.length - 1);

    // Determine color based on trend
    const strokeColor = color ?? (data[data.length - 1] >= data[0] ? '#22c55e' : '#ef4444');

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.2;
    ctx.lineJoin = 'round';

    data.forEach((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * (height - 2) - 1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="inline-block"
    />
  );
}
