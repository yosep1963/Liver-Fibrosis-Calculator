import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { getAPRITableData, getFIB4TableData } from '../utils/interpretations';

/**
 * 해석 가이드 테이블 컴포넌트
 */
export function InterpretationGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const apriData = getAPRITableData();
  const fib4Data = getFIB4TableData();

  const getColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 (토글 버튼) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 border-b border-gray-100
                   flex items-center justify-between
                   hover:bg-gray-100 transition-colors"
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

      {/* 내용 (접을 수 있음) */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* APRI 테이블 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              APRI Score 해석 기준
            </h3>
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
                  {apriData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getColorClass(row.color)}`}>
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

          {/* FIB-4 테이블 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              FIB-4 Index 해석 기준 (연령별)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600">연령</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">점수</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">의미</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fib4Data.map((row, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 font-medium">{row.ageGroup}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getColorClass(row.color)}`}>
                          {row.range}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 추가 설명 */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">참고사항</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>65세 이상에서는 FIB-4의 하한 cut-off가 2.0으로 상향 조정됩니다.</li>
              <li>NPV (음성예측도): 섬유화가 없을 확률</li>
              <li>PPV (양성예측도): 섬유화가 있을 확률</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterpretationGuide;
