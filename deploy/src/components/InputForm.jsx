import { FlaskConical, RotateCcw, Calculator, AlertCircle } from 'lucide-react';

/**
 * 검사값 입력 폼 컴포넌트
 */
export function InputForm({
  inputs,
  errors,
  isElderly,
  canCalculate,
  onInputChange,
  onReset,
  onCalculate
}) {
  const inputFields = [
    {
      id: 'age',
      label: '나이',
      unit: '세',
      placeholder: '55',
      note: isElderly ? 'FIB-4: 65세 이상 기준 적용' : null
    },
    {
      id: 'ast',
      label: 'AST',
      unit: 'U/L',
      placeholder: '45'
    },
    {
      id: 'alt',
      label: 'ALT',
      unit: 'U/L',
      placeholder: '38'
    },
    {
      id: 'platelet',
      label: '혈소판',
      unit: '/μL',
      placeholder: '120000',
      hint: '검사실 수치 그대로 입력 (예: 90,000)'
    },
    {
      id: 'astULN',
      label: 'AST 정상상한치',
      unit: 'U/L',
      placeholder: '35',
      defaultNote: '기본값: 35'
    }
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
        {inputFields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
              />
              {field.defaultNote && !inputs[field.id] && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {field.defaultNote}
                </span>
              )}
            </div>

            {/* 에러 메시지 */}
            {errors[field.id] && (
              <p id={`${field.id}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.id]}
              </p>
            )}

            {/* 노트 (나이 필드) */}
            {field.note && (
              <p className="mt-1 text-sm text-primary-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {field.note}
              </p>
            )}

            {/* 힌트 (혈소판 필드) */}
            {field.hint && !errors[field.id] && (
              <p className="mt-1 text-xs text-gray-500">
                {field.hint}
              </p>
            )}
          </div>
        ))}

        {/* 버튼 영역 */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2
                       px-4 py-3 border border-gray-200 rounded-xl
                       text-gray-600 font-medium
                       hover:bg-gray-50 active:bg-gray-100
                       transition-colors min-h-[48px]"
          >
            <RotateCcw className="w-5 h-5" />
            초기화
          </button>
          <button
            type="button"
            onClick={onCalculate}
            disabled={!canCalculate}
            className={`flex-1 flex items-center justify-center gap-2
                       px-4 py-3 rounded-xl font-medium
                       transition-colors min-h-[48px]
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
