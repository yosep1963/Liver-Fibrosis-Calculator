import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { InterpretationGuide } from './components/InterpretationGuide';
import { Disclaimer } from './components/Disclaimer';
import { Footer } from './components/Footer';
import { useCalculator } from './hooks/useCalculator';

/**
 * 간섬유화 계산기 메인 앱
 */
function App() {
  const {
    inputs,
    errors,
    hasCalculated,
    canCalculate,
    isElderly,
    results,
    selectedDisease,
    diseaseInfo,
    handleInputChange,
    handleDiseaseChange,
    resetInputs,
    calculate
  } = useCalculator();

  const age = parseFloat(inputs.age);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        {/* 입력 폼 */}
        <InputForm
          inputs={inputs}
          errors={errors}
          isElderly={isElderly}
          canCalculate={canCalculate}
          selectedDisease={selectedDisease}
          diseaseInfo={diseaseInfo}
          onInputChange={handleInputChange}
          onDiseaseChange={handleDiseaseChange}
          onReset={resetInputs}
          onCalculate={calculate}
        />

        {/* 결과 표시 */}
        {hasCalculated && results.fib4 !== null && (
          <div className="space-y-4 animate-fade-in">
            {/* APRI 결과 - 권장 질환에서만 표시 */}
            {results.showAPRI ? (
              <ResultCard
                type="APRI"
                score={results.apri}
                interpretation={results.apriInterpretation}
                diseaseInfo={diseaseInfo}
                selectedDisease={selectedDisease}
              />
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-amber-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">APRI - {diseaseInfo.name}에서 부적합</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      APRI는 {diseaseInfo.name}에서 신뢰도가 낮습니다 (AUROC: {diseaseInfo.apriAUROC}).
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      FIB-4 결과를 우선적으로 참고하시기 바랍니다.
                    </p>
                    <p className="text-xs text-amber-600 mt-2 bg-amber-100 px-2 py-1 rounded inline-block">
                      계산된 APRI: {results.apri?.toFixed(2)} (참고용)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FIB-4 결과 */}
            <ResultCard
              type="FIB-4"
              score={results.fib4}
              interpretation={results.fib4Interpretation}
              age={age}
              diseaseInfo={diseaseInfo}
              selectedDisease={selectedDisease}
            />
          </div>
        )}

        {/* 해석 가이드 */}
        <InterpretationGuide />

        {/* 주의사항 */}
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}

export default App;
