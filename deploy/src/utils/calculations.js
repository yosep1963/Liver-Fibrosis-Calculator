/**
 * APRI Score 계산
 * APRI = (AST / ULN_AST) / Platelet(10^9/L) × 100
 *
 * @param {number} ast - AST 값 (U/L)
 * @param {number} astULN - AST 정상상한치 (기본값: 35)
 * @param {number} platelet - 혈소판 수 (×10⁹/L)
 * @returns {number|null} APRI score (소수점 2자리) 또는 null
 */
export function calculateAPRI(ast, astULN = 35, platelet) {
  // 입력값 유효성 검사
  if (!isValidNumber(ast) || !isValidNumber(astULN) || !isValidNumber(platelet)) {
    return null;
  }

  if (astULN <= 0 || platelet <= 0) {
    return null;
  }

  const apri = ((ast / astULN) / platelet) * 100;
  return Math.round(apri * 100) / 100;
}

/**
 * FIB-4 Index 계산
 * FIB-4 = Age(years) × AST(IU/L) / (Platelet(10^9/L) × √ALT(IU/L))
 *
 * @param {number} age - 나이 (세)
 * @param {number} ast - AST 값 (U/L)
 * @param {number} alt - ALT 값 (U/L)
 * @param {number} platelet - 혈소판 수 (×10⁹/L)
 * @returns {number|null} FIB-4 index (소수점 2자리) 또는 null
 */
export function calculateFIB4(age, ast, alt, platelet) {
  // 입력값 유효성 검사
  if (!isValidNumber(age) || !isValidNumber(ast) || !isValidNumber(alt) || !isValidNumber(platelet)) {
    return null;
  }

  if (age <= 0 || platelet <= 0 || alt <= 0) {
    return null;
  }

  const fib4 = (age * ast) / (platelet * Math.sqrt(alt));
  return Math.round(fib4 * 100) / 100;
}

/**
 * 숫자 유효성 검사
 * @param {any} value - 검사할 값
 * @returns {boolean} 유효한 숫자 여부
 */
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * 입력값 범위 검증
 * @param {string} field - 필드 이름
 * @param {number} value - 검사할 값
 * @returns {{valid: boolean, message: string|null}} 유효성 검사 결과
 */
export function validateInput(field, value) {
  if (value === '' || value === null || value === undefined) {
    return { valid: true, message: null }; // 빈 값은 허용 (계산 시 처리)
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { valid: false, message: '유효한 숫자를 입력해주세요.' };
  }

  const ranges = {
    age: { min: 1, max: 120, unit: '세' },
    ast: { min: 1, max: 10000, unit: 'U/L' },
    alt: { min: 1, max: 10000, unit: 'U/L' },
    platelet: { min: 1000, max: 1500000, unit: '/μL' },
    astULN: { min: 1, max: 100, unit: 'U/L' }
  };

  const range = ranges[field];
  if (!range) {
    return { valid: true, message: null };
  }

  if (numValue < range.min) {
    return { valid: false, message: `${range.min} ${range.unit} 이상이어야 합니다.` };
  }

  if (numValue > range.max) {
    return { valid: false, message: `${range.max} ${range.unit} 이하여야 합니다.` };
  }

  return { valid: true, message: null };
}
