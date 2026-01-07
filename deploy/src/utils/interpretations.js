/**
 * 간섬유화 계산기 - 해석 유틸리티
 * 질환별 APRI/FIB-4 Cut-off 및 해석 기준
 */

/**
 * 질환 목록 및 FIB-4 Cut-off 정보
 *
 * 참고문헌:
 * - HCV: Sterling 2006 (원저)
 * - NAFLD: Shah 2009, McPherson 2017
 * - HBV: 표준 적용
 */
export const DISEASES = {
  HCV: {
    id: 'HCV',
    name: '만성 C형 간염',
    shortName: 'HCV',
    // APRI 신뢰도
    apriReliability: 'high',
    apriAUROC: '0.80-0.83',
    apriRecommended: true,
    // FIB-4 신뢰도 및 Cut-off (Sterling 2006 원저)
    fib4Reliability: 'high',
    fib4AUROC: '0.80-0.85',
    fib4Recommended: true,
    fib4Cutoffs: {
      low: 1.45,      // < 1.45: 섬유화 배제
      high: 3.25      // > 3.25: 섬유화 시사
    },
    // 65세 이상 보정 없음 (원저 기준)
    fib4ElderlyAdjustment: false,
    description: 'APRI/FIB-4 원저 개발 질환으로 가장 확실한 근거',
    reference: 'Sterling 2006'
  },
  HBV: {
    id: 'HBV',
    name: '만성 B형 간염',
    shortName: 'HBV',
    apriReliability: 'high',
    apriAUROC: '0.72-0.80',
    apriRecommended: true,
    fib4Reliability: 'high',
    fib4AUROC: '0.75-0.85',
    fib4Recommended: true,
    fib4Cutoffs: {
      low: 1.30,      // < 1.30: 섬유화 배제
      high: 2.67      // > 2.67: 섬유화 시사
    },
    fib4ElderlyAdjustment: false,
    description: 'NAFLD와 유사한 cut-off 적용',
    caution: 'HBV flare 시 AST 급상승으로 위양성 가능',
    reference: '표준 적용'
  },
  NAFLD: {
    id: 'NAFLD',
    name: '비알코올성 지방간질환',
    shortName: 'NAFLD',
    apriReliability: 'low',
    apriAUROC: '0.67-0.78',
    apriRecommended: false,
    fib4Reliability: 'high',
    fib4AUROC: '0.80-0.85',
    fib4Recommended: true,
    fib4Cutoffs: {
      low: 1.30,      // < 1.30: 섬유화 배제 (65세 미만)
      high: 2.67,     // > 2.67: 섬유화 시사
      elderlyLow: 2.0 // < 2.0: 섬유화 배제 (65세 이상)
    },
    fib4ElderlyAdjustment: true,
    description: 'FIB-4 권장, APRI 단독 사용 비권장',
    caution: 'EASL/AASLD: APRI 대신 FIB-4 권장',
    reference: 'Shah 2009, McPherson 2017'
  }
};

/**
 * 신뢰도 레벨별 스타일
 */
export const RELIABILITY_STYLES = {
  high: { label: '높음', colorClass: 'text-green-600 bg-green-50', stars: 3 },
  medium: { label: '중간', colorClass: 'text-yellow-600 bg-yellow-50', stars: 2 },
  low: { label: '낮음', colorClass: 'text-red-600 bg-red-50', stars: 1 }
};

/**
 * 색상별 스타일 클래스
 */
const COLOR_STYLES = {
  green: {
    badge: 'bg-green-100 text-green-800',
    result: 'text-green-600 bg-green-50 border-green-200',
    gauge: '#22c55e'
  },
  yellow: {
    badge: 'bg-yellow-100 text-yellow-800',
    result: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    gauge: '#eab308'
  },
  orange: {
    badge: 'bg-orange-100 text-orange-800',
    result: 'text-orange-600 bg-orange-50 border-orange-200',
    gauge: '#f97316'
  },
  red: {
    badge: 'bg-red-100 text-red-800',
    result: 'text-red-600 bg-red-50 border-red-200',
    gauge: '#ef4444'
  }
};

/**
 * 색상별 배지 클래스 반환
 */
export function getColorBadgeClass(color) {
  return COLOR_STYLES[color]?.badge || 'bg-gray-100 text-gray-800';
}

/**
 * APRI Score 해석
 *
 * Cut-off 기준 (모든 질환 동일):
 * < 0.5: 유의한 섬유화 가능성 낮음
 * 0.5-1.5: 불확정
 * >= 1.5: 유의한 섬유화 의심
 * >= 2.0: 간경변 가능성
 */
export function interpretAPRI(score) {
  if (score === null || score === undefined) return null;

  if (score < 0.5) {
    return {
      level: 'low',
      color: 'green',
      colorClass: COLOR_STYLES.green.result,
      gaugeColor: COLOR_STYLES.green.gauge,
      stage: 'F0-F1',
      text: '유의한 섬유화 가능성 낮음',
      detail: 'NPV approximately 90%',
      recommendation: '정기적인 추적 관찰을 권장합니다.'
    };
  }

  if (score < 1.5) {
    return {
      level: 'indeterminate',
      color: 'yellow',
      colorClass: COLOR_STYLES.yellow.result,
      gaugeColor: COLOR_STYLES.yellow.gauge,
      stage: '불확정',
      text: '추가 검사 권고',
      detail: 'Fibroscan, 간생검 등 고려',
      recommendation: 'Fibroscan 또는 다른 비침습적 검사를 권장합니다.'
    };
  }

  if (score < 2.0) {
    return {
      level: 'high',
      color: 'orange',
      colorClass: COLOR_STYLES.orange.result,
      gaugeColor: COLOR_STYLES.orange.gauge,
      stage: 'F2-F4',
      text: '유의한 섬유화 의심',
      detail: 'PPV approximately 65%',
      recommendation: '전문의 상담 및 추가 정밀검사를 권장합니다.'
    };
  }

  return {
    level: 'very-high',
    color: 'red',
    colorClass: COLOR_STYLES.red.result,
    gaugeColor: COLOR_STYLES.red.gauge,
    stage: 'F4',
    text: '간경변 가능성 높음',
    detail: 'PPV approximately 65%',
    recommendation: '즉시 전문의 상담이 필요합니다.'
  };
}

/**
 * FIB-4 Index 해석 (질환별 Cut-off 적용)
 *
 * @param {number} score - FIB-4 점수
 * @param {number} age - 나이
 * @param {string} diseaseId - 질환 ID (HCV, HBV, NAFLD)
 */
export function interpretFIB4(score, age, diseaseId = 'HCV') {
  if (score === null || score === undefined || !age) return null;

  const disease = DISEASES[diseaseId] || DISEASES.HCV;
  const isElderly = age >= 65;

  // 질환별 Cut-off 결정
  let lowCutoff = disease.fib4Cutoffs.low;
  const highCutoff = disease.fib4Cutoffs.high;

  // NAFLD 65세 이상 보정
  if (disease.fib4ElderlyAdjustment && isElderly && disease.fib4Cutoffs.elderlyLow) {
    lowCutoff = disease.fib4Cutoffs.elderlyLow;
  }

  const ageNote = disease.fib4ElderlyAdjustment && isElderly
    ? '(65세 이상 보정 적용)'
    : '';

  const cutoffInfo = {
    low: lowCutoff,
    high: highCutoff,
    isElderly,
    diseaseId,
    diseaseName: disease.name
  };

  if (score < lowCutoff) {
    return {
      level: 'low',
      color: 'green',
      colorClass: COLOR_STYLES.green.result,
      gaugeColor: COLOR_STYLES.green.gauge,
      stage: 'F0-F1',
      text: '진행성 섬유화 가능성 낮음',
      detail: `NPV ~90% ${ageNote}`,
      recommendation: '정기적인 추적 관찰을 권장합니다.',
      cutoffs: cutoffInfo
    };
  }

  if (score <= highCutoff) {
    return {
      level: 'indeterminate',
      color: 'yellow',
      colorClass: COLOR_STYLES.yellow.result,
      gaugeColor: COLOR_STYLES.yellow.gauge,
      stage: '불확정',
      text: '추가 검사 권고',
      detail: `Fibroscan, 간생검 등 고려 ${ageNote}`,
      recommendation: 'Fibroscan 또는 다른 비침습적 검사를 권장합니다.',
      cutoffs: cutoffInfo
    };
  }

  return {
    level: 'high',
    color: 'red',
    colorClass: COLOR_STYLES.red.result,
    gaugeColor: COLOR_STYLES.red.gauge,
    stage: 'F3-F4',
    text: '진행성 섬유화/간경변 의심',
    detail: `PPV ~65% ${ageNote}`,
    recommendation: '전문의 상담 및 추가 정밀검사가 필요합니다.',
    cutoffs: cutoffInfo
  };
}

/**
 * APRI Cut-off 배열 (게이지 바용)
 */
export function getAPRICutoffs() {
  return [
    { value: 0, label: '0' },
    { value: 0.5, label: '0.5' },
    { value: 1.0, label: '1.0' },
    { value: 1.5, label: '1.5' },
    { value: 2.0, label: '2.0' }
  ];
}

/**
 * FIB-4 Cut-off 배열 (게이지 바용, 질환별)
 */
export function getFIB4Cutoffs(diseaseId, age) {
  const disease = DISEASES[diseaseId] || DISEASES.HCV;
  const isElderly = age >= 65;

  let lowCutoff = disease.fib4Cutoffs.low;
  if (disease.fib4ElderlyAdjustment && isElderly && disease.fib4Cutoffs.elderlyLow) {
    lowCutoff = disease.fib4Cutoffs.elderlyLow;
  }
  const highCutoff = disease.fib4Cutoffs.high;

  // 게이지 최대값 결정 (HCV는 4.0, 나머지는 3.5)
  const maxValue = diseaseId === 'HCV' ? 4.0 : 3.5;

  return [
    { value: 0, label: '0' },
    { value: lowCutoff, label: lowCutoff.toString() },
    { value: highCutoff, label: highCutoff.toString() },
    { value: maxValue, label: maxValue.toString() }
  ];
}

/**
 * APRI 해석 테이블 데이터
 */
export function getAPRITableData() {
  return [
    { range: '< 0.5', stage: 'F0-F1', meaning: '유의한 섬유화 가능성 낮음', color: 'green' },
    { range: '0.5 - 1.5', stage: '불확정', meaning: '추가 검사 권고', color: 'yellow' },
    { range: '≥ 1.5', stage: 'F2-F4', meaning: '유의한 섬유화 의심', color: 'orange' },
    { range: '≥ 2.0', stage: 'F4', meaning: '간경변 가능성', color: 'red' }
  ];
}

/**
 * FIB-4 질환별 Cut-off 테이블 데이터
 */
export function getFIB4CutoffTableData() {
  return [
    { disease: 'HCV', low: '< 1.45', high: '> 3.25', reference: 'Sterling 2006' },
    { disease: 'HBV', low: '< 1.30', high: '> 2.67', reference: '표준 적용' },
    { disease: 'NAFLD (< 65세)', low: '< 1.30', high: '> 2.67', reference: 'Shah 2009' },
    { disease: 'NAFLD (≥ 65세)', low: '< 2.00', high: '> 2.67', reference: 'McPherson 2017' }
  ];
}

/**
 * FIB-4 해석 테이블 데이터 (질환별)
 */
export function getFIB4TableData(diseaseId, isElderly = false) {
  const disease = DISEASES[diseaseId] || DISEASES.HCV;

  let lowCutoff = disease.fib4Cutoffs.low;
  if (disease.fib4ElderlyAdjustment && isElderly && disease.fib4Cutoffs.elderlyLow) {
    lowCutoff = disease.fib4Cutoffs.elderlyLow;
  }
  const highCutoff = disease.fib4Cutoffs.high;

  return [
    { range: `< ${lowCutoff.toFixed(2)}`, stage: 'F0-F1', meaning: '진행된 섬유화 가능성 낮음', color: 'green' },
    { range: `${lowCutoff.toFixed(2)} - ${highCutoff.toFixed(2)}`, stage: '불확정', meaning: '추가 검사 권고', color: 'yellow' },
    { range: `> ${highCutoff.toFixed(2)}`, stage: 'F3-F4', meaning: '진행된 섬유화/간경변 시사', color: 'red' }
  ];
}
