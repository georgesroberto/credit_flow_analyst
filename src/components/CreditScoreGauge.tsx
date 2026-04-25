import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface CreditScoreGaugeProps {
  score: number;
}

export function CreditScoreGauge({ score }: CreditScoreGaugeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-emerald-500";
    if (s >= 40) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBg = (s: number) => {
    if (s >= 70) return "bg-emerald-500";
    if (s >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-neutral-100"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <motion.circle
            className={cn("transition-colors duration-500", getScoreColor(score))}
            strokeWidth="8"
            strokeDasharray={251.2}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-5xl font-mono font-bold leading-none", getScoreColor(score))}
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 mt-1">
            Credit Score
          </span>
        </div>
      </div>
      
      <div className="mt-8 flex gap-2 w-full max-w-[240px]">
        {[...Array(5)].map((_, i) => {
          const isActive = (score / 20) > i;
          return (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-700",
                isActive ? getScoreBg(score) : "bg-neutral-100"
              )} 
            />
          );
        })}
      </div>
    </div>
  );
}
