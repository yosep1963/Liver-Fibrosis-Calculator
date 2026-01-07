import { FlaskConical, RotateCcw, Calculator, AlertCircle, Info } from 'lucide-react';
import { DISEASES, RELIABILITY_STYLES } from '../utils/interpretations';

/**
 * 질환 선택 컴포넌트
 */
function DiseaseSelector({ selectedDisease, onDiseaseChange, diseaseInfo }) {
  const diseases = Object.values(DISEASES);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        질환 선택
      </label>
      <div className="grid grid-cols-3 gap-2">
        {diseases.map((disease) => (
          <button
            key={disease.id}
            type="button"
            onClick={() => onDiseaseChange(disease.id)}
            className={`px-3 py-2.5 text-sm rounded-lg border-2 transition-all
                       ${selectedDisease === disease.id
                         ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                         : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                       }`}
          >
            {disease.shortName}
          </button>
        ))}
      </div>

      {/* 선택된 질환 정보 */}
      {diseaseInfo && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          diseaseInfo.apriRecommended ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
        }`}>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{diseaseInfo.name}</p>
              <p className="text-xs mt-1 opacity-80">{diseaseInfo.description}</p>
              {diseaseInfo.caution && (
                <p className="text-xs mt-1 opacity-70">{diseaseInfo.caution}</p>
              )}
              <div className="flex gap-4 mt-2 text-xs">
                <span>
                  APRI: <span className={`font-medium ${
                    diseaseInfo.apriReliability === 'high' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {RELIABILITY_STYLES[diseaseInfo.apriReliability].label}
                  </span>
                </span>
                <span>
                  FIB-4: <span className="font-medium text-green-600">
                    {RELIABILITY_STYLES[diseaseInfo.fib4Reliability].label}
                  </span>
                </span>
              </div>
              {/* FIB-4 Cut-off 정보 */}
              <div className="mt-2 text-xs opacity-70">
                FIB-4 Cut-off: &lt;{diseaseInfo.fib4Cutoffs.low} (낮음) / &gt;{diseaseInfo.fib4Cutoffs.high} (높음)
                {diseaseInfo.fib4ElderlyAdjustment && (
                  <span className="block">65세 이상: &lt;{diseaseInfo.fib4Cutoffs.elderlyLow} (낮음)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 검사값 입력 폼 컴포넌트
 */
export function InputForm({
  inputs,
  errors,
  isElderly,
  canCalculate,
  selectedDisease,
  diseaseInfo,
  onInputChange,
  onDiseaseChange,
  onReset,
  onCalculate
}) {
  const inputFields = [
    { id: 'age', label: '나이', unit: '세', placeholder: '55',
      note: isElderly && selectedDisease === 'NAFLD' ? 'NAFLD: 65세 이상 FIB-4 cut-off 보정 적용' : null },
    { id: 'ast', label: 'AST', unit: 'U/L', placeholder: '45' },
    { id: 'alt', label: 'ALT', unit: 'U/L', placeholder: '38' },
    { id: 'platelet', label: '혈소판', unit: '/μL', placeholder: '120000',
      hint: '검사실 수치 그대로 입력 (예: 90,000)' },
    { id: 'astULN', label: 'AST 정상상한치', unit: 'U/L', placeholder: '35',
      defaultNote: '기본값: 35' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <FlaskConical className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold">검사값 입력</h2>
        </div>
      </div>

      {/* 입력 필드 */}
      <div className="p-4 space-y-4">
        {/* 질환 선택 */}
        <DiseaseSelector
          selectedDisease={selectedDisease}
          onDiseaseChange={onDiseaseChange}
          diseaseInfo={diseaseInfo}
        />

        <hr className="border-gray-200" />

        {inputFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              <span className="text-gray-400 font-normal ml-1">({field.unit})</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id={field.id}
                inputMode="decimal"
                value={inputs[field.id]}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 border rounded-xl text-lg
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all ${
                             errors[field.id]
                               ? 'border-red-300 bg-red-50'
                               : 'border-gray-200 bg-white'
                           }`}
              />
              {field.defaultNote && !inputs[field.id] && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {field.defaultNote}
                </span>
              )}
            </div>

            {errors[field.id] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.id]}
              </p>
            )}

            {field.note && (
              <p className="mt-1 text-sm text-primary-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {field.note}
              </p>
            )}

            {field.hint && !errors[field.id] && (
              <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
            )}
          </div>
        ))}

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                       border border-gray-200 rounded-xl text-gray-600 font-medium
                       hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px]"
          >
            <RotateCcw className="w-5 h-5" />
            초기화
          </button>
          <button
            type="button"
            onClick={onCalculate}
            disabled={!canCalculate}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3
                       rounded-xl font-medium transition-colors min-h-[48px]
                       ${canCalculate
                         ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
                         : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       }`}
          >
            <Calculator className="w-5 h-5" />
            계산하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputForm;
