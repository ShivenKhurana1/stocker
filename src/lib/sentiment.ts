const BULLISH_WORDS = [
  "upgraded", "surpasses", "growth", "buy", "outperform", "bullish", "profit",
  "beats", "innovation", "strong", "expansion", "positive", "momentum",
  "partnership", "breakthrough", "acquisition", "dividend", "yield", "soars", "jumps"
];

const BEARISH_WORDS = [
  "downgraded", "misses", "losses", "sell", "underperform", "bearish", "debt",
  "decline", "negative", "litigation", "lawsuit", "slumps", "plunges", "warning",
  "inflation", "risk", "recession", "uncertainty", "layoffs", "shuts"
];

export type SentimentResult = {
  score: number; // -1 to 1
  label: "Bullish" | "Bearish" | "Neutral";
  explanation: string;
};

export function analyzeSentiment(headlines: string[]): SentimentResult {
  if (headlines.length === 0) {
    return { score: 0, label: "Neutral", explanation: "No recent news available for analysis." };
  }

  let bullishCount = 0;
  let bearishCount = 0;

  const combinedText = headlines.join(" ").toLowerCase();

  BULLISH_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    const matches = combinedText.match(regex);
    if (matches) bullishCount += matches.length;
  });

  BEARISH_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    const matches = combinedText.match(regex);
    if (matches) bearishCount += matches.length;
  });

  const total = bullishCount + bearishCount;
  if (total === 0) {
    return { score: 0, label: "Neutral", explanation: "Headlines are neutral or lack clear sentiment drivers." };
  }

  const score = (bullishCount - bearishCount) / total;
  
  let label: "Bullish" | "Bearish" | "Neutral" = "Neutral";
  if (score > 0.2) label = "Bullish";
  if (score < -0.2) label = "Bearish";

  const explanation = `Found ${bullishCount} bullish and ${bearishCount} bearish signals in recent headlines.`;

  return { score, label, explanation };
}
