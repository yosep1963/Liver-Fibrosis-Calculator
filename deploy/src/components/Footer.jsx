import { FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

/**
 * 푸터 컴포넌트
 * - 참고문헌
 * - 버전 정보
 */
export function Footer() {
  const [showReferences, setShowReferences] = useState(false);

  const references = [
    {
      authors: 'Wai CT, et al.',
      title: 'A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C.',
      journal: 'Hepatology 2003;38:518-526',
      doi: '10.1053/jhep.2003.50346'
    },
    {
      authors: 'Sterling RK, et al.',
      title: 'Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection.',
      journal: 'Hepatology 2006;43:1317-1325',
      doi: '10.1002/hep.21178'
    },
    {
      authors: 'McPherson S, et al.',
      title: 'Age as a confounding factor for the accurate non-invasive diagnosis of advanced NAFLD fibrosis.',
      journal: 'Gut 2017;66:1265-1273',
      doi: '10.1136/gutjnl-2016-312117'
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 참고문헌 토글 버튼 */}
        <button
          onClick={() => setShowReferences(!showReferences)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600
                     transition-colors mb-4"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">참고문헌</span>
        </button>

        {/* 참고문헌 목록 */}
        {showReferences && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <ol className="space-y-3 text-sm text-gray-600">
              {references.map((ref, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-gray-400">{index + 1}.</span>
                  <div>
                    <span className="font-medium">{ref.authors}</span>{' '}
                    {ref.title}{' '}
                    <span className="text-gray-500">{ref.journal}</span>
                    {ref.doi && (
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600
                                   hover:text-primary-700 ml-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* 버전 및 저작권 */}
        <div className="text-center text-sm text-gray-500">
          <p className="mb-1">간섬유화 계산기 v1.0.0</p>
          <p>&copy; 2024 Liver Fibrosis Calculator</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
