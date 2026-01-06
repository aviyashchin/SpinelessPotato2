import React, { useState, useEffect, useRef } from 'react';
import { AppState, Question, ElementResult } from './types';
import { generateQuizQuestions, analyzePersonality } from './services/geminiService';
import { CornerDecoration } from './components/CornerDecoration';
import { Button } from './components/Button';
import { Sparkles, AlertCircle, Download, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'elemental_soul_state_v1';

export default function App() {
  // State Initialization with lazy loading from localStorage
  const [view, setView] = useState<AppState>(AppState.START);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ElementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // To handle scrolling to top on question change
  const questionCardRef = useRef<HTMLDivElement>(null);

  // 1. Load from LocalStorage on Mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.view) setView(parsed.view);
        if (parsed.questions) setQuestions(parsed.questions);
        if (parsed.currentQuestionIndex) setCurrentQuestionIndex(parsed.currentQuestionIndex);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.result) setResult(parsed.result);
      } catch (e) {
        console.error("Failed to restore soul state", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // 2. Save to LocalStorage on Change
  useEffect(() => {
    const stateToSave = {
      view,
      questions,
      currentQuestionIndex,
      answers,
      result
    };
    // Only save if we have actually started something
    if (view !== AppState.START) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [view, questions, currentQuestionIndex, answers, result]);

  const resetQuiz = () => {
    localStorage.removeItem(STORAGE_KEY);
    setView(AppState.START);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const startQuiz = async () => {
    resetQuiz(); // Clear any old state before starting fresh
    setView(AppState.LOADING_QUIZ);
    setError(null);
    try {
      const qs = await generateQuizQuestions();
      setQuestions(qs);
      setView(AppState.QUIZ);
    } catch (e) {
      console.error(e);
      setError("The cosmos failed to align. Please try connecting again.");
      setView(AppState.ERROR);
    }
  };

  const handleAnswer = (optionId: string) => {
    const currentQ = questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));

    if (currentQuestionIndex < questions.length - 1) {
      // Small delay for UX
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        // Scroll slightly up if needed
        questionCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    } else {
      finishQuiz(optionId);
    }
  };

  const finishQuiz = async (lastOptionId?: string) => {
    setView(AppState.ANALYZING);
    try {
      const finalAnswers = { ...answers };
      if (lastOptionId) {
        finalAnswers[questions[currentQuestionIndex].id] = lastOptionId;
      }
      
      const res = await analyzePersonality(questions, finalAnswers);
      setResult(res);
      setView(AppState.RESULT);
    } catch (e) {
      console.error(e);
      setError("The elements are in flux. Interpretation failed.");
      setView(AppState.ERROR);
    }
  };
  
  // Re-trigger analysis safety net
  useEffect(() => {
    if (view === AppState.ANALYZING && Object.keys(answers).length === questions.length && !result) {
       analyzePersonality(questions, answers)
        .then(res => {
          setResult(res);
          setView(AppState.RESULT);
        })
        .catch(e => {
          setError("Failed to analyze.");
          setView(AppState.ERROR);
        });
    }
  }, [view, answers, questions, result]);

  const downloadResult = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `soul-element-${result.element.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };


  // ---- RENDERERS ----

  if (view === AppState.START) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 text-center max-w-2xl space-y-8">
          <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Elemental Soul
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-light">
            You are composed of stardust, shadows, and time. Answer 30 difficult questions to discover your true abstract elemental affinity.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <Button onClick={startQuiz} className="text-lg px-12 py-4">
              Begin the Trial
            </Button>
            {localStorage.getItem(STORAGE_KEY) && (
              <p className="text-xs text-slate-500">
                (Your previous session data was found and will be cleared on start)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === AppState.LOADING_QUIZ || view === AppState.ANALYZING) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
        <div className="text-center space-y-4 z-10">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-display text-white tracking-widest uppercase">
            {view === AppState.LOADING_QUIZ ? "Summoning Questions..." : "Communing with the Void..."}
          </h2>
          <p className="text-slate-500 animate-pulse">
            {view === AppState.LOADING_QUIZ ? "The Oracle is preparing your trial." : "Your soul is being weighed."}
          </p>
        </div>
      </div>
    );
  }

  if (view === AppState.ERROR) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-xl max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-red-200">Disruption in the Aether</h3>
          <p className="text-red-200/70">{error}</p>
          <Button variant="outline" onClick={resetQuiz}>
            Return to Safety
          </Button>
        </div>
      </div>
    );
  }

  if (view === AppState.QUIZ && questions.length > 0) {
    const currentQ = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-8 relative">
        
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 blur-[80px]" />
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 blur-[80px]" />
        </div>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-neutral-900 z-50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full max-w-4xl z-10 mb-8 flex justify-between items-end text-slate-500 font-display text-sm tracking-widest">
           <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
           <div className="flex gap-4 items-center">
             <span>Soul Calibration</span>
             <button onClick={resetQuiz} className="text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Abort</button>
           </div>
        </div>

        {/* Question Card */}
        <div 
          ref={questionCardRef}
          className="relative w-full max-w-4xl bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden transition-all duration-500 animate-[fadeIn_0.5s_ease-out]"
          key={currentQ.id} // Key change forces re-render of decoration
        >
          {/* Decorative Corners - Passing ID to randomize but keep consistent for same question */}
          <CornerDecoration seed={currentQ.id} />

          <div className="relative z-10 space-y-12">
            <h2 className="text-2xl md:text-4xl font-display leading-tight text-slate-100 text-center drop-shadow-lg">
              {currentQ.text}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  className={`
                    group relative p-6 text-left rounded-xl transition-all duration-300
                    border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]
                    ${answers[currentQ.id] === opt.id ? 'bg-indigo-900/30 border-indigo-500' : ''}
                  `}
                >
                  <span className="absolute top-6 left-6 text-xs font-bold text-slate-600 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">
                    Option {opt.id}
                  </span>
                  <p className="mt-6 text-lg text-slate-300 group-hover:text-white transition-colors">
                    {opt.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === AppState.RESULT && result) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col relative overflow-hidden">
        {/* Dynamic Background based on Hex */}
        <div 
          className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${result.hexColor}, transparent 70%)` }}
        />

        <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center max-w-5xl">
          
          <div className="text-center space-y-6 mb-16 animate-[fadeInUp_0.8s_ease-out]">
            <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 text-xs tracking-widest uppercase">
              Soul Analysis Complete
            </span>
            <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter" style={{ color: result.hexColor, textShadow: `0 0 40px ${result.hexColor}40` }}>
              {result.element}
            </h1>
            <p className="text-xl md:text-2xl font-light text-slate-300 max-w-3xl mx-auto leading-relaxed border-l-2 pl-6" style={{ borderColor: result.hexColor }}>
              {result.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Affinity Card */}
            <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4">Alignment</h3>
              <p className="text-3xl font-display">{result.affinity}</p>
            </div>

            {/* Strengths */}
            <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4">Strengths</h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: result.hexColor }}>✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4">Vulnerabilities</h3>
              <ul className="space-y-2">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-600">⚠</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex gap-4">
            <Button onClick={downloadResult} variant="secondary">
              <span className="flex items-center gap-2">
                <Download size={18} />
                Save Soul Card (JSON)
              </span>
            </Button>
            <Button onClick={resetQuiz}>
               <span className="flex items-center gap-2">
                <RefreshCw size={18} />
                Reincarnate
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}