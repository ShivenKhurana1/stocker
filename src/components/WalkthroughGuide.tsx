"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  requiresAction?: boolean;
  actionMessage?: string;
}

const steps: WalkthroughStep[] = [
  {
    target: "[data-tour='search']",
    title: "Search Stocks",
    description: "Enter any stock ticker (like AAPL, TSLA, NVDA) to get AI-powered price predictions.",
    position: "bottom",
  },
  {
    target: "[data-tour='horizon']",
    title: "Prediction Horizon",
    description: "Choose how many days ahead you want to forecast. The neural network adapts to your timeline.",
    position: "bottom",
  },
  {
    target: "[data-tour='predict-btn']",
    title: "Generate Forecast",
    description: "Click the button to train the model in real-time. You must run a prediction to continue the tour.",
    position: "bottom",
    requiresAction: true,
    actionMessage: "Click 'Predict Future Price' to continue...",
  },
  {
    target: "[data-tour='chart']",
    title: "Interactive Charts",
    description: "Hover for detailed data points. Toggle EMA and RSI overlays for technical analysis.",
    position: "top",
  },
  {
    target: "[data-tour='portfolio']",
    title: "Track Holdings",
    description: "Add stocks to your portfolio to monitor P/L and get quick-access predictions for your watchlist.",
    position: "left",
  },
  {
    target: "[data-tour='sentiment']",
    title: "News Sentiment",
    description: "See how recent news headlines might impact stock movement with AI sentiment analysis.",
    position: "top",
  },
];

interface WalkthroughGuideProps {
  hasPrediction: boolean;
}

export default function WalkthroughGuide({ hasPrediction }: WalkthroughGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [autoAdvanced, setAutoAdvanced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenTour = localStorage.getItem("stocker_tour_completed");
    if (!hasSeenTour) {
      // Small delay to let the page render
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-advance from step 2 (predict button) when prediction loads
  useEffect(() => {
    if (hasPrediction && currentStep === 2 && !autoAdvanced) {
      setAutoAdvanced(true);
      setTimeout(() => {
        setCurrentStep(3);
      }, 500);
    }
  }, [hasPrediction, currentStep, autoAdvanced]);

  const updateTargetRect = useCallback(() => {
    if (!isVisible) return;
    const step = steps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isVisible]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);
    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [updateTargetRect]);

  const handleNext = () => {
    const step = steps[currentStep];
    if (step.requiresAction && !hasPrediction) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    localStorage.setItem("stocker_tour_completed", "true");
    setIsVisible(false);
  };

  const resetTour = () => {
    localStorage.removeItem("stocker_tour_completed");
    setCurrentStep(0);
    setIsVisible(true);
  };

  if (!mounted || !isVisible || !targetRect) return null;

  const step = steps[currentStep];
  const isBlocked = step.requiresAction && !hasPrediction;
  const padding = 8;
  
  const spotlightStyle: React.CSSProperties = {
    position: "fixed",
    top: targetRect.top - padding,
    left: targetRect.left - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
    borderRadius: 12,
    boxShadow: isBlocked 
      ? "0 0 0 9999px rgba(0, 0, 0, 0.85), 0 0 30px rgba(239, 68, 68, 0.5)" 
      : "0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(56, 219, 197, 0.3)",
    pointerEvents: "none",
    zIndex: 9998,
    transition: "all 0.3s ease-out",
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    const tooltipWidth = 280;
    const tooltipHeight = 140;
    const gap = 16;
    
    let top = targetRect.top;
    let left = targetRect.left;
    
    switch (step.position) {
      case "bottom":
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "top":
        top = targetRect.top - tooltipHeight - gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - gap;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.right + gap;
        break;
    }
    
    // Keep within viewport
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
    
    return {
      position: "fixed",
      top,
      left,
      width: tooltipWidth,
      zIndex: 9999,
    };
  };

  const tooltipStyle = getTooltipStyle();

  const content = (
    <>
      {/* Spotlight overlay */}
      <div style={spotlightStyle} />
      
      {/* Tooltip */}
      <div
        style={tooltipStyle}
        className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
          isBlocked 
            ? "border-rose-500/40 bg-slate-950/95" 
            : "border-cyan-500/30 bg-slate-950/95"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
            isBlocked ? "bg-rose-500/20 text-rose-400" : "bg-cyan-500/20 text-cyan-400"
          }`}>
            {currentStep + 1}
          </span>
          <span className={`text-xs font-medium ${
            isBlocked ? "text-rose-400" : "text-cyan-400"
          }`}>
            {currentStep + 1} of {steps.length}
          </span>
          {isBlocked && (
            <span className="ml-auto flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
        <p className="text-xs text-slate-300/80 leading-relaxed mb-4">
          {step.description}
        </p>
        
        {isBlocked && step.actionMessage && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2">
            <p className="text-[11px] text-rose-300 font-medium animate-pulse">
              {step.actionMessage}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isBlocked}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                isBlocked
                  ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                  : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
              }`}
            >
              {currentStep === steps.length - 1 ? "Finish" : isBlocked ? "Run Prediction" : "Next"}
            </button>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? isBlocked ? "w-4 bg-rose-400" : "w-4 bg-cyan-400"
                  : i < currentStep
                  ? "w-1.5 bg-cyan-400/50"
                  : "w-1.5 bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

// Export a helper to manually trigger the tour
export { steps };
export type { WalkthroughStep };
