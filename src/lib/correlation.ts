/**
 * Calculates the Pearson correlation coefficient between two numeric series.
 * Returns a value between -1 and 1.
 */
export function calculateCorrelation(seriesA: number[], seriesB: number[]): number {
  if (seriesA.length !== seriesB.length || seriesA.length < 2) {
    return 0;
  }

  const n = seriesA.length;
  let sumA = 0;
  let sumB = 0;
  let sumA2 = 0;
  let sumB2 = 0;
  let sumAB = 0;

  for (let i = 0; i < n; i++) {
    const a = seriesA[i];
    const b = seriesB[i];
    sumA += a;
    sumB += b;
    sumA2 += a * a;
    sumB2 += b * b;
    sumAB += a * b;
  }

  const numerator = n * sumAB - sumA * sumB;
  const denominator = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Calculates the correlation coefficient based on daily returns (more standard for finance).
 */
export function calculateReturnCorrelation(pricesA: number[], pricesB: number[]): number {
  const returnsA = pricesA.slice(1).map((p, i) => (p - pricesA[i]) / pricesA[i]);
  const returnsB = pricesB.slice(1).map((p, i) => (p - pricesB[i]) / pricesB[i]);
  return calculateCorrelation(returnsA, returnsB);
}
