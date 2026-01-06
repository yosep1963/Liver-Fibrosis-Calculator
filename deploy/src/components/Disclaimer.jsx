import { AlertTriangle } from 'lucide-react';

/**
 * 주의사항 컴포넌트
 */
export function Disclaimer() {
  return (
    <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-800 mb-2">주의사항</h3>
          <ul className="text-sm text-amber-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>
                본 계산기는 임상 참고용이며, 진단을 대체하지 않습니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>
                불확정 결과에서는 Fibroscan, 간생검 등 추가 검사를 고려하십시오.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>
                AST/ALT 상승이 다른 원인(근육질환, 심장질환 등)에 의한 경우 해석에 주의가 필요합니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Disclaimer;
