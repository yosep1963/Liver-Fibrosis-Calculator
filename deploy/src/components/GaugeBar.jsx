/**
 * 시각적 게이지 바 컴포넌트
 * APRI 및 FIB-4 점수를 색상 코딩된 막대로 표시
 */
export function GaugeBar({ score, cutoffs, interpretation }) {
  if (score === null || !cutoffs || cutoffs.length < 2) {
    return null;
  }

  // 게이지 최대값 계산 (마지막 cutoff 값 사용)
  const maxValue = cutoffs[cutoffs.length - 1].value;
  const clampedScore = Math.min(score, maxValue);
  const percentage = (clampedScore / maxValue) * 100;

  // 구간별 색상 정의
  const getZoneColors = () => {
    // APRI: 4개 구간 (0-0.5-1.0-1.5-2.0)
    if (cutoffs.length === 5) {
      return [
        { start: 0, end: 25, color: 'bg-green-400' },      // 0 - 0.5
        { start: 25, end: 50, color: 'bg-yellow-400' },    // 0.5 - 1.0
        { start: 50, end: 75, color: 'bg-orange-400' },    // 1.0 - 1.5
        { start: 75, end: 100, color: 'bg-red-400' }       // 1.5 - 2.0
      ];
    }
    // FIB-4: 3개 구간
    return [
      { start: 0, end: (cutoffs[1].value / maxValue) * 100, color: 'bg-green-400' },
      { start: (cutoffs[1].value / maxValue) * 100, end: (cutoffs[2].value / maxValue) * 100, color: 'bg-yellow-400' },
      { start: (cutoffs[2].value / maxValue) * 100, end: 100, color: 'bg-red-400' }
    ];
  };

  const zones = getZoneColors();

  return (
    <div className="w-full">
      {/* 게이지 바 */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        {/* 구간별 배경 */}
        <div className="absolute inset-0 flex">
          {zones.map((zone, index) => (
            <div
              key={index}
              className={`h-full ${zone.color} opacity-30`}
              style={{ width: `${zone.end - zone.start}%` }}
            />
          ))}
        </div>

        {/* 점수 표시기 */}
        <div
          className="absolute top-0 h-full w-1 bg-gray-800 shadow-lg transition-all duration-500"
          style={{ left: `${Math.min(percentage, 99)}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full shadow" />
        </div>
      </div>

      {/* 눈금 레이블 */}
      <div className="relative mt-2 h-6">
        {cutoffs.map((cutoff, index) => {
          const position = (cutoff.value / maxValue) * 100;
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 text-xs text-gray-500"
              style={{ left: `${position}%` }}
            >
              <div className="w-px h-2 bg-gray-300 mx-auto mb-1" />
              {cutoff.label}
            </div>
          );
        })}
      </div>

      {/* 구간 레이블 (아이콘) */}
      <div className="relative h-6 mt-1">
        {zones.map((zone, index) => {
          const centerPosition = (zone.start + zone.end) / 2;
          const icons = ['🟢', '🟡', '🟠', '🔴'];
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 text-sm"
              style={{ left: `${centerPosition}%` }}
            >
              {icons[index] || icons[icons.length - 1]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GaugeBar;
