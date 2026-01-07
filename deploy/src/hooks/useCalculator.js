import { useState, useCallback, useMemo } from 'react';
import { calculateAPRI, calculateFIB4, validateInput } from '../utils/calculations';
import { interpretAPRI, interpretFIB4, DISEASES } from '../utils/interpretations';

/**
 * 간섬유화 계산기 상태 관리 커스텀 훅
 */
export function useCalculator() {
  // 질환 선택 상태 (기본값: HCV)
  const [selectedDisease, setSelectedDisease] = useState('HCV');

  // 입력값 상태
  const [inputs, setInputs] = useState({
    age: '',
    ast: '',
    alt: '',
    platelet: '',
    astULN: '35'
  });

  // 입력값 유효성 오류 상태
  const [errors, setErrors] = useState({
    age: null,
    ast: null,
    alt: null,
    platelet: null,
    astULN: null
  });

  // 계산 완료 여부
  const [hasCalculated, setHasCalculated] = useState(false);

  /**
   * 개별 입력값 변경 핸들러
   */
  const handleInputChange = useCallback((field, value) => {
    let cleanValue;

    if (field === 'platelet') {
      // 혈소판: 숫자와 쉼표만 허용
      const sanitizedValue = value.replace(/[^0-9,]/g, '');
      const numericValue = sanitizedValue.replace(/,/g, '');
      cleanValue = sanitizedValue;

      const validation = validateInput(field, numericValue);
      setErrors(prev => ({
        ...prev,
        [field]: validation.valid ? null : validation.message
      }));
    } else {
      // 다른 필드: 숫자와 소수점만 허용
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      const parts = sanitizedValue.split('.');
      cleanValue = parts.length > 2
        ? parts[0] + '.' + parts.slice(1).join('')
        : sanitizedValue;

      const validation = validateInput(field, cleanValue);
      setErrors(prev => ({
        ...prev,
        [field]: validation.valid ? null : validation.message
      }));
    }

    setInputs(prev => ({ ...prev, [field]: cleanValue }));
    setHasCalculated(false);
  }, []);

  /**
   * 질환 선택 핸들러
   */
  const handleDiseaseChange = useCallback((disease) => {
    setSelectedDisease(disease);
    setHasCalculated(false);
  }, []);

  /**
   * 모든 입력값 초기화
   */
  const resetInputs = useCallback(() => {
    setInputs({ age: '', ast: '', alt: '', platelet: '', astULN: '35' });
    setErrors({ age: null, ast: null, alt: null, platelet: null, astULN: null });
    setHasCalculated(false);
  }, []);

  /**
   * 계산 가능 여부 확인
   */
  const canCalculate = useMemo(() => {
    const { age, ast, alt, platelet, astULN } = inputs;
    const plateletValue = platelet ? platelet.replace(/,/g, '') : '';
    const hasAllValues = age && ast && alt && plateletValue && astULN;
    const hasNoErrors = Object.values(errors).every(e => e === null);
    return hasAllValues && hasNoErrors;
  }, [inputs, errors]);

  /**
   * 계산 실행
   */
  const calculate = useCallback(() => {
    if (!canCalculate) return;
    setHasCalculated(true);
  }, [canCalculate]);

  /**
   * 현재 선택된 질환 정보
   */
  const diseaseInfo = useMemo(() => {
    return DISEASES[selectedDisease] || DISEASES.HCV;
  }, [selectedDisease]);

  /**
   * 65세 이상 여부
   */
  const isElderly = useMemo(() => {
    const age = parseFloat(inputs.age);
    return !isNaN(age) && age >= 65;
  }, [inputs.age]);

  /**
   * 계산 결과
   */
  const results = useMemo(() => {
    if (!hasCalculated) {
      return {
        apri: null,
        fib4: null,
        apriInterpretation: null,
        fib4Interpretation: null,
        showAPRI: true
      };
    }

    const age = parseFloat(inputs.age);
    const ast = parseFloat(inputs.ast);
    const alt = parseFloat(inputs.alt);
    const plateletRaw = parseFloat(inputs.platelet.replace(/,/g, ''));
    const platelet = plateletRaw / 1000; // /μL → ×10⁹/L 변환
    const astULN = parseFloat(inputs.astULN);

    const apri = calculateAPRI(ast, astULN, platelet);
    const fib4 = calculateFIB4(age, ast, alt, platelet);

    return {
      apri,
      fib4,
      apriInterpretation: interpretAPRI(apri),
      // 질환별 FIB-4 해석 적용
      fib4Interpretation: interpretFIB4(fib4, age, selectedDisease),
      showAPRI: diseaseInfo.apriRecommended
    };
  }, [hasCalculated, inputs, selectedDisease, diseaseInfo]);

  return {
    inputs,
    errors,
    hasCalculated,
    canCalculate,
    isElderly,
    results,
    selectedDisease,
    diseaseInfo,
    handleInputChange,
    handleDiseaseChange,
    resetInputs,
    calculate
  };
}

export default useCalculator;
