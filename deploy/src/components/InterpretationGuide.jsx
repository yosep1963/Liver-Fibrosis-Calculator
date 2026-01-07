import { BookOpen, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useState } from 'react';
import {
  getAPRITableData,
  getFIB4CutoffTableData,
  getColorBadgeClass,
  DISEASES,
  RELIABILITY_STYLES
} from '../utils/interpretations';

/**
 * 질환별 신뢰도 비교표
 */
function DiseaseReliabilityTable() {
  const diseases = Object.values(DISEASES);

  const renderStars = (reliability) => {
    const style = RELIABILITY_STYLES[reliability];
    const colorClass = reliability === 'high' ? 'fill-green-500 text-green-500'
      : reliability === 'medium' ? 'fill-yellow-500 text-yellow-500'
      : 'fill-red-500 text-red-500';

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(3)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < style.stars ? colorClass : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">질환별 검사 신뢰도</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-600">질환</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">APRI</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">FIB-4</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">권장</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {diseases.map((d) => (
              <tr key={d.id}>
                <td className="px-3 py-2 font-medium">{d.shortName}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-center">{renderStars(d.apriReliability)}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center">{renderStars(d.fib4Reliability)}</div>
                </td>
                <td className="px-3 py-2 text-xs text-gray-600">
                  {d.apriRecommended ? '둘 다 사용' : 'FIB-4 권장'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * FIB-4 질환별 Cut-off 테이블
 */
function FIB4CutoffTable() {
  const data = getFIB4CutoffTableData();

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">FIB-4 질환별 Cut-off</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-600">질환</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">낮음</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">높음</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">근거</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={i}>
                <td className="px-3 py-2 font-medium">{row.disease}</td>
                <td className="px-3 py-2 text-center">
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">{row.low}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs">{row.high}</span>
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">{row.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * APRI 해석 기준표
 */
function APRITable() {
  const data = getAPRITableData();

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">APRI Score 해석 기준</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-600">점수</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">단계</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">의미</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={i}>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getColorBadgeClass(row.color)}`}>
                    {row.range}
                  </span>
                </td>
                <td className="px-3 py-2 font-medium">{row.stage}</td>
                <td className="px-3 py-2 text-gray-600">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * 해석 가이드 컴포넌트
 */
export function InterpretationGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 border-b border-gray-100
                   flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold">해석 가이드</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-2">
          <DiseaseReliabilityTable />
          <FIB4CutoffTable />
          <APRITable />

          {/* 참고사항 */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">참고사항</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
              <li>HCV: Sterling 2006 원저 기준 (1.45 / 3.25)</li>
              <li>HBV/NAFLD: Shah 2009 기준 (1.30 / 2.67)</li>
              <li>NAFLD 65세 이상: McPherson 2017 기준 (2.00 / 2.67)</li>
              <li>NPV (음성예측도): 섬유화가 없을 확률</li>
              <li>PPV (양성예측도): 섬유화가 있을 확률</li>
            </ul>
          </div>

          {/* 참고문헌 */}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            <p className="font-medium mb-1">주요 참고문헌</p>
            <ul className="space-y-0.5">
              <li>Sterling RK, et al. Hepatology 2006 (FIB-4 원저)</li>
              <li>Shah AG, et al. Clin Gastroenterol Hepatol 2009</li>
              <li>McPherson S, et al. Gut 2017</li>
              <li>Wai CT, et al. Hepatology 2003 (APRI 원저)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterpretationGuide;
