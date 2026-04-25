import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2,
  RefreshCcw,
  Sparkles,
  Info
} from "lucide-react";
import { FinancialProfile, AnalysisResult, RiskLevel } from "./types";
import { analyzeCreditworthiness } from "./services/gemini";
import { cn } from "./lib/utils";

const DEFAULT_PROFILE: FinancialProfile = {
  monthlyIncome: 25000,
  monthlyExpenses: 17500,
  savings: 4000,
  transactionCount: 48,
  businessType: "Retail Shop",
};

export default function App() {
  const [profile, setProfile] = useState<FinancialProfile>(DEFAULT_PROFILE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeCreditworthiness(profile);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case RiskLevel.MEDIUM:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case RiskLevel.HIGH:
        return "bg-rose-100 text-rose-800 border-rose-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 w-3 h-3 rounded-full animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Microfinance Division</h2>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
            Credit Flow <span className="text-blue-600">Analyst</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Bento Engine v2.4 • Precise Credit Scoring for Informal Markets
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs font-mono text-slate-400 uppercase">System Status: Optimal</p>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Analyst Verified</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Form (Bento Style) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bento-card bento-card-primary space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Financial Profile Input</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="stat-label">Income (KES/mo)</label>
                  <input 
                    type="number"
                    value={profile.monthlyIncome}
                    onChange={(e) => setProfile({...profile, monthlyIncome: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:border-slate-900 transition-all outline-none font-mono font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="stat-label">Expenses (KES/mo)</label>
                  <input 
                    type="number"
                    value={profile.monthlyExpenses}
                    onChange={(e) => setProfile({...profile, monthlyExpenses: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:border-slate-900 transition-all outline-none font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="stat-label">Savings</label>
                    <input 
                      type="number"
                      value={profile.savings}
                      onChange={(e) => setProfile({...profile, savings: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:border-slate-900 transition-all outline-none font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="stat-label">TX Count</label>
                    <input 
                      type="number"
                      value={profile.transactionCount}
                      onChange={(e) => setProfile({...profile, transactionCount: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:border-slate-900 transition-all outline-none font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="stat-label">Business Type</label>
                  <input 
                    type="text"
                    value={profile.businessType}
                    onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:border-slate-900 transition-all outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-bento"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Analysis"}
                </button>
                <button 
                  onClick={() => setProfile(DEFAULT_PROFILE)}
                  className="w-14 h-14 border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <RefreshCcw className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}
            </div>
          </div>

          {/* Right Column: Results (Bento Grid) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full bento-card flex flex-col items-center justify-center p-12 text-center space-y-4"
                >
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Processing Financial Nodes...</p>
                </motion.div>
              ) : result ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-8 grid-rows-auto gap-6"
                >
                  {/* Score Card */}
                  <div className="col-span-8 md:col-span-3 row-span-2 bento-card bento-card-primary flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                      <BarChart3 className="w-4 h-4 text-slate-200 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <p className="stat-label mb-2">Credit Score</p>
                    <div className="text-8xl font-black text-slate-900 leading-none">{result.score}</div>
                    <div className={cn(
                      "mt-6 px-4 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest",
                      getRiskBadgeStyles(result.riskLevel)
                    )}>
                      {result.riskLevel} Risk
                    </div>
                  </div>

                  {/* Monthly Recap */}
                  <div className="col-span-8 md:col-span-5 row-span-1 bento-card-dark flex flex-col justify-between">
                    <h3 className="stat-label text-slate-500">Financial Recap</h3>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Income</p>
                        <p className="text-xl font-black font-mono">{profile.monthlyIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Flow</p>
                        <p className="text-xl font-black font-mono">{(profile.monthlyIncome - profile.monthlyExpenses).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Savings</p>
                        <p className="text-xl font-black font-mono">{profile.savings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Loan Card */}
                  <div className="col-span-8 md:col-span-3 row-span-1 bento-card-accent flex flex-col justify-between">
                    <h3 className="stat-label text-blue-200">Recommendation</h3>
                    <div className="mt-4">
                      <p className="text-3xl font-black tracking-tight leading-none">{result.recommendedLoanRange}</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Max Capital Allocation</p>
                    </div>
                  </div>

                  {/* Velocity Card */}
                  <div className="col-span-8 md:col-span-2 row-span-1 bento-card bento-card-primary flex flex-col justify-center">
                    <p className="stat-label text-slate-400">TX Velocity</p>
                    <p className="text-2xl font-black text-slate-900">{(profile.transactionCount / 30).toFixed(1)} <span className="text-xs font-bold text-slate-400 lowercase">/ day</span></p>
                  </div>

                  {/* Strengths */}
                  <div className="col-span-8 md:col-span-4 row-span-2 bento-card">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-black text-sm uppercase tracking-tight">Key Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3 text-xs font-medium text-slate-600">
                          <span className="text-emerald-500 font-black">+</span>
                          <p>{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="col-span-8 md:col-span-4 row-span-2 bento-card">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                      <h3 className="font-black text-sm uppercase tracking-tight">Key Risks</h3>
                    </div>
                    <ul className="space-y-4">
                      {result.risks.map((r, i) => (
                        <li key={i} className="flex gap-3 text-xs font-medium text-slate-600">
                          <span className="text-rose-500 font-black">−</span>
                          <p>{r}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full bento-card flex flex-col items-center justify-center p-12 text-center text-slate-300 border-dashed">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">Awaiting Data Submission</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center py-8 border-t border-slate-200">
          <div className="flex gap-6 mb-4 md:mb-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC Complete</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AML Screened</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Strictly Confidential • AI Studio Built
          </p>
        </footer>
      </main>
    </div>
  );
}
