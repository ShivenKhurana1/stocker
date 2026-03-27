import * as tf from "@tensorflow/tfjs";

// Feature names must match the main thread
const FEATURE_NAMES = [
  "1D Return", "2D Return", "5D Momentum", "10D Momentum", "20D Momentum", "60D Momentum",
  "RSI 14", "Volatility 10D", "Volatility 20D", "Volume Surge", "Price vs SMA20", "Price vs SMA50",
  "S&P 500 Return", "S&P 500 Momentum 5D", "VIX Level", "VIX 5D Change", "US 10Y Yield",
  "10Y 5D Change", "Oil Return", "Oil Momentum 5D", "Weekday Sine", "Weekday Cosine",
];

interface TrainModelMessage {
  type: "TRAIN_MODEL";
  data: {
    features: number[][];
    targets: number[];
    validationFeatures: number[][];
    validationTargets: number[];
    config: {
      epochs: number;
      batchSize: number;
      learningRate: number;
    };
  };
  id: string;
}

interface WorkerResponse {
  type: "PROGRESS" | "COMPLETE" | "ERROR";
  data?: any;
  id: string;
}

// Scaler functions (duplicated in worker since it can't import from main thread easily)
function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  const avg = mean(values);
  const variance = mean(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

function fitScaler(matrix: number[][]): { means: number[]; stds: number[] } {
  const featureCount = matrix[0]?.length ?? 0;
  const means = Array.from({ length: featureCount }, (_, i) =>
    mean(matrix.map((row) => row[i])),
  );
  const stds = Array.from({ length: featureCount }, (_, i) => {
    const value = standardDeviation(matrix.map((row) => row[i]));
    return value > 1e-8 ? value : 1;
  });
  return { means, stds };
}

function transformWithScaler(matrix: number[][], stats: { means: number[]; stds: number[] }): number[][] {
  return matrix.map((row) =>
    row.map((value, i) => (value - stats.means[i]) / stats.stds[i]),
  );
}

function createRecencyUpsampledTrainingSet(
  features: number[][],
  targets: number[],
): { features: number[][]; targets: number[] } {
  const upsampledFeatures: number[][] = [];
  const upsampledTargets: number[] = [];
  const total = features.length;

  for (let i = 0; i < total; i++) {
    const duplicateCount = i >= total * 0.9 ? 3 : i >= total * 0.75 ? 2 : i >= total * 0.55 ? 1 : 0;
    const repeats = duplicateCount + 1;
    for (let r = 0; r < repeats; r++) {
      upsampledFeatures.push([...features[i]]);
      upsampledTargets.push(targets[i]);
    }
  }
  return { features: upsampledFeatures, targets: upsampledTargets };
}

// Model architecture and training
async function trainModel(data: TrainModelMessage["data"]): Promise<{
  weights: number[][];
  bestEpoch: number;
  finalValLoss: number;
}> {
  const { features, targets, validationFeatures, validationTargets, config } = data;

  // Scale features
  const scaler = fitScaler(features);
  const trainXScaled = transformWithScaler(features, scaler);
  const validationXScaled = transformWithScaler(validationFeatures, scaler);

  // Upsample training data
  const upsampled = createRecencyUpsampledTrainingSet(trainXScaled, targets);

  // Create tensors
  const trainXTensor = tf.tensor2d(upsampled.features);
  const trainYTensor = tf.tensor2d(upsampled.targets, [upsampled.targets.length, 1]);
  const validationXTensor = tf.tensor2d(validationXScaled);
  const validationYTensor = tf.tensor2d(validationTargets, [validationTargets.length, 1]);

  // Build model
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 96,
    inputShape: [FEATURE_NAMES.length],
    activation: "relu",
    kernelRegularizer: tf.regularizers.l2({ l2: 0.0008 }),
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.12 }));
  model.add(tf.layers.dense({
    units: 48,
    activation: "relu",
    kernelRegularizer: tf.regularizers.l2({ l2: 0.0006 }),
  }));
  model.add(tf.layers.dropout({ rate: 0.08 }));
  model.add(tf.layers.dense({ units: 20, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(config.learningRate),
    loss: (truth, prediction) => tf.losses.huberLoss(truth, prediction, 0.9).mean(),
  });

  // Track best weights
  let bestValLoss = Number.POSITIVE_INFINITY;
  let bestWeights: tf.Tensor[] | null = null;
  let bestEpoch = 0;
  let waitCount = 0;
  const patience = 14;
  const minDelta = 1e-5;

  try {
    await model.fit(trainXTensor, trainYTensor, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      shuffle: false,
      validationData: [validationXTensor, validationYTensor],
      verbose: 0,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          const valLoss = logs?.val_loss;
          if (typeof valLoss === "number" && Number.isFinite(valLoss)) {
            // Track best weights
            if (valLoss < bestValLoss - minDelta) {
              bestValLoss = valLoss;
              bestEpoch = epoch;
              bestWeights?.forEach((t) => t.dispose());
              bestWeights = model.getWeights().map((t) => t.clone());
              waitCount = 0;
            } else {
              waitCount++;
            }

            // Send progress to main thread
            self.postMessage({
              type: "PROGRESS",
              data: { epoch, totalEpochs: config.epochs, valLoss, bestEpoch },
            });

            // Early stopping
            if (waitCount >= patience) {
              model.stopTraining = true;
            }
          }
        },
      },
    });

    // Restore best weights and serialize
    if (bestWeights) {
      model.setWeights(bestWeights);
    }

    const weights = model.getWeights().map((w) => Array.from(w.dataSync()));
    const finalValLoss = bestValLoss;

    return { weights, bestEpoch, finalValLoss };
  } finally {
    // Cleanup
    trainXTensor.dispose();
    trainYTensor.dispose();
    validationXTensor.dispose();
    validationYTensor.dispose();
    if (bestWeights) {
      (bestWeights as tf.Tensor[]).forEach((t) => t.dispose());
    }
    model.dispose();
  }
}

// Worker message handler
self.onmessage = async (event: MessageEvent<TrainModelMessage>) => {
  const { type, data, id } = event.data;

  if (type === "TRAIN_MODEL") {
    try {
      const result = await trainModel(data);
      self.postMessage({
        type: "COMPLETE",
        data: result,
        id,
      });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        data: { message: error instanceof Error ? error.message : "Unknown error" },
        id,
      });
    }
  }
};

export {};
