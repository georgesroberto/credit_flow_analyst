import { GoogleGenAI, Type } from "@google/genai";
import { FinancialProfile, AnalysisResult, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeCreditworthiness(profile: FinancialProfile): Promise<AnalysisResult> {
  const prompt = `
    Analyze the following financial profile for an informal worker/small business to evaluate creditworthiness:
    Monthly Income: ${profile.monthlyIncome} KES
    Monthly Expenses: ${profile.monthlyExpenses} KES
    Savings: ${profile.savings} KES
    Transaction Count: ${profile.transactionCount}
    Business Type: ${profile.businessType}

    Provide a JSON response with:
    1. score (0-100)
    2. riskLevel (Low, Medium, or High)
    3. recommendedLoanRange (string, e.g., "5,000 - 15,000 KES")
    4. strengths (array of strings)
    5. risks (array of strings)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            recommendedLoanRange: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["score", "riskLevel", "recommendedLoanRange", "strengths", "risks"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      riskLevel: result.riskLevel as RiskLevel,
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback logic for demo purposes if API fails or key is missing
    const disposableIncome = profile.monthlyIncome - profile.monthlyExpenses;
    const score = Math.min(100, Math.max(0, 
      (disposableIncome / 5000) * 20 + 
      (profile.savings / 1000) * 10 + 
      (profile.transactionCount / 50) * 30
    ));
    
    let riskLevel = RiskLevel.MEDIUM;
    if (score > 70) riskLevel = RiskLevel.LOW;
    else if (score < 40) riskLevel = RiskLevel.HIGH;

    return {
      score: Math.round(score),
      riskLevel,
      recommendedLoanRange: `${Math.round(disposableIncome * 0.5)} - ${Math.round(disposableIncome * 2)} KES`,
      strengths: [
        disposableIncome > 0 ? "Positive cash flow" : "Limited cash flow",
        profile.savings > 0 ? "Active savings habit" : "No initial savings debt coverage",
        profile.transactionCount > 20 ? "High transactional visibility" : "Low transactional data",
      ],
      risks: [
        disposableIncome < 5000 ? "Low buffer for unexpected expenses" : "Inflation sensitivity",
        profile.businessType === "Retail Shop" ? "High competition risk" : "Business cycle vulnerability",
      ],
    };
  }
}
