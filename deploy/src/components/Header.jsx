import { useState, useEffect } from 'react';
import { Activity, Download, Check } from 'lucide-react';

/**
 * 앱 헤더 컴포넌트
 * - 앱 제목 및 로고
 * - PWA 설치 버튼
 */
export function Header() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 앱 설치 완료 감지
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    // standalone 모드로 실행 중인지 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">간섬유화 계산기</h1>
              <p className="text-primary-100 text-sm">APRI & FIB-4 Calculator</p>
            </div>
          </div>

          {/* PWA 설치 버튼 */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30
                         px-3 py-2 rounded-lg transition-colors text-sm font-medium"
              aria-label="앱 설치"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">설치</span>
            </button>
          )}

          {isInstalled && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg text-sm">
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">설치됨</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
