import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { GaugeBar } from './GaugeBar';
import { getAPRICutoffs, getFIB4Cutoffs } from '../utils/interpretations';

/**
 * APRI 해석 기준표 컴포넌트
 */
function APRITable({ currentScore }) {
  const rows = [
    { range: '< 0.5', stage: 'F0-F1', interpretation: '유의한 섬유화 가능성 낮음 (NPV ~90%)', color: 'bg-green-100', min: 0, max: 0.5 },
    { range: '0.5 - 1.5', stage: '불확정', interpretation: '추가 검사 권고 (Fibroscan, 생검 등)', color: 'bg-yellow-100', min: 0.5, max: 1.5 },
    { range: '≥ 1.5', stage: 'F2-F4', interpretation: '유의한 섬유화 시사 (PPV ~65%)', color: 'bg-orange-100', min: 1.5, max: 2.0 },
    { range: '≥ 2.0', stage: 'F4', interpretation: '간경변 가능성 높음', color: 'bg-red-100', min: 2.0, max: Infinity },
  ];

  const isCurrentRow = (row) => {
    if (currentScore === null) return false;
    return currentScore >= row.min && currentScore < row.max;
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">APRI Score 해석 기준</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">APRI 값</th>
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">섬유화 단계</th>
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">임상적 해석</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr
                key={index}
                className={isCurrentRow(row) ? `${row.color} font-semibold` : ''}
              >
                <td className="px-2 py-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${row.color.replace('100', '500')}`}></span>
                  {row.range}
                </td>
                <td className="px-2 py-1.5">{row.stage}</td>
                <td className="px-2 py-1.5 text-gray-600">{row.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * FIB-4 해석 기준표 컴포넌트
 */
function FIB4Table({ currentScore, age }) {
  const isElderly = age >= 65;

  const rowsUnder65 = [
    { range: '< 1.30', stage: 'F0-F1', interpretation: '진행된 섬유화 가능성 낮음 (NPV ~90%)', color: 'bg-green-100', min: 0, max: 1.30 },
    { range: '1.30 - 2.67', stage: '불확정', interpretation: '추가 검사 권고', color: 'bg-yellow-100', min: 1.30, max: 2.67 },
    { range: '> 2.67', stage: 'F3-F4', interpretation: '진행된 섬유화/간경변 시사 (PPV ~65%)', color: 'bg-red-100', min: 2.67, max: Infinity },
  ];

  const rowsOver65 = [
    { range: '< 2.00', stage: 'F0-F1', interpretation: '진행된 섬유화 가능성 낮음', color: 'bg-green-100', min: 0, max: 2.00 },
    { range: '2.00 - 2.67', stage: '불확정', interpretation: '추가 검사 권고', color: 'bg-yellow-100', min: 2.00, max: 2.67 },
    { range: '> 2.67', stage: 'F3-F4', interpretation: '진행된 섬유화/간경변 시사', color: 'bg-red-100', min: 2.67, max: Infinity },
  ];

  const isCurrentRow = (row) => {
    if (currentScore === null) return false;
    return currentScore >= row.min && currentScore < row.max;
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">FIB-4 Score 해석 기준</h4>

      {/* 65세 미만 테이블 */}
      <div className={`mb-3 ${!isElderly ? 'ring-2 ring-primary-300 rounded-lg' : 'opacity-60'}`}>
        <div className={`text-xs font-medium px-2 py-1 rounded-t-lg ${!isElderly ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}>
          65세 미만 {!isElderly && '← 현재 적용'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">FIB-4 값</th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">섬유화 단계</th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">해석</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rowsUnder65.map((row, index) => (
                <tr
                  key={index}
                  className={!isElderly && isCurrentRow(row) ? `${row.color} font-semibold` : ''}
                >
                  <td className="px-2 py-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${row.color.replace('100', '500')}`}></span>
                    {row.range}
                  </td>
                  <td className="px-2 py-1.5">{row.stage}</td>
                  <td className="px-2 py-1.5 text-gray-600">{row.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 65세 이상 테이블 */}
      <div className={`${isElderly ? 'ring-2 ring-primary-300 rounded-lg' : 'opacity-60'}`}>
        <div className={`text-xs font-medium px-2 py-1 rounded-t-lg ${isElderly ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}>
          65세 이상 (연령 보정) {isElderly && '← 현재 적용'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">FIB-4 값</th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">섬유화 단계</th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">해석</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rowsOver65.map((row, index) => (
                <tr
                  key={index}
                  className={isElderly && isCurrentRow(row) ? `${row.color} font-semibold` : ''}
                >
                  <td className="px-2 py-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${row.color.replace('100', '500')}`}></span>
                    {row.range}
                  </td>
                  <td className="px-2 py-1.5">{row.stage}</td>
                  <td className="px-2 py-1.5 text-gray-600">{row.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * 결과 표시 카드 컴포넌트
 */
export function ResultCard({ type, score, interpretation, age }) {
  if (score === null || !interpretation) {
    return null;
  }

  const isAPRI = type === 'APRI';
  const title = isAPRI ? 'APRI Score' : 'FIB-4 Index';
  const cutoffs = isAPRI ? getAPRICutoffs() : getFIB4Cutoffs(age);
  const subtitle = !isAPRI && interpretation.ageAdjusted
    ? '(≥65세 기준 적용)'
    : !isAPRI
      ? '(<65세 기준 적용)'
      : null;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${interpretation.colorClass.split(' ')[2]}`}>
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-700">{title}</h3>
          </div>
          {subtitle && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* 점수 표시 */}
      <div className="p-4">
        <div className="text-center mb-4">
          <div className={`inline-block px-6 py-3 rounded-2xl ${interpretation.colorClass}`}>
            <span className="text-4xl font-bold">{score.toFixed(2)}</span>
          </div>
        </div>

        {/* 게이지 바 */}
        <div className="mb-4">
          <GaugeBar
            score={score}
            cutoffs={cutoffs}
            interpretation={interpretation}
          />
        </div>

        {/* 해석 결과 */}
        <div className={`p-4 rounded-xl ${interpretation.colorClass}`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {interpretation.level === 'low' ? (
                <Info className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="font-semibold mb-1">
                {interpretation.stage} - {interpretation.text}
              </div>
              <div className="text-sm opacity-80">
                {interpretation.detail}
              </div>
              {interpretation.recommendation && (
                <div className="text-sm mt-2 pt-2 border-t border-current/20">
                  {interpretation.recommendation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 해석 기준표 */}
        {isAPRI ? (
          <APRITable currentScore={score} />
        ) : (
          <FIB4Table currentScore={score} age={age} />
        )}
      </div>
    </div>
  );
}

export default ResultCard;
