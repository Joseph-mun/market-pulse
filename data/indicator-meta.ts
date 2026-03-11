// ============================================================
// Indicator Metadata - merged from PPI + Liquidity dashboards
// ============================================================

import type { UpdateFrequency } from '@/lib/types';

export interface IndicatorMeta {
  id: string;
  name: string;
  nameKr: string;
  category: 'PPI' | 'Liquidity';
  subCategory: string;
  unit: string;
  description: string;
  interpretation: string;
  howToRead: string;
  krImpact: string;
  krCompanyLink: string;
  isRate: boolean;
}

// Update frequency mapping
const DAILY_IDS = new Set([
  'DGS10', 'DGS2', 'T10Y2Y', 'T10Y3M', 'DFII10', 'SOFR',
  'BAMLH0A0HYM2', 'BAMLC0A0CM', 'BAMLH0A3HYC', 'BAMLEMHBHYCRPIOAS', 'BAA10Y',
  'STLFSI4', 'NFCI', 'DTWEXBGS',
  'WALCL', 'RRPONTSYD', 'WTREGEN',
]);
const QUARTERLY_IDS = new Set(['M2V', 'M1V']);

export function getUpdateFrequency(id: string): UpdateFrequency {
  if (DAILY_IDS.has(id)) return 'daily';
  if (QUARTERLY_IDS.has(id)) return 'quarterly';
  return 'monthly';
}

export const FREQUENCY_LABELS: Record<UpdateFrequency, string> = {
  realtime: '실시간',
  daily: '일간',
  monthly: '월간',
  quarterly: '분기',
};

// --- PPI Series (32) ---
export const PPI_INDICATORS: IndicatorMeta[] = [
  { id: 'PCU3364133641', name: 'Aerospace Product & Parts Mfg', nameKr: '항공우주 부품', category: 'PPI', subCategory: 'Aerospace & Defense', unit: 'Index', description: '항공우주 제품 및 부품 생산자물가지수', interpretation: '방산/항공 부문 수요와 공급 제약을 반영', howToRead: 'YoY 상승은 방산 지출 확대 또는 공급망 제약 신호', krImpact: '한화에어로스페이스, KAI 매출 환경에 영향', krCompanyLink: '한화에어로스페이스, KAI', isRate: false },
  { id: 'WPSFD49405', name: 'Government Purchases - Defense', nameKr: '국방 조달', category: 'PPI', subCategory: 'Aerospace & Defense', unit: 'Index', description: '정부 국방 구매 물가지수', interpretation: '국방비 지출 강도를 직접 반영', howToRead: '지속 상승은 방산 예산 확대, 방산주에 긍정적', krImpact: '한화에어로스페이스, LIG넥스원 수출 환경', krCompanyLink: '한화에어로스페이스, LIG넥스원', isRate: false },
  { id: 'PCU335911335911', name: 'Battery Manufacturing', nameKr: '배터리 제조', category: 'PPI', subCategory: 'Battery & Storage', unit: 'Index', description: '배터리 제조 생산자물가지수', interpretation: 'EV/ESS 배터리 수요와 원가 구조를 반영', howToRead: '상승은 수요 확대 또는 원자재 비용 전가, 하락은 경쟁 심화', krImpact: '삼성SDI, LG에너지솔루션 수익성에 직접 영향', krCompanyLink: '삼성SDI, LG에너지솔루션', isRate: false },
  { id: 'PCU3359133591', name: 'Storage Battery Mfg', nameKr: '축전지 제조', category: 'PPI', subCategory: 'Battery & Storage', unit: 'Index', description: '축전지 제조 생산자물가지수', interpretation: 'ESS 및 산업용 배터리 시장 동향', howToRead: '배터리 제조 PPI와 함께 확인하여 수요 강도 판단', krImpact: '삼성SDI, LG에너지솔루션', krCompanyLink: '삼성SDI, LG에너지솔루션', isRate: false },
  { id: 'PPIACO', name: 'All Commodities (Benchmark)', nameKr: 'PPI 전체 (벤치마크)', category: 'PPI', subCategory: 'Benchmark', unit: 'Index', description: '전체 원자재 생산자물가지수', interpretation: '전체 PPI의 벤치마크. 인플레이션 선행지표', howToRead: '개별 산업 PPI와 비교하여 상대적 강도 판단', krImpact: 'PPI 전체 벤치마크', krCompanyLink: '', isRate: false },
  { id: 'PPIFIS', name: 'Final Demand (Benchmark)', nameKr: '최종수요 PPI', category: 'PPI', subCategory: 'Benchmark', unit: 'Index', description: '최종수요 기준 생산자물가지수', interpretation: '소비자물가(CPI)의 선행지표', howToRead: '최종수요 PPI 상승은 CPI 상승 압력 → Fed 정책에 영향', krImpact: '최종수요 PPI 벤치마크', krCompanyLink: '', isRate: false },
  { id: 'PCUOMFGOMFG', name: 'Total Manufacturing', nameKr: '제조업 전체', category: 'PPI', subCategory: 'Benchmark', unit: 'Index', description: '제조업 전체 생산자물가지수', interpretation: '미국 제조업 전반의 가격 동향', howToRead: '제조업 전체 가격 방향성 확인용', krImpact: '제조업 전체 PPI', krCompanyLink: '', isRate: false },
  { id: 'WPU061', name: 'Industrial Chemicals', nameKr: '산업화학', category: 'PPI', subCategory: 'Chemical & Materials', unit: 'Index', description: '산업용 화학제품 생산자물가지수', interpretation: '화학산업 수급과 에너지 비용을 반영', howToRead: '급락은 수요 위축 또는 과잉공급, 상승은 경기 회복 신호', krImpact: '한화솔루션, SKC 원가·수익성에 영향', krCompanyLink: '한화솔루션, SKC', isRate: false },
  { id: 'PCU325211325211', name: 'Plastics Material & Resin Mfg', nameKr: '플라스틱/수지', category: 'PPI', subCategory: 'Chemical & Materials', unit: 'Index', description: '플라스틱 원료 및 수지 생산자물가지수', interpretation: '석유화학 다운스트림 제품 가격 동향', howToRead: '유가와 동반 확인. 유가 하락에도 수지 가격 상승이면 수요 강세', krImpact: 'LG화학, 롯데케미칼 수익성', krCompanyLink: 'LG화학, 롯데케미칼', isRate: false },
  { id: 'PCU325325', name: 'Chemical Manufacturing', nameKr: '화학 제조업', category: 'PPI', subCategory: 'Chemical & Materials', unit: 'Index', description: '화학 제조업 전체 생산자물가지수', interpretation: '화학산업 전반의 가격 추세', howToRead: '산업화학(WPU061)과 비교하여 업스트림/다운스트림 차이 분석', krImpact: 'LG화학, 한화솔루션', krCompanyLink: 'LG화학, 한화솔루션', isRate: false },
  { id: 'PCU32733273', name: 'Cement & Concrete Product Mfg', nameKr: '시멘트/콘크리트', category: 'PPI', subCategory: 'Construction & Infrastructure', unit: 'Index', description: '시멘트 및 콘크리트 제품 생산자물가지수', interpretation: '건설 활동과 인프라 투자의 바로미터', howToRead: '지속 상승은 건설 수요 강세, 하락은 건설 경기 둔화', krImpact: '쌍용C&E, 한일시멘트', krCompanyLink: '쌍용C&E, 한일시멘트', isRate: false },
  { id: 'WPUSI012011', name: 'Construction Materials', nameKr: '건설자재', category: 'PPI', subCategory: 'Construction & Infrastructure', unit: 'Index', description: '건설자재 생산자물가지수', interpretation: '건설 원가와 수요 강도를 반영', howToRead: '건설자재 상승은 인프라 투자 확대 신호', krImpact: '건설 관련주 전반', krCompanyLink: '건설 관련주', isRate: false },
  { id: 'PCU3272132721', name: 'Glass & Glass Product Mfg', nameKr: '유리제품', category: 'PPI', subCategory: 'Construction & Infrastructure', unit: 'Index', description: '유리 및 유리제품 생산자물가지수', interpretation: '건설/자동차/디스플레이 관련 유리 수요', howToRead: '건설자재와 함께 확인하여 건설 수요 교차 검증', krImpact: 'KCC, 한글라스', krCompanyLink: 'KCC, 한글라스', isRate: false },
  { id: 'PCU3353133531', name: 'Electrical Equipment Mfg', nameKr: '전기장비', category: 'PPI', subCategory: 'Electrical & Power Infrastructure', unit: 'Index', description: '전기장비 제조 생산자물가지수', interpretation: '전력 인프라 투자와 전기화 트렌드 반영', howToRead: '변압기/배전반과 함께 상승하면 전력 인프라 수요 확인', krImpact: 'LS ELECTRIC, 효성중공업', krCompanyLink: 'LS ELECTRIC, 효성중공업', isRate: false },
  { id: 'WPU1175', name: 'Switchgear & Industrial Controls', nameKr: '스위치기어/산업제어', category: 'PPI', subCategory: 'Electrical & Power Infrastructure', unit: 'Index', description: '스위치기어 및 산업용 제어장치 PPI', interpretation: '전력 배전 인프라의 핵심 부품 수요', howToRead: '스위치기어 상승은 데이터센터/전력망 확장 신호', krImpact: '스위치기어/산업제어장치', krCompanyLink: 'LS ELECTRIC', isRate: false },
  { id: 'PCU335311335311', name: 'Transformer Manufacturing', nameKr: '변압기 제조', category: 'PPI', subCategory: 'Electrical & Power Infrastructure', unit: 'Index', description: '변압기 제조 생산자물가지수', interpretation: '전력 인프라의 핵심. 데이터센터+전기화 수요', howToRead: '역대 최고가 행진 = 구조적 수요 확인. 완제품 가격 전가력 강함', krImpact: 'HD현대일렉트릭, LS ELECTRIC', krCompanyLink: 'HD현대일렉트릭, LS ELECTRIC', isRate: false },
  { id: 'PCU335311335311P', name: 'Transformer Mfg - Primary Products', nameKr: '변압기 1차제품', category: 'PPI', subCategory: 'Electrical & Power Infrastructure', unit: 'Index', description: '변압기 1차제품 생산자물가지수', interpretation: '변압기 핵심 부품/제품의 가격 동향', howToRead: '변압기 전체(PCU335311335311)와 비교하여 마진 구조 분석', krImpact: '변압기 1차제품', krCompanyLink: 'HD현대일렉트릭', isRate: false },
  { id: 'PCU335313335313', name: 'Switchgear & Switchboard Mfg', nameKr: '배전반/개폐기', category: 'PPI', subCategory: 'Electrical & Power Infrastructure', unit: 'Index', description: '배전반 및 개폐기 제조 PPI', interpretation: '전력 배전 인프라의 완제품 수요', howToRead: '원자재(구리)+완제품(배전반) 동시 상승 = 수요가 비용을 소화', krImpact: 'LS ELECTRIC, 효성중공업', krCompanyLink: 'LS ELECTRIC, 효성중공업', isRate: false },
  { id: 'WPU117409', name: 'Power & Distribution Transformers', nameKr: '전력변압기', category: 'PPI', subCategory: 'Electrical & Power Infrastructure', unit: 'Index', description: '전력 및 배전 변압기 PPI', interpretation: '전력망 변압기 시장의 가격 동향', howToRead: '2019년 대비 +89% 상승 = 역대급 수요. AI 데이터센터 전력 수요', krImpact: 'HD현대일렉트릭', krCompanyLink: 'HD현대일렉트릭', isRate: false },
  { id: 'PCU2211222112', name: 'Electric Power Transmission & Distribution', nameKr: '전력 송배전', category: 'PPI', subCategory: 'Energy & Turbines', unit: 'Index', description: '전력 송배전 서비스 PPI', interpretation: '전력 유틸리티 서비스 가격', howToRead: '전력 요금 및 송배전 비용 동향. 유틸리티 수익성과 직결', krImpact: '한전, LS ELECTRIC', krCompanyLink: '한전, LS ELECTRIC', isRate: false },
  { id: 'PCU333132333132', name: 'Oil & Gas Field Machinery Mfg', nameKr: '유전장비', category: 'PPI', subCategory: 'Energy & Turbines', unit: 'Index', description: '유전 장비 제조 PPI', interpretation: '에너지 설비투자(CAPEX) 강도를 반영', howToRead: '유가와 함께 확인. 유가 상승 + 장비 PPI 상승 = 에너지 CAPEX 사이클', krImpact: '에너지 관련주', krCompanyLink: '에너지 관련주', isRate: false },
  { id: 'PCU333611333611', name: 'Turbine & Generator Set Mfg', nameKr: '터빈/발전기', category: 'PPI', subCategory: 'Energy & Turbines', unit: 'Index', description: '터빈 및 발전기 세트 제조 PPI', interpretation: '발전 설비 수요. 전력 인프라 투자의 또 다른 축', howToRead: '전력변압기와 함께 상승하면 전력 인프라 전반 확장', krImpact: '두산에너빌리티, 효성중공업', krCompanyLink: '두산에너빌리티, 효성중공업', isRate: false },
  { id: 'PCU333131333131', name: 'Mining Machinery & Equipment Mfg', nameKr: '광산장비', category: 'PPI', subCategory: 'Heavy Machinery', unit: 'Index', description: '광산 기계 및 장비 제조 PPI', interpretation: '광산 설비투자와 원자재 채굴 수요', howToRead: '광산장비 상승은 원자재 채굴 확대 신호', krImpact: '두산밥캣, 현대두산인프라코어', krCompanyLink: '두산밥캣, 현대두산인프라코어', isRate: false },
  { id: 'WPU112', name: 'Construction Machinery', nameKr: '건설기계', category: 'PPI', subCategory: 'Heavy Machinery', unit: 'Index', description: '건설기계 생산자물가지수', interpretation: '건설/인프라 장비 수요와 가격', howToRead: '건설자재와 함께 확인하여 건설 투자 사이클 판단', krImpact: '두산밥캣, HD현대건설기계', krCompanyLink: '두산밥캣, HD현대건설기계', isRate: false },
  { id: 'WPU1017', name: 'Steel Mill Products', nameKr: '철강제품', category: 'PPI', subCategory: 'Metals & Materials', unit: 'Index', description: '철강 제품 생산자물가지수', interpretation: '철강 수급과 글로벌 제조업 경기', howToRead: '사이클성 반등과 구조적 수요를 구분 필요. 중국 수요가 핵심 변수', krImpact: 'POSCO', krCompanyLink: 'POSCO', isRate: false },
  { id: 'WPU101', name: 'Iron & Steel', nameKr: '철강', category: 'PPI', subCategory: 'Metals & Materials', unit: 'Index', description: '철 및 철강 생산자물가지수', interpretation: '철강 산업 전반의 가격 동향', howToRead: '철강제품(WPU1017)과 함께 확인하여 밸류체인 분석', krImpact: 'POSCO, 현대제철', krCompanyLink: 'POSCO, 현대제철', isRate: false },
  { id: 'WPUSI019011', name: 'Copper & Copper Products', nameKr: '구리', category: 'PPI', subCategory: 'Metals & Materials', unit: 'Index', description: '구리 및 구리 제품 PPI', interpretation: '경기 선행지표("Dr. Copper"). 전기화 핵심 원자재', howToRead: '구조적 수요(전기화+AI) vs 사이클 반등 구분. +22% YoY = 구조적', krImpact: 'LS, 풍산', krCompanyLink: 'LS, 풍산', isRate: false },
  { id: 'WPU102501', name: 'Aluminum Mill Shapes', nameKr: '알루미늄', category: 'PPI', subCategory: 'Metals & Materials', unit: 'Index', description: '알루미늄 가공제품 PPI', interpretation: '경량화 트렌드(EV, 항공)와 건설 수요 반영', howToRead: '+33% YoY = 구조적 수요 전환. EV 경량화 핵심 소재', krImpact: '노벨리스, 조일알미늄', krCompanyLink: '노벨리스, 조일알미늄', isRate: false },
  { id: 'WPU10260314', name: 'Copper Wire & Cable', nameKr: '전선/케이블', category: 'PPI', subCategory: 'Metals & Materials', unit: 'Index', description: '구리 전선 및 케이블 PPI', interpretation: '전력 인프라 확장의 직접적 수혜. 구리 가격 + 전력 수요', howToRead: '구리 원자재 + 전선 완제품 동시 상승 = 강한 수요 확인', krImpact: 'LS전선, 대한전선', krCompanyLink: 'LS전선, 대한전선', isRate: false },
  { id: 'PCU33443344', name: 'Semiconductor & Electronic Component Mfg', nameKr: '반도체/전자부품', category: 'PPI', subCategory: 'Semiconductor & Electronics', unit: 'Index', description: '반도체 및 전자부품 제조 PPI', interpretation: 'AI/반도체 수요와 가격 결정력', howToRead: '반도체 PPI 상승은 수요>공급 확인. AI 투자 사이클 반영', krImpact: '삼성전자, SK하이닉스', krCompanyLink: '삼성전자, SK하이닉스', isRate: false },
  { id: 'PCU334334', name: 'Computer & Electronic Product Mfg', nameKr: '컴퓨터/전자제품', category: 'PPI', subCategory: 'Semiconductor & Electronics', unit: 'Index', description: '컴퓨터 및 전자제품 제조 PPI', interpretation: 'IT 하드웨어 수요와 가격 트렌드', howToRead: '반도체 PPI와 함께 IT 수요 사이클 확인', krImpact: '삼성전자, LG전자', krCompanyLink: '삼성전자, LG전자', isRate: false },
  { id: 'PCU334413334413', name: 'Semiconductor & Related Device Mfg', nameKr: '반도체 소자', category: 'PPI', subCategory: 'Semiconductor & Electronics', unit: 'Index', description: '반도체 소자 제조 PPI', interpretation: '반도체 칩 자체의 가격 동향 (하락 추세가 일반적)', howToRead: '반도체는 기술 발전으로 PPI 하락이 자연스러움. 하락 속도가 핵심', krImpact: '삼성전자, SK하이닉스', krCompanyLink: '삼성전자, SK하이닉스', isRate: false },
];

// --- Liquidity Series (31) ---
export const LIQUIDITY_INDICATORS: IndicatorMeta[] = [
  { id: 'M2SL', name: 'US M2', nameKr: 'M2 통화량', category: 'Liquidity', subCategory: 'M2/M3 통화량', unit: 'B USD', description: '미국 M2 광의통화', interpretation: '경제 내 유동성 총량의 핵심 지표', howToRead: 'YoY > 0% = 유동성 확장, < 0% = 축소', krImpact: '글로벌 달러 유동성 → 원/달러, KOSPI 상관', krCompanyLink: '', isRate: false },
  { id: 'M1SL', name: 'US M1', nameKr: 'M1 통화량', category: 'Liquidity', subCategory: 'M2/M3 통화량', unit: 'B USD', description: '미국 M1 협의통화', interpretation: '즉시 사용 가능한 유동성', howToRead: '2020.5 정의 변경 이후 추세만 참고', krImpact: '미국 소비/투자 즉각 반응 → 한국 수출 수요', krCompanyLink: '', isRate: false },
  { id: 'MANMM101JPM189S', name: 'Japan M3', nameKr: '일본 M3', category: 'Liquidity', subCategory: 'M2/M3 통화량', unit: 'JPY', description: '일본 광의통화 M3', interpretation: 'BOJ 양적완화의 직접적 결과', howToRead: '증가 속도의 변화가 중요', krImpact: '엔캐리 트레이드 → 한국 자금 유입/유출', krCompanyLink: '', isRate: false },
  { id: 'MANMM101EZM189S', name: 'Euro Area M3', nameKr: '유로존 M3', category: 'Liquidity', subCategory: 'M2/M3 통화량', unit: 'EUR', description: '유로존 광의통화 M3', interpretation: 'ECB 통화정책 효과 측정', howToRead: 'M3 감소는 유로존 신용 위축 신호', krImpact: '유럽 자금 EM 투자 방향', krCompanyLink: '', isRate: false },
  { id: 'MANMM101KRM189S', name: 'Korea M3', nameKr: '한국 M3', category: 'Liquidity', subCategory: 'M2/M3 통화량', unit: 'KRW', description: '한국 광의통화 M3', interpretation: '한국 내 전체 유동성 최광의 측정', howToRead: '부동산/주식과 높은 상관. 재확장 시 자산가격 상승', krImpact: 'KOSPI, 부동산 직접 영향', krCompanyLink: '', isRate: false },
  { id: 'FEDFUNDS', name: 'Fed Funds Rate', nameKr: '연방기금금리', category: 'Liquidity', subCategory: '기준금리', unit: '%', description: '미국 연방기금금리', interpretation: '글로벌 유동성의 핵심 기준. 모든 금리의 기준점', howToRead: '인하 사이클 = 유동성 완화, 인상 = 긴축. 방향과 속도가 핵심', krImpact: 'Fed 인하 → 한미 금리차 축소 → 원화 강세 → 외국인 매수', krCompanyLink: '', isRate: true },
  { id: 'ECBMRRFR', name: 'ECB Rate', nameKr: 'ECB 금리', category: 'Liquidity', subCategory: '기준금리', unit: '%', description: 'ECB 주요재융자금리', interpretation: '유로존 통화정책의 핵심', howToRead: 'ECB 인하 → 유로화 약세, 유로존 유동성 확장', krImpact: '유로/원 환율, 유럽계 자금 한국 투자', krCompanyLink: '', isRate: true },
  { id: 'INTDSRKRM193N', name: 'Korea Base Rate', nameKr: '한국 기준금리', category: 'Liquidity', subCategory: '기준금리', unit: '%', description: '한국은행 기준금리', interpretation: '한국 내 모든 금리의 기준점', howToRead: 'Fed와의 금리차가 핵심. 인하 → 주식/부동산 상승 압력', krImpact: '직접적 영향. 인하→주식/부동산 상승, 원화 약세', krCompanyLink: '', isRate: true },
  { id: 'IRSTCI01JPM156N', name: 'Japan Call Rate', nameKr: '일본 콜금리', category: 'Liquidity', subCategory: '기준금리', unit: '%', description: 'BOJ 정책금리', interpretation: 'BOJ 금리 정상화 속도가 핵심', howToRead: '급격한 인상 → 엔캐리 청산 → 글로벌 위험자산 급락', krImpact: 'BOJ 인상 → 엔캐리 청산 → EM 자금 이탈', krCompanyLink: '', isRate: true },
  { id: 'INTDSRCNM193N', name: 'China Policy Rate', nameKr: '중국 정책금리', category: 'Liquidity', subCategory: '기준금리', unit: '%', description: 'PBOC 정책금리', interpretation: '중국 경기부양 강도의 바로미터', howToRead: '중국 인하 → 위안화 약세 + 내수 부양', krImpact: '중국 인하/부양 → 한국 대중 수출 회복', krCompanyLink: '', isRate: true },
  { id: 'WALCL', name: 'Fed Total Assets', nameKr: 'Fed 총자산', category: 'Liquidity', subCategory: 'Fed 밸런스시트', unit: 'M USD', description: 'Fed 총자산 (QE/QT)', interpretation: 'QE 시 증가, QT 시 감소', howToRead: 'QT 속도 감속 = 유동성 압박 완화. 재확장 = 강력한 유동성 공급', krImpact: 'Fed B/S 확장 → 달러 유동성 범람 → 글로벌 자산 상승', krCompanyLink: '', isRate: false },
  { id: 'RRPONTSYD', name: 'ON RRP (Reverse Repo)', nameKr: '역레포', category: 'Liquidity', subCategory: 'Fed 밸런스시트', unit: 'B USD', description: 'Overnight Reverse Repo 잔고', interpretation: '금융시스템 과잉유동성의 완충장치', howToRead: '거의 0으로 소진 = 유동성 쿠션 소멸. 핵심 모니터링 대상', krImpact: '역레포 소진 + QT 지속 → EM 변동성 확대', krCompanyLink: '', isRate: false },
  { id: 'WTREGEN', name: 'TGA (Treasury General Account)', nameKr: 'TGA', category: 'Liquidity', subCategory: 'Fed 밸런스시트', unit: 'M USD', description: '미 재무부 일반계정 잔고', interpretation: '정부 지출 → TGA 감소 → 시장 유동성 공급', howToRead: 'TGA 급감 → 유동성 공급, TGA 급증 → 유동성 흡수', krImpact: 'TGA 감소 → 위험자산 상승 → 한국 간접 호재', krCompanyLink: '', isRate: false },
  { id: 'BOGMBASE', name: 'Monetary Base', nameKr: '본원통화', category: 'Liquidity', subCategory: 'Fed 밸런스시트', unit: 'B USD', description: '본원통화 (화폐발행고+지급준비금)', interpretation: 'Fed 직접 창출 "고출력 화폐"', howToRead: '본원통화 증가 = Fed 유동성 공급 의지 직접 반영', krImpact: '글로벌 달러 유동성 증가 → EM 자산 장기 호재', krCompanyLink: '', isRate: false },
  { id: 'JPNASSETS', name: 'BOJ Total Assets', nameKr: 'BOJ 총자산', category: 'Liquidity', subCategory: 'Fed 밸런스시트', unit: '100M JPY', description: '일본은행 총자산', interpretation: 'GDP 대비 세계 최대 규모', howToRead: 'BOJ 자산 증가 = 양적완화 지속 = 엔화 공급 확대', krImpact: 'BOJ 완화 → 엔화 약세 → 한국 수출 경쟁력 부담', krCompanyLink: '', isRate: false },
  { id: 'DGS10', name: '10Y Treasury', nameKr: '미국 10년물', category: 'Liquidity', subCategory: '금리/수익률곡선', unit: '%', description: '미국 10년물 국채 수익률', interpretation: '세계에서 가장 중요한 금리', howToRead: '상승 → 인플레/성장 기대↑, 하락 → 경기침체 우려/안전자산', krImpact: '미국 10년물↑ → 한국 채권금리 동반↑, 자금조달 비용↑', krCompanyLink: '', isRate: true },
  { id: 'DGS2', name: '2Y Treasury', nameKr: '미국 2년물', category: 'Liquidity', subCategory: '금리/수익률곡선', unit: '%', description: '미국 2년물 국채 수익률', interpretation: 'Fed 정책 방향에 가장 민감', howToRead: '2년물 하락 → 시장 Fed 인하 기대', krImpact: '2년물 하락 → 달러 약세 전환 기대 → 원화 강세', krCompanyLink: '', isRate: true },
  { id: 'T10Y2Y', name: '10Y-2Y Spread', nameKr: '장단기 금리차', category: 'Liquidity', subCategory: '금리/수익률곡선', unit: '%p', description: '장단기 금리차 (10년-2년)', interpretation: '가장 유명한 경기침체 선행지표', howToRead: '역전 → 침체 경고. 재정상화 → 침체 "임박"일 수 있음', krImpact: '미국 침체 → 한국 수출 급감 → KOSPI 하락', krCompanyLink: '', isRate: true },
  { id: 'T10Y3M', name: '10Y-3M Spread', nameKr: '10년-3개월 금리차', category: 'Liquidity', subCategory: '금리/수익률곡선', unit: '%p', description: '10년-3개월 금리차', interpretation: 'Fed가 선호하는 경기침체 예측 지표', howToRead: '역전 지속 = Fed 과도 긴축 시장 시그널', krImpact: '10Y-2Y와 함께 경기침체 확률 판단', krCompanyLink: '', isRate: true },
  { id: 'DFII10', name: '10Y Real Yield (TIPS)', nameKr: '10년 실질금리', category: 'Liquidity', subCategory: '금리/수익률곡선', unit: '%', description: '10년 실질금리 (TIPS)', interpretation: '인플레이션 차감한 진짜 자금 비용', howToRead: '실질금리↑ → 성장주 부정적. 2%↑는 매우 긴축적', krImpact: '실질금리↑ → 한국 성장주 밸류에이션 하방 압력', krCompanyLink: '', isRate: true },
  { id: 'SOFR', name: 'SOFR', nameKr: 'SOFR', category: 'Liquidity', subCategory: '금리/수익률곡선', unit: '%', description: 'Secured Overnight Financing Rate', interpretation: 'LIBOR 대체 글로벌 기준금리', howToRead: 'Fed 금리 범위 이탈 → 자금시장 스트레스', krImpact: 'SOFR 하락 → 한국 기업 달러 조달 비용 감소', krCompanyLink: '', isRate: true },
  { id: 'BAMLH0A0HYM2', name: 'US HY OAS', nameKr: 'HY 신용스프레드', category: 'Liquidity', subCategory: '신용스프레드', unit: '%', description: 'US 하이일드 채권 OAS', interpretation: '리스크 선호/회피 심리의 직접 반영', howToRead: '<300bp = 극도 낙관, 500bp+ = 리스크 오프, 600bp+ = 심각', krImpact: 'HY 확대 → 글로벌 위험자산 회피 → 한국 외국인 매도', krCompanyLink: '', isRate: true },
  { id: 'BAMLC0A0CM', name: 'US IG OAS', nameKr: 'IG 신용스프레드', category: 'Liquidity', subCategory: '신용스프레드', unit: '%', description: '미국 투자등급 회사채 OAS', interpretation: '투자등급 채권 시장 건전성', howToRead: '<80bp = 타이트, 150bp+ = 스트레스 징후', krImpact: 'IG 확대 → 삼성/SK 달러 회사채 발행 비용↑', krCompanyLink: '', isRate: true },
  { id: 'BAMLH0A3HYC', name: 'CCC & Lower OAS', nameKr: 'CCC등급 스프레드', category: 'Liquidity', subCategory: '신용스프레드', unit: '%', description: 'CCC등급 이하 초고위험 채권 스프레드', interpretation: '부도 위험 최고 채권. "탄광의 카나리아"', howToRead: '<1000bp = 리스크온 극대, 1500bp+ = 신용 경색', krImpact: 'CCC 급등 → 글로벌 신용 경색 → 한국 고레버리지 기업 타격', krCompanyLink: '', isRate: true },
  { id: 'BAMLEMHBHYCRPIOAS', name: 'EM HY OAS', nameKr: 'EM HY 스프레드', category: 'Liquidity', subCategory: '신용스프레드', unit: '%', description: '이머징 하이일드 채권 스프레드', interpretation: 'EM 자금조달 환경과 투자자 신뢰', howToRead: '확대 → EM 자금 이탈, 축소 → EM 자금 유입', krImpact: '한국은 MSCI EM. 확대 시 동반 자금 유출', krCompanyLink: '', isRate: true },
  { id: 'BAA10Y', name: 'Baa-10Y Spread', nameKr: 'Baa 스프레드', category: 'Liquidity', subCategory: '신용스프레드', unit: '%', description: 'Baa등급-10년 국채 스프레드', interpretation: '투자등급 최하위 경계선 리스크 프리미엄', howToRead: '<200bp = 양호, 300bp+ = 긴축 시작, 400bp+ = 심각', krImpact: '한국 BBB급 기업 글로벌 차입 비용 방향', krCompanyLink: '', isRate: true },
  { id: 'STLFSI4', name: 'STL Financial Stress', nameKr: '금융스트레스', category: 'Liquidity', subCategory: '금융환경', unit: 'Index', description: 'St. Louis Fed 금융스트레스지수', interpretation: '18개 금융 변수 결합 복합 스트레스 지표', howToRead: '<0 = 정상, 0~1 = 경미, >1 = 의미있는 스트레스, >2 = 위기', krImpact: '미국 금융 스트레스 → 글로벌 전이 → 한국 CDS↑', krCompanyLink: '', isRate: true },
  { id: 'NFCI', name: 'Chicago NFCI', nameKr: 'NFCI', category: 'Liquidity', subCategory: '금융환경', unit: 'Index', description: 'National Financial Conditions Index', interpretation: '105개 금융 변수 결합', howToRead: '음수 = 완화적, 양수 = 긴축적, -0.5↓ = 매우 완화', krImpact: 'NFCI 완화 → 캐리 트레이드 → 한국 자금 유입', krCompanyLink: '', isRate: true },
  { id: 'DTWEXBGS', name: 'US Dollar Index', nameKr: '달러 인덱스', category: 'Liquidity', subCategory: '금융환경', unit: 'Index', description: 'Fed 광의 달러인덱스 (26개국 가중)', interpretation: '달러 대외 가치. 글로벌 유동성 대용', howToRead: '달러 강세 = 글로벌 유동성 긴축, 달러 약세 = 완화', krImpact: '달러 강세 → 원/달러↑ → 외국인 유출', krCompanyLink: '', isRate: true },
  { id: 'M2V', name: 'M2 Velocity', nameKr: 'M2 유통속도', category: 'Liquidity', subCategory: '통화유통속도', unit: 'Ratio', description: 'M2 유통속도 (GDP/M2)', interpretation: '통화가 경제에서 얼마나 빨리 회전하는가', howToRead: '유통속도 상승 = 같은 통화로 더 많은 경제활동 = 인플레↑', krImpact: '유통속도 회복 → 미국 내수 활성화 → 한국 대미 수출 수혜', krCompanyLink: '', isRate: true },
  { id: 'M1V', name: 'M1 Velocity', nameKr: 'M1 유통속도', category: 'Liquidity', subCategory: '통화유통속도', unit: 'Ratio', description: 'M1 유통속도 (GDP/M1)', interpretation: '즉시 유동성의 활용 정도', howToRead: '2020.5 정의 변경 이후 추세만 참고', krImpact: 'M2V와 유사한 영향', krCompanyLink: '', isRate: true },
];

export const ALL_INDICATORS = [...PPI_INDICATORS, ...LIQUIDITY_INDICATORS];

export function getIndicatorMeta(id: string): IndicatorMeta | undefined {
  return ALL_INDICATORS.find(i => i.id === id);
}
