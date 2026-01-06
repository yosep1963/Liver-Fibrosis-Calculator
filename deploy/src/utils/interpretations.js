/**
 * APRI Score 해석
 *
 * Cut-off 기준:
 * < 0.5: F0-F1 (유의한 섬유화 가능성 낮음, NPV ~90%)
 * 0.5-1.5: 불확정 (추가 검사 권고)
 * ≥ 1.5: F2-F4 (유의한 섬유화 의심, PPV ~65%)
 * ≥ 2.0: F4 (간경변 가능성)
 *
 * @param {number|null} score - APRI score
 * @returns {object|null} 해석 결과
 */
export function interpretAPRI(score) {
  if (score === null || score === undefined) {
    return null;
  }

  if (score < 0.5) {
    return {
      level: 'low',
      color: 'green',
      colorClass: 'text-green-600 bg-green-50 border-green-200',
      gaugeColor: '#22c55e',
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
      colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      gaugeColor: '#eab308',
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
      colorClass: 'text-orange-600 bg-orange-50 border-orange-200',
      gaugeColor: '#f97316',
      stage: 'F2-F4',
      text: '유의한 섬유화 의심',
      detail: 'PPV approximately 65%',
      recommendation: '전문의 상담 및 추가 정밀검사를 권장합니다.'
    };
  }

  return {
    level: 'very-high',
    color: 'red',
    colorClass: 'text-red-600 bg-red-50 border-red-200',
    gaugeColor: '#ef4444',
    stage: 'F4',
    text: '간경변 가능성 높음',
    detail: 'PPV approximately 65%',
    recommendation: '즉시 전문의 상담이 필요합니다.'
  };
}

/**
 * FIB-4 Index 해석 (연령별 기준 자동 적용)
 *
 * Cut-off 기준:
 * < 65세: < 1.30 (낮음), 1.30-2.67 (불확정), > 2.67 (높음)
 * ≥ 65세: < 2.00 (낮음), 2.00-2.67 (불확정), > 2.67 (높음)
 *
 * @param {number|null} score - FIB-4 index
 * @param {number} age - 나이 (세)
 * @returns {object|null} 해석 결과
 */
export function interpretFIB4(score, age) {
  if (score === null || score === undefined || !age) {
    return null;
  }

  const isElderly = age >= 65;
  const lowCutoff = isElderly ? 2.0 : 1.3;
  const highCutoff = 2.67;
  const ageNote = isElderly ? '(≥65세 기준 적용)' : '(<65세 기준 적용)';

  if (score < lowCutoff) {
    return {
      level: 'low',
      color: 'green',
      colorClass: 'text-green-600 bg-green-50 border-green-200',
      gaugeColor: '#22c55e',
      stage: 'F0-F1',
      text: '진행성 섬유화 가능성 낮음',
      detail: `NPV approximately 90% ${ageNote}`,
      recommendation: '정기적인 추적 관찰을 권장합니다.',
      ageAdjusted: isElderly,
      cutoffs: { low: lowCutoff, high: highCutoff }
    };
  }

  if (score <= highCutoff) {
    return {
      level: 'indeterminate',
      color: 'yellow',
      colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      gaugeColor: '#eab308',
      stage: '불확정',
      text: '추가 검사 권고',
      detail: `Fibroscan, 간생검 등 고려 ${ageNote}`,
      recommendation: 'Fibroscan 또는 다른 비침습적 검사를 권장합니다.',
      ageAdjusted: isElderly,
      cutoffs: { low: lowCutoff, high: highCutoff }
    };
  }

  return {
    level: 'high',
    color: 'red',
    colorClass: 'text-red-600 bg-red-50 border-red-200',
    gaugeColor: '#ef4444',
    stage: 'F3-F4',
    text: '진행성 섬유화/간경변 의심',
    detail: `PPV approximately 65% ${ageNote}`,
    recommendation: '전문의 상담 및 추가 정밀검사가 필요합니다.',
    ageAdjusted: isElderly,
    cutoffs: { low: lowCutoff, high: highCutoff }
  };
}

/**
 * APRI Cut-off 값 목록 반환
 * @returns {Array} APRI cut-off 배열
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
 * FIB-4 Cut-off 값 목록 반환 (연령별)
 * @param {number} age - 나이
 * @returns {Array} FIB-4 cut-off 배열
 */
export function getFIB4Cutoffs(age) {
  const isElderly = age >= 65;
  const lowCutoff = isElderly ? 2.0 : 1.3;

  return [
    { value: 0, label: '0' },
    { value: lowCutoff, label: lowCutoff.toString() },
    { value: 2.67, label: '2.67' },
    { value: 4.0, label: '4.0' }
  ];
}

/**
 * APRI 해석 테이블 데이터
 * @returns {Array} 테이블 행 데이터
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
 * FIB-4 해석 테이블 데이터
 * @returns {Array} 테이블 행 데이터
 */
export function getFIB4TableData() {
  return [
    { ageGroup: '< 65세', range: '< 1.30', meaning: '섬유화 가능성 낮음', color: 'green' },
    { ageGroup: '< 65세', range: '1.30 - 2.67', meaning: '불확정', color: 'yellow' },
    { ageGroup: '< 65세', range: '> 2.67', meaning: '진행성 섬유화 의심', color: 'red' },
    { ageGroup: '≥ 65세', range: '< 2.00', meaning: '섬유화 가능성 낮음', color: 'green' },
    { ageGroup: '≥ 65세', range: '2.00 - 2.67', meaning: '불확정', color: 'yellow' },
    { ageGroup: '≥ 65세', range: '> 2.67', meaning: '진행성 섬유화 의심', color: 'red' }
  ];
}
