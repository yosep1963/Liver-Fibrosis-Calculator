# 간섬유화 계산기 (Liver Fibrosis Calculator)

APRI와 FIB-4 지수를 자동으로 계산하여 비침습적 간섬유화 평가를 지원하는 PWA 웹 애플리케이션입니다.

## 기능

- **APRI (AST to Platelet Ratio Index) 계산**
  - 공식: `APRI = (AST / AST_ULN) / Platelet × 100`
  - AST 정상상한치 사용자 조정 가능 (기본값: 35 U/L)

- **FIB-4 Index 계산**
  - 공식: `FIB-4 = Age × AST / (Platelet × √ALT)`
  - 65세 이상 환자에 대한 연령별 Cut-off 자동 적용

- **결과 시각화**
  - 색상 코딩된 게이지 바
  - 단계별 해석 및 권고사항 표시

- **PWA 지원**
  - 홈 화면에 앱 추가 가능
  - 오프라인 동작 지원
  - 모바일 최적화 UI

## Cut-off 기준

### APRI Score
| 점수 | 단계 | 의미 |
|------|------|------|
| < 0.5 | F0-F1 | 유의한 섬유화 가능성 낮음 (NPV ~90%) |
| 0.5-1.5 | 불확정 | 추가 검사 권고 |
| ≥ 1.5 | F2-F4 | 유의한 섬유화 의심 (PPV ~65%) |
| ≥ 2.0 | F4 | 간경변 가능성 높음 |

### FIB-4 Index (연령별)
| 연령 | 점수 | 의미 |
|------|------|------|
| < 65세 | < 1.30 | 섬유화 가능성 낮음 |
| < 65세 | 1.30-2.67 | 불확정 |
| < 65세 | > 2.67 | 진행성 섬유화 의심 |
| ≥ 65세 | < 2.00 | 섬유화 가능성 낮음 |
| ≥ 65세 | 2.00-2.67 | 불확정 |
| ≥ 65세 | > 2.67 | 진행성 섬유화 의심 |

## 기술 스택

- **프레임워크**: React 18
- **빌드 도구**: Vite 6
- **스타일링**: Tailwind CSS 3
- **PWA**: vite-plugin-pwa
- **아이콘**: Lucide React
- **배포**: Netlify

## 설치 및 실행

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

### PWA 아이콘 생성 (선택사항)

```bash
# sharp 라이브러리가 설치된 경우
npm run generate-icons
```

또는 온라인 도구 사용:
- [RealFaviconGenerator](https://realfavicongenerator.net/) - favicon.svg 업로드
- [Favicon.io](https://favicon.io/)

## Netlify 배포

### 방법 1: Git 연동
1. GitHub 저장소에 코드 push
2. Netlify에서 "Add new site" → "Import an existing project" 선택
3. GitHub 저장소 연결
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy 클릭

### 방법 2: 수동 배포
1. `npm run build` 실행
2. Netlify에서 "Add new site" → "Deploy manually" 선택
3. `dist` 폴더 드래그 앤 드롭

## 프로젝트 구조

```
deploy/
├── public/
│   ├── icons/              # PWA 아이콘
│   ├── favicon.svg         # 벡터 파비콘
│   └── apple-touch-icon.png
├── src/
│   ├── components/
│   │   ├── Header.jsx      # 앱 헤더 (PWA 설치 버튼)
│   │   ├── InputForm.jsx   # 검사값 입력 폼
│   │   ├── ResultCard.jsx  # 결과 표시 카드
│   │   ├── GaugeBar.jsx    # 시각적 게이지 바
│   │   ├── InterpretationGuide.jsx  # 해석 가이드
│   │   ├── Disclaimer.jsx  # 주의사항
│   │   └── Footer.jsx      # 푸터 (참고문헌)
│   ├── utils/
│   │   ├── calculations.js # 계산 함수
│   │   └── interpretations.js  # 해석 로직
│   ├── hooks/
│   │   └── useCalculator.js    # 상태 관리 훅
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── generate-icons.js   # 아이콘 생성 스크립트
├── index.html
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
└── package.json
```

## 주의사항

- 본 계산기는 **임상 참고용**이며, 진단을 대체하지 않습니다.
- 불확정 결과에서는 Fibroscan, 간생검 등 추가 검사를 고려하십시오.
- AST/ALT 상승이 다른 원인(근육질환, 심장질환 등)에 의한 경우 해석에 주의가 필요합니다.

## 참고문헌

1. Wai CT, et al. A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C. *Hepatology* 2003;38:518-526.

2. Sterling RK, et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. *Hepatology* 2006;43:1317-1325.

3. McPherson S, et al. Age as a confounding factor for the accurate non-invasive diagnosis of advanced NAFLD fibrosis. *Gut* 2017;66:1265-1273.

## 라이선스

MIT License

## 버전

v1.0.0
