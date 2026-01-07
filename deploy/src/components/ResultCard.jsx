import { TrendingUp, AlertTriangle, Info, Star } from 'lucide-react';
import { GaugeBar } from './GaugeBar';
import {
  getAPRICutoffs,
  getFIB4Cutoffs,
  getAPRITableData,
  getFIB4TableData,
  getColorBadgeClass,
  RELIABILITY_STYLES
} from '../utils/interpretations';

/**
 * 신뢰도 별점 표시
 */
function ReliabilityBadge({ reliability }) {
  const style = RELIABILITY_STYLES[reliability];
  if (!style) return null;

  return (
    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${style.colorClass}`}>
      <span className="font-medium">{style.label}</span>
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < style.stars ? 'fill-current' : 'opacity-30'}`} />
        ))}
      </div>
    </div>
  );
}

/**
 * 해석 기준표 컴포넌트
 */
function InterpretationTable({ title, data, currentScore, highlightRange }) {
  const isInRange = (row, score) => {
    if (!highlightRange || score === null) return false;
    return score >= highlightRange.min && score < highlightRange.max && row.range === highlightRange.range;
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">값</th>
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">단계</th>
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">해석</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={index} className={isInRange(row, currentScore) ? `${getColorBadgeClass(row.color)} font-semibold` : ''}>
                <td className="px-2 py-1.5">
                  <span className={`px-2 py-0.5 rounded text-xs ${getColorBadgeClass(row.color)}`}>
                    {row.range}
                  </span>
                </td>
                <td className="px-2 py-1.5">{row.stage}</td>
                <td className="px-2 py-1.5 text-gray-600">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * 결과 카드 컴포넌트
 */
export function ResultCard({ type, score, interpretation, age, diseaseInfo, selectedDisease }) {
  if (score === null || !interpretation) return null;

  const isAPRI = type === 'APRI';
  const title = isAPRI ? 'APRI Score' : 'FIB-4 Index';
  const reliability = isAPRI ? diseaseInfo?.apriReliability : diseaseInfo?.fib4Reliability;
  const auroc = isAPRI ? diseaseInfo?.apriAUROC : diseaseInfo?.fib4AUROC;

  // Cut-off 및 테이블 데이터
  const cutoffs = isAPRI
    ? getAPRICutoffs()
    : getFIB4Cutoffs(selectedDisease, age);

  const tableData = isAPRI
    ? getAPRITableData()
    : getFIB4TableData(selectedDisease, age >= 65);

  // FIB-4 서브타이틀 (질환별 cut-off 정보)
  const subtitle = !isAPRI && interpretation.cutoffs
    ? `${diseaseInfo?.name} (< ${interpretation.cutoffs.low} / > ${interpretation.cutoffs.high})`
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
          {reliability && <ReliabilityBadge reliability={reliability} />}
        </div>
        {subtitle && (
          <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
        )}
        {auroc && diseaseInfo && (
          <div className="text-xs text-gray-400">AUROC: {auroc}</div>
        )}
      </div>

      {/* 점수 및 게이지 */}
      <div className="p-4">
        <div className="text-center mb-4">
          <div className={`inline-block px-6 py-3 rounded-2xl ${interpretation.colorClass}`}>
            <span className="text-4xl font-bold">{score.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-4">
          <GaugeBar score={score} cutoffs={cutoffs} interpretation={interpretation} />
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
              <div className="text-sm opacity-80">{interpretation.detail}</div>
              {interpretation.recommendation && (
                <div className="text-sm mt-2 pt-2 border-t border-current/20">
                  {interpretation.recommendation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 해석 기준표 */}
        <InterpretationTable
          title={`${title} 해석 기준${!isAPRI ? ` (${diseaseInfo?.shortName})` : ''}`}
          data={tableData}
          currentScore={score}
        />
      </div>
    </div>
  );
}

export default ResultCard;
