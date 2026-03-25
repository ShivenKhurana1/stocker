import * as tf from "@tensorflow/tfjs";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

type PricePoint = {
  date: string;
  close: number;
  volume: number;
};

type AlignedSeries = {
  closeByDate: Map<string, number>;
  returnByDate: Map<string, number>;
};

type FeatureRow = {
  date: string;
  close: number;
  features: number[];
  target: number;
};

type ScalerStats = {
  means: number[];
  stds: number[];
};

type FeatureImpact = {
  name: string;
  impact: number;
};

export type PredictionResult = {
  symbol: string;
  horizonDays: number;
  latestClose: number;
  predictedClose: number;
  predictedMovePercent: number;
  confidenceScore: number;
  forecastRange: {
    low: number;
    high: number;
  };
  modelMetrics: {
    mae: number;
    mape: number;
    rSquared: number;
    trainingSamples: number;
    featuresUsed: string[];
  };
  topDrivers: FeatureImpact[];
  history: Array<{ date: string; close: number }>;
  generatedAt: string;
};

const FEATURE_NAMES = [
  "1D Return",
  "2D Return",
  "5D Momentum",
  "10D Momentum",
  "20D Momentum",
  "60D Momentum",
  "RSI 14",
  "Volatility 10D",
  "Volatility 20D",
  "Volume Surge",
  "Price vs SMA20",
  "Price vs SMA50",
  "S&P 500 Return",
  "S&P 500 Momentum 5D",
  "VIX Level",
  "VIX 5D Change",
  "US 10Y Yield",
  "10Y 5D Change",
  "Oil Return",
  "Oil Momentum 5D",
  "Weekday Sine",
  "Weekday Cosine",
];

const FEATURE_INDEX = {
  dailyReturn: 0,
  momentum5: 2,
  volatility10: 7,
  marketReturn: 12,
} as const;

const MACRO_SYMBOLS = {
  market: "^GSPC",
  vix: "^VIX",
  rates: "^TNX",
  oil: "CL=F",
} as const;

const MIN_TRAINING_ROWS = 140;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) {
    return 0;
  }

  const avg = mean(values);
  const variance = mean(values.map((value) => (value - avg) ** 2));
  return Math.sqrt(variance);
}

function safeRatio(current: number, previous: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return 1;
  }

  return current / previous;
}

function safeReturn(current: number, previous: number): number {
  return safeRatio(current, previous) - 1;
}

function rollingVolatility(returns: number[], endIndex: number, lookback: number): number {
  const startIndex = Math.max(0, endIndex - lookback + 1);
  return standardDeviation(returns.slice(startIndex, endIndex + 1));
}

function baselineSignalFromFeatures(features: number[]): number {
  const blendedSignal =
    0.5 * features[FEATURE_INDEX.dailyReturn] +
    0.35 * features[FEATURE_INDEX.momentum5] +
    0.2 * features[FEATURE_INDEX.marketReturn] -
    0.25 * features[FEATURE_INDEX.volatility10];

  return clamp(blendedSignal, -0.12, 0.12);
}

function findBestBlendWeight(
  modelPredictions: number[],
  baselinePredictions: number[],
  actualValues: number[],
): number {
  const candidateWeights = [0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
  let bestWeight = 0.8;
  let bestMae = Number.POSITIVE_INFINITY;

  for (const weight of candidateWeights) {
    const blended = modelPredictions.map(
      (prediction, index) =>
        weight * prediction + (1 - weight) * baselinePredictions[index],
    );
    const currentMae = mae(actualValues, blended);
    if (currentMae < bestMae) {
      bestMae = currentMae;
      bestWeight = weight;
    }
  }

  return bestWeight;
}

function createRecencyUpsampledTrainingSet(
  features: number[][],
  targets: number[],
): {
  features: number[][];
  targets: number[];
} {
  const upsampledFeatures: number[][] = [];
  const upsampledTargets: number[] = [];
  const total = features.length;

  for (let index = 0; index < total; index += 1) {
    const featureRow = features[index];
    const targetValue = targets[index];

    // Keep all original samples and duplicate recent ones to bias learning toward newer regimes.
    const duplicateCount =
      index >= total * 0.9 ? 3 : index >= total * 0.75 ? 2 : index >= total * 0.55 ? 1 : 0;

    const repeats = duplicateCount + 1;
    for (let repeat = 0; repeat < repeats; repeat += 1) {
      upsampledFeatures.push([...featureRow]);
      upsampledTargets.push(targetValue);
    }
  }

  return {
    features: upsampledFeatures,
    targets: upsampledTargets,
  };
}

function createBestWeightTracker(model: tf.Sequential): {
  callback: tf.CustomCallbackArgs;
  restoreBestWeights: () => void;
  dispose: () => void;
} {
  let bestValLoss = Number.POSITIVE_INFINITY;
  let bestWeights: tf.Tensor[] | null = null;

  const callback: tf.CustomCallbackArgs = {
    onEpochEnd: async (_epoch, logs) => {
      const lossValue = logs?.val_loss;
      if (typeof lossValue !== "number" || !Number.isFinite(lossValue)) {
        return;
      }

      if (lossValue < bestValLoss) {
        bestValLoss = lossValue;
        bestWeights?.forEach((tensor) => tensor.dispose());
        bestWeights = model.getWeights().map((tensor) => tensor.clone());
      }
    },
  };

  const restoreBestWeights = () => {
    if (!bestWeights || bestWeights.length === 0) {
      return;
    }

    model.setWeights(bestWeights);
    bestWeights.forEach((tensor) => tensor.dispose());
    bestWeights = null;
  };

  const dispose = () => {
    bestWeights?.forEach((tensor) => tensor.dispose());
    bestWeights = null;
  };

  return {
    callback,
    restoreBestWeights,
    dispose,
  };
}

function createValLossEarlyStopper(
  model: tf.Sequential,
  patience: number,
  minDelta = 1e-6,
): tf.CustomCallbackArgs {
  let bestValLoss = Number.POSITIVE_INFINITY;
  let waitCount = 0;

  return {
    onEpochEnd: async (_epoch, logs) => {
      const lossValue = logs?.val_loss;
      if (typeof lossValue !== "number" || !Number.isFinite(lossValue)) {
        return;
      }

      if (lossValue < bestValLoss - minDelta) {
        bestValLoss = lossValue;
        waitCount = 0;
        return;
      }

      waitCount += 1;
      if (waitCount >= patience) {
        model.stopTraining = true;
      }
    },
  };
}

function computeRsi(prices: number[], endIndex: number, period = 14): number {
  let gains = 0;
  let losses = 0;

  for (let i = endIndex - period + 1; i <= endIndex; i += 1) {
    const move = prices[i] - prices[i - 1];
    if (move >= 0) {
      gains += move;
    } else {
      losses -= move;
    }
  }

  if (losses === 0) {
    return 100;
  }

  const relativeStrength = gains / losses;
  return 100 - 100 / (1 + relativeStrength);
}

function fitScaler(matrix: number[][]): ScalerStats {
  const featureCount = matrix[0]?.length ?? 0;
  const means = Array.from({ length: featureCount }, (_, index) =>
    mean(matrix.map((row) => row[index])),
  );
  const stds = Array.from({ length: featureCount }, (_, index) => {
    const value = standardDeviation(matrix.map((row) => row[index]));
    return value > 1e-8 ? value : 1;
  });

  return { means, stds };
}

function transformWithScaler(matrix: number[][], stats: ScalerStats): number[][] {
  return matrix.map((row) =>
    row.map((value, index) => (value - stats.means[index]) / stats.stds[index]),
  );
}

function mae(actual: number[], predicted: number[]): number {
  return mean(actual.map((value, index) => Math.abs(value - predicted[index])));
}

function mape(actual: number[], predicted: number[]): number {
  const epsilon = 1e-8;
  return (
    mean(
      actual.map((value, index) =>
        Math.abs(value - predicted[index]) / Math.max(Math.abs(value), epsilon),
      ),
    ) * 100
  );
}

function rSquared(actual: number[], predicted: number[]): number {
  const actualMean = mean(actual);
  const sumSquaredResidual = actual.reduce(
    (sum, value, index) => sum + (value - predicted[index]) ** 2,
    0,
  );
  const totalSumSquares = actual.reduce(
    (sum, value) => sum + (value - actualMean) ** 2,
    0,
  );

  if (totalSumSquares === 0) {
    return 0;
  }

  return 1 - sumSquaredResidual / totalSumSquares;
}

function shuffleArray(values: number[]): number[] {
  const clone = [...values];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[swapIndex]] = [clone[swapIndex], clone[i]];
  }
  return clone;
}

async function fetchPriceSeries(
  symbol: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<PricePoint[]> {
  const chartResult = (await yahooFinance.chart(symbol, {
    period1: periodStart,
    period2: periodEnd,
    interval: "1d",
  })) as unknown as {
    quotes?: Array<{
      date?: Date;
      close?: number | null;
      volume?: number | null;
    }>;
  };

  const quotes = chartResult.quotes ?? [];

  return quotes
    .filter(
      (quote): quote is { date: Date; close: number; volume?: number | null } =>
        quote.date instanceof Date &&
        typeof quote.close === "number" &&
        Number.isFinite(quote.close),
    )
    .map((quote) => ({
      date: toDateKey(quote.date),
      close: quote.close,
      volume: Math.max(quote.volume ?? 0, 0),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function alignSeries(mainDates: string[], otherSeries: PricePoint[]): AlignedSeries {
  const closeByDate = new Map<string, number>();
  const returnByDate = new Map<string, number>();

  let pointer = 0;
  let lastClose = otherSeries[0]?.close ?? 0;
  let lastReturn = 0;

  for (const date of mainDates) {
    while (pointer < otherSeries.length && otherSeries[pointer].date <= date) {
      const currentClose = otherSeries[pointer].close;
      if (pointer > 0) {
        const previousClose = otherSeries[pointer - 1].close;
        if (previousClose !== 0) {
          lastReturn = (currentClose - previousClose) / previousClose;
        }
      }

      lastClose = currentClose;
      pointer += 1;
    }

    closeByDate.set(date, lastClose);
    returnByDate.set(date, lastReturn);
  }

  return { closeByDate, returnByDate };
}

function buildFeatureRows(
  stockSeries: PricePoint[],
  horizonDays: number,
  marketAligned: AlignedSeries,
  vixAligned: AlignedSeries,
  ratesAligned: AlignedSeries,
  oilAligned: AlignedSeries,
): FeatureRow[] {
  const closes = stockSeries.map((point) => point.close);
  const volumes = stockSeries.map((point) => point.volume);
  const dates = stockSeries.map((point) => point.date);
  const stockReturns = closes.map((close, index) =>
    index === 0 ? 0 : safeReturn(close, closes[index - 1]),
  );

  const marketCloseSeries = dates.map((date) => marketAligned.closeByDate.get(date) ?? 0);
  const marketReturnSeries = dates.map((date) => marketAligned.returnByDate.get(date) ?? 0);
  const vixLevelSeries = dates.map(
    (date) => (vixAligned.closeByDate.get(date) ?? 0) / 100,
  );
  const ratesLevelSeries = dates.map(
    (date) => (ratesAligned.closeByDate.get(date) ?? 0) / 100,
  );
  const oilCloseSeries = dates.map((date) => oilAligned.closeByDate.get(date) ?? 0);
  const oilReturnSeries = dates.map((date) => oilAligned.returnByDate.get(date) ?? 0);

  const firstFeatureIndex = 65;
  const lastFeatureIndex = closes.length - horizonDays - 1;

  const rows: FeatureRow[] = [];

  for (let i = firstFeatureIndex; i <= lastFeatureIndex; i += 1) {
    const close = closes[i];
    const previousClose = closes[i - 1];
    const currentDate = dates[i];

    if (!Number.isFinite(close) || previousClose === 0) {
      continue;
    }

    const dailyReturn = stockReturns[i];
    const return2D = safeReturn(close, closes[i - 2]);
    const momentum5 = safeReturn(close, closes[i - 5]);
    const momentum10 = safeReturn(close, closes[i - 10]);
    const momentum20 = safeReturn(close, closes[i - 20]);
    const momentum60 = safeReturn(close, closes[i - 60]);
    const rsi14 = computeRsi(closes, i, 14) / 100;
    const volatility10 = rollingVolatility(stockReturns, i, 10);
    const volatility20 = rollingVolatility(stockReturns, i, 20);
    const averageVolume20 = Math.max(mean(volumes.slice(i - 19, i + 1)), 1);
    const volumeSurge = volumes[i] / averageVolume20 - 1;
    const sma20 = mean(closes.slice(i - 19, i + 1));
    const sma50 = mean(closes.slice(i - 49, i + 1));
    const priceVsSma20 = safeReturn(close, sma20);
    const priceVsSma50 = safeReturn(close, sma50);

    const marketReturn = marketReturnSeries[i];
    const marketMomentum5 = safeReturn(marketCloseSeries[i], marketCloseSeries[i - 5]);
    const vixLevel = vixLevelSeries[i];
    const vixChange5 = vixLevelSeries[i] - vixLevelSeries[i - 5];
    const rateLevel = ratesLevelSeries[i];
    const rateChange5 = ratesLevelSeries[i] - ratesLevelSeries[i - 5];
    const oilReturn = oilReturnSeries[i];
    const oilMomentum5 = safeReturn(oilCloseSeries[i], oilCloseSeries[i - 5]);

    const weekday = new Date(`${currentDate}T00:00:00Z`).getUTCDay();
    const weekdaySine = Math.sin((2 * Math.PI * weekday) / 7);
    const weekdayCosine = Math.cos((2 * Math.PI * weekday) / 7);

    const futureClose = closes[i + horizonDays];
    const targetReturn = clamp(safeReturn(futureClose, close), -0.35, 0.35);

    const features = [
      dailyReturn,
      return2D,
      momentum5,
      momentum10,
      momentum20,
      momentum60,
      rsi14,
      volatility10,
      volatility20,
      volumeSurge,
      priceVsSma20,
      priceVsSma50,
      marketReturn,
      marketMomentum5,
      vixLevel,
      vixChange5,
      rateLevel,
      rateChange5,
      oilReturn,
      oilMomentum5,
      weekdaySine,
      weekdayCosine,
    ];

    if (features.every(Number.isFinite) && Number.isFinite(targetReturn)) {
      rows.push({
        date: currentDate,
        close,
        features,
        target: targetReturn,
      });
    }
  }

  return rows;
}

async function calculateFeatureImpacts(
  model: tf.LayersModel,
  baselineMae: number,
  testX: number[][],
  testY: number[],
): Promise<FeatureImpact[]> {
  const impacts: FeatureImpact[] = [];

  for (let featureIndex = 0; featureIndex < FEATURE_NAMES.length; featureIndex += 1) {
    const permuted = testX.map((row) => [...row]);
    const shuffledColumn = shuffleArray(permuted.map((row) => row[featureIndex]));

    for (let rowIndex = 0; rowIndex < permuted.length; rowIndex += 1) {
      permuted[rowIndex][featureIndex] = shuffledColumn[rowIndex];
    }

    const permutedTensor = tf.tensor2d(permuted);
    const predictionTensor = model.predict(permutedTensor) as tf.Tensor;
    const predictionMatrix = (await predictionTensor.array()) as number[][];
    const predictionValues = predictionMatrix.map((row) => row[0]);

    predictionTensor.dispose();
    permutedTensor.dispose();

    const permutedMae = mae(testY, predictionValues);
    impacts.push({
      name: FEATURE_NAMES[featureIndex],
      impact: Math.max(permutedMae - baselineMae, 0),
    });
  }

  const totalImpact = impacts.reduce((sum, item) => sum + item.impact, 0);
  return impacts
    .map((item) => ({
      ...item,
      impact: totalImpact > 0 ? (item.impact / totalImpact) * 100 : 0,
    }))
    .sort((a, b) => b.impact - a.impact);
}

export async function predictStockFuture({
  symbol,
  horizonDays,
}: {
  symbol: string;
  horizonDays: number;
}): Promise<PredictionResult> {
  const cleanSymbol = symbol.trim().toUpperCase();
  if (!/^[A-Z0-9.\-^=]{1,10}$/.test(cleanSymbol)) {
    throw new Error("Invalid ticker format. Example: AAPL, TSLA, MSFT.");
  }

  if (horizonDays < 2 || horizonDays > 30) {
    throw new Error("Horizon must be between 2 and 30 days.");
  }

  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setUTCFullYear(periodStart.getUTCFullYear() - 5);

  const [stockSeries, marketSeries, vixSeries, ratesSeries, oilSeries] =
    await Promise.all([
      fetchPriceSeries(cleanSymbol, periodStart, periodEnd),
      fetchPriceSeries(MACRO_SYMBOLS.market, periodStart, periodEnd),
      fetchPriceSeries(MACRO_SYMBOLS.vix, periodStart, periodEnd),
      fetchPriceSeries(MACRO_SYMBOLS.rates, periodStart, periodEnd),
      fetchPriceSeries(MACRO_SYMBOLS.oil, periodStart, periodEnd),
    ]);

  if (stockSeries.length < 320) {
    throw new Error(
      "Not enough market history for this symbol. Choose another ticker with more trading history.",
    );
  }

  const mainDates = stockSeries.map((point) => point.date);
  const marketAligned = alignSeries(mainDates, marketSeries);
  const vixAligned = alignSeries(mainDates, vixSeries);
  const ratesAligned = alignSeries(mainDates, ratesSeries);
  const oilAligned = alignSeries(mainDates, oilSeries);

  const rows = buildFeatureRows(
    stockSeries,
    horizonDays,
    marketAligned,
    vixAligned,
    ratesAligned,
    oilAligned,
  );

  if (rows.length < MIN_TRAINING_ROWS) {
    throw new Error("Insufficient training rows after feature engineering.");
  }

  const splitIndex = Math.floor(rows.length * 0.82);
  const trainValidationRows = rows.slice(0, splitIndex);
  const testRows = rows.slice(splitIndex);

  if (trainValidationRows.length < 140 || testRows.length < 25) {
    throw new Error("Dataset split is too small for reliable scoring.");
  }

  const validationCount = Math.max(24, Math.floor(trainValidationRows.length * 0.16));
  const fitTrainRows = trainValidationRows.slice(
    0,
    trainValidationRows.length - validationCount,
  );
  const validationRows = trainValidationRows.slice(trainValidationRows.length - validationCount);

  if (fitTrainRows.length < 100 || validationRows.length < 20) {
    throw new Error("Dataset split is too small for reliable scoring.");
  }

  const fitTrainX = fitTrainRows.map((row) => row.features);
  const fitTrainY = fitTrainRows.map((row) => row.target);
  const validationX = validationRows.map((row) => row.features);
  const validationY = validationRows.map((row) => row.target);
  const testX = testRows.map((row) => row.features);
  const testY = testRows.map((row) => row.target);

  const scaler = fitScaler(fitTrainX);
  const trainXScaled = transformWithScaler(fitTrainX, scaler);
  const validationXScaled = transformWithScaler(validationX, scaler);
  const testXScaled = transformWithScaler(testX, scaler);
  const recencyUpsampledTrainSet = createRecencyUpsampledTrainingSet(
    trainXScaled,
    fitTrainY,
  );

  const trackedTensors: tf.Tensor[] = [];
  let model: tf.Sequential | null = null;

  try {
    const trainXTensor = tf.tensor2d(recencyUpsampledTrainSet.features);
    const trainYTensor = tf.tensor2d(recencyUpsampledTrainSet.targets, [
      recencyUpsampledTrainSet.targets.length,
      1,
    ]);
    const validationXTensor = tf.tensor2d(validationXScaled);
    const validationYTensor = tf.tensor2d(validationY, [validationY.length, 1]);
    const testXTensor = tf.tensor2d(testXScaled);

    trackedTensors.push(
      trainXTensor,
      trainYTensor,
      validationXTensor,
      validationYTensor,
      testXTensor,
    );

    model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: 96,
        inputShape: [FEATURE_NAMES.length],
        activation: "relu",
        kernelRegularizer: tf.regularizers.l2({ l2: 0.0008 }),
      }),
    );
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dropout({ rate: 0.12 }));
    model.add(
      tf.layers.dense({
        units: 48,
        activation: "relu",
        kernelRegularizer: tf.regularizers.l2({ l2: 0.0006 }),
      }),
    );
    model.add(tf.layers.dropout({ rate: 0.08 }));
    model.add(tf.layers.dense({ units: 20, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({
      optimizer: tf.train.adam(0.003),
      loss: (truth, prediction) => tf.losses.huberLoss(truth, prediction, 0.9).mean(),
    });

    const bestWeightTracker = createBestWeightTracker(model);
    const valLossEarlyStopper = createValLossEarlyStopper(model, 14, 1e-5);
    try {
      await model.fit(trainXTensor, trainYTensor, {
        epochs: 140,
        batchSize: 24,
        shuffle: false,
        validationData: [validationXTensor, validationYTensor],
        verbose: 0,
        callbacks: [
          bestWeightTracker.callback,
          valLossEarlyStopper,
        ],
      });

      bestWeightTracker.restoreBestWeights();
    } finally {
      bestWeightTracker.dispose();
    }

    const validationPredictionTensor = model.predict(validationXTensor) as tf.Tensor;
    const validationPredictionMatrix =
      (await validationPredictionTensor.array()) as number[][];
    const validationModelPredictions = validationPredictionMatrix.map((row) => row[0]);
    validationPredictionTensor.dispose();

    const validationBaselinePredictions = validationRows.map((row) =>
      baselineSignalFromFeatures(row.features),
    );
    const blendWeight = findBestBlendWeight(
      validationModelPredictions,
      validationBaselinePredictions,
      validationY,
    );
    const blendedValidationPredictions = validationModelPredictions.map(
      (prediction, index) =>
        blendWeight * prediction +
        (1 - blendWeight) * validationBaselinePredictions[index],
    );
    const validationMae = mae(validationY, blendedValidationPredictions);

    const predictionTensor = model.predict(testXTensor) as tf.Tensor;
    const predictionMatrix = (await predictionTensor.array()) as number[][];
    const testModelPredictions = predictionMatrix.map((row) => row[0]);
    predictionTensor.dispose();

    const testBaselinePredictions = testRows.map((row) =>
      baselineSignalFromFeatures(row.features),
    );
    const predictedReturns = testModelPredictions.map(
      (prediction, index) =>
        blendWeight * prediction +
        (1 - blendWeight) * testBaselinePredictions[index],
    );

    const testMae = mae(testY, predictedReturns);
    const testMape = mape(testY, predictedReturns);
    const testR2 = rSquared(testY, predictedReturns);
    const modelOnlyTestMae = mae(testY, testModelPredictions);

    const latestRow = rows[rows.length - 1];
    const featuresForPrediction = [...latestRow.features];

    const latestFeatureScaled = transformWithScaler([featuresForPrediction], scaler);
    const latestFeatureTensor = tf.tensor2d(latestFeatureScaled);
    trackedTensors.push(latestFeatureTensor);

    const futureReturnTensor = model.predict(latestFeatureTensor) as tf.Tensor;
    const futureModelReturn = ((await futureReturnTensor.array()) as number[][])[0][0];
    futureReturnTensor.dispose();

    const futureBaselineReturn = baselineSignalFromFeatures(featuresForPrediction);
    const futureReturn = clamp(
      blendWeight * futureModelReturn + (1 - blendWeight) * futureBaselineReturn,
      -0.35,
      0.35,
    );

    const latestClose = latestRow.close;
    const predictedClose = latestClose * (1 + futureReturn);
    const combinedError = testMae * 0.7 + validationMae * 0.3;
    const targetVolatility = Math.max(
      standardDeviation(rows.map((row) => row.target)),
      0.012,
    );
    const confidenceScore = clamp(100 * (1 - combinedError / targetVolatility), 5, 98);

    const featureImpacts = await calculateFeatureImpacts(
      model,
      modelOnlyTestMae,
      testXScaled,
      testY,
    );

    const lowerReturn = futureReturn - combinedError;
    const upperReturn = futureReturn + combinedError;

    return {
      symbol: cleanSymbol,
      horizonDays,
      latestClose: round(latestClose, 2),
      predictedClose: round(predictedClose, 2),
      predictedMovePercent: round(futureReturn * 100, 2),
      confidenceScore: round(confidenceScore, 1),
      forecastRange: {
        low: round(latestClose * (1 + lowerReturn), 2),
        high: round(latestClose * (1 + upperReturn), 2),
      },
      modelMetrics: {
        mae: round(testMae * 100, 2),
        mape: round(testMape, 2),
        rSquared: round(testR2, 3),
        trainingSamples: recencyUpsampledTrainSet.targets.length,
        featuresUsed: FEATURE_NAMES,
      },
      topDrivers: featureImpacts.slice(0, 5).map((impact) => ({
        name: impact.name,
        impact: round(impact.impact, 1),
      })),
      history: stockSeries.slice(-140).map((point) => ({
        date: point.date,
        close: round(point.close, 2),
      })),
      generatedAt: new Date().toISOString(),
    };
  } finally {
    trackedTensors.forEach((tensor) => tensor.dispose());
    model?.dispose();
  }
}
