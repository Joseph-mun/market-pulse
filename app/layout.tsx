import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bloom Monitor | 산업별 시장 모니터링',
  description: 'Bloomberg-style 금융 모니터링 대시보드. FRED PPI 64개 시리즈 + 글로벌 유동성 + 환율/지수 통합 분석',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
