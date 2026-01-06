import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { InterpretationGuide } from './components/InterpretationGuide';
import { Disclaimer } from './components/Disclaimer';
import { Footer } from './components/Footer';
import { useCalculator } from './hooks/useCalculator';

/**
 * 간섬유화 계산기 메인 앱 컴포넌트
 */
function App() {
  const {
    inputs,
    errors,
    hasCalculated,
    canCalculate,
    isElderly,
    results,
    handleInputChange,
    resetInputs,
    calculate
  } = useCalculator();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        {/* 입력 폼 */}
        <InputForm
          inputs={inputs}
          errors={errors}
          isElderly={isElderly}
          canCalculate={canCalculate}
          onInputChange={handleInputChange}
          onReset={resetInputs}
          onCalculate={calculate}
        />

        {/* 결과 표시 (계산 완료 시) */}
        {hasCalculated && results.apri !== null && (
          <div className="space-y-4 animate-fade-in">
            {/* APRI 결과 */}
            <ResultCard
              type="APRI"
              score={results.apri}
              interpretation={results.apriInterpretation}
            />

            {/* FIB-4 결과 */}
            <ResultCard
              type="FIB-4"
              score={results.fib4}
              interpretation={results.fib4Interpretation}
              age={parseFloat(inputs.age)}
            />
          </div>
        )}

        {/* 해석 가이드 */}
        <InterpretationGuide />

        {/* 주의사항 */}
        <Disclaimer />
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

export default App;
