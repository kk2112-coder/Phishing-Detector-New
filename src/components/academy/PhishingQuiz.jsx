import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_SCENARIOS } from '../../data/quizScenarios';
import { ScenarioCard } from './ScenarioCard';
import {
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Trophy
} from 'lucide-react';
import { playQuizCorrect, playQuizWrong } from '../../utils/audioEffects';

export const PhishingQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentScenario = QUIZ_SCENARIOS[currentIndex];

  const handleAnswer = (isPhishingAnswer) => {
    if (isAnswered) return;

    setSelectedAnswer(isPhishingAnswer);
    setIsAnswered(true);

    const isCorrect = isPhishingAnswer === currentScenario.isPhishing;
    if (isCorrect) {
      const addedScore = 100 + streak * 20;
      setScore((prev) => prev + addedScore);
      setStreak((prev) => prev + 1);
      playQuizCorrect();
    } else {
      setStreak(0);
      playQuizWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      triggerConfetti();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const getRank = (finalScore) => {
    if (finalScore >= 800) return { title: 'Threat Hunter Elite', color: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-800' };
    if (finalScore >= 600) return { title: 'Security Guardian', color: 'text-sky-600 dark:text-cyan-400', badge: 'bg-sky-100 dark:bg-cyan-950 border-sky-300 dark:border-cyan-800' };
    if (finalScore >= 400) return { title: 'Cyber Sentinel', color: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800' };
    return { title: 'Rookie Defender', color: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800' };
  };

  const rank = getRank(score);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              PhishGuard Cyber Academy & Training Simulator
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Interactive "Spot-The-Phish" real-world threat identification training
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {streak > 1 && (
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono">
              <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 text-amber-500" />
              <span>{streak}X Streak!</span>
            </div>
          )}

          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-card font-mono text-xs">
            <Trophy className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400">Score:</span>
            <span className="font-bold text-sky-600 dark:text-cyan-300 text-sm">{score}</span>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Scenario <strong className="text-sky-600 dark:text-cyan-300 font-bold">{currentIndex + 1}</strong> of {QUIZ_SCENARIOS.length}
            </span>
            <span>
              {Math.round(((currentIndex + 1) / QUIZ_SCENARIOS.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / QUIZ_SCENARIOS.length) * 100}%`,
              }}
            />
          </div>

          <ScenarioCard
            scenario={currentScenario}
            showRedFlags={isAnswered}
          />

          {!isAnswered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-md transition-all cursor-pointer group"
              >
                <ShieldAlert className="w-6 h-6 group-hover:scale-105 transition-transform" />
                <span>🚨 This is a Phishing Scam</span>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md transition-all cursor-pointer group"
              >
                <ShieldCheck className="w-6 h-6 group-hover:scale-105 transition-transform" />
                <span>🛡️ This is Legitimate</span>
              </button>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedAnswer === currentScenario.isPhishing ? (
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                      <CheckCircle2 className="w-6 h-6" />
                      <span>Spot On! Correct Assessment (+{100 + (streak - 1) * 20} pts)</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-base">
                      <XCircle className="w-6 h-6" />
                      <span>Security Trap Missed!</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>{currentIndex + 1 < QUIZ_SCENARIOS.length ? 'Next Scenario' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <strong className="text-sky-700 dark:text-cyan-400 block mb-1">Defense Expert Analysis:</strong>
                {currentScenario.explanation}
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <strong className="text-slate-800 dark:text-slate-300 block mb-1">Key Security Takeaways:</strong>
                {currentScenario.tips?.map((tip, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-sky-500 dark:text-cyan-400">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-8 text-center space-y-6 shadow-xl backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-sky-50 dark:bg-cyan-950 border-2 border-sky-300 dark:border-cyan-500/50 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-10 h-10 text-sky-600 dark:text-cyan-400" />
          </div>

          <div className="space-y-2">
            <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${rank.badge} ${rank.color}`}>
              {rank.title}
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Academy Challenge Complete!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              You scored <strong className="text-sky-600 dark:text-cyan-300 font-mono font-bold">{score} points</strong> across all cyber attack scenarios.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-sm shadow-md hover:from-sky-500 hover:to-blue-500 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
