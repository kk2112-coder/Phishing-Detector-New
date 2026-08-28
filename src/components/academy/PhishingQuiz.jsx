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
    if (finalScore >= 800) return { title: 'Threat Hunter Elite', color: 'text-purple-400', badge: 'bg-purple-950 border-purple-800' };
    if (finalScore >= 600) return { title: 'Security Guardian', color: 'text-cyan-400', badge: 'bg-cyan-950 border-cyan-800' };
    if (finalScore >= 400) return { title: 'Cyber Sentinel', color: 'text-blue-400', badge: 'bg-blue-950 border-blue-800' };
    return { title: 'Rookie Defender', color: 'text-amber-400', badge: 'bg-amber-950 border-amber-800' };
  };

  const rank = getRank(score);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900/90 border border-cyan-900/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              PhishGuard Cyber Academy & Training Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Interactive "Spot-The-Phish" real-world threat identification training
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {streak > 1 && (
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400 text-xs font-bold font-mono animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak}X Streak!</span>
            </div>
          )}

          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Score:</span>
            <span className="font-bold text-cyan-300 text-sm">{score}</span>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              Scenario <strong className="text-cyan-300">{currentIndex + 1}</strong> of {QUIZ_SCENARIOS.length}
            </span>
            <span className="text-slate-500">
              {Math.round(((currentIndex + 1) / QUIZ_SCENARIOS.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
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
                className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-red-950/60 hover:bg-red-900/80 border-2 border-red-800 hover:border-red-500 text-red-200 font-bold text-base shadow-lg transition-all cursor-pointer group"
              >
                <ShieldAlert className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                <span>🚨 This is a Phishing Scam</span>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border-2 border-emerald-800 hover:border-emerald-500 text-emerald-200 font-bold text-base shadow-lg transition-all cursor-pointer group"
              >
                <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>🛡️ This is Legitimate</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedAnswer === currentScenario.isPhishing ? (
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                      <CheckCircle2 className="w-6 h-6" />
                      <span>Spot On! Correct Assessment (+{100 + (streak - 1) * 20} pts)</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-400 font-bold text-base">
                      <XCircle className="w-6 h-6" />
                      <span>Security Trap Missed!</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>{currentIndex + 1 < QUIZ_SCENARIOS.length ? 'Next Scenario' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Defense Expert Analysis:</strong>
                {currentScenario.explanation}
              </div>

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <strong className="text-slate-300 block mb-1">Key Security Takeaways:</strong>
                {currentScenario.tips?.map((tip, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-cyan-400">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-cyan-950 border-2 border-cyan-500/50 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20 animate-pulse">
            <Award className="w-10 h-10 text-cyan-400" />
          </div>

          <div className="space-y-2">
            <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${rank.badge} ${rank.color}`}>
              {rank.title}
            </span>
            <h3 className="text-2xl font-black text-white">
              Academy Challenge Complete!
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              You scored <strong className="text-cyan-300 font-mono">{score} points</strong> across all cyber attack scenarios.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
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
