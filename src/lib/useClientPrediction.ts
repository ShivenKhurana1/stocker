"use client";

import { useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import { modelWorker, TrainingProgress } from "./modelWorkerApi";

// Types matching the server-side response
interface PredictionResponse {
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
  topDrivers: Array<{ name: string; impact: number }>;
  history: Array<{ date: string; close: number }>;
  news: Array<{ title: string; publisher: string; link: string }>;
  generatedAt: string;
}

interface MarketData {
  symbol: string;
  horizonDays: number;
  stockSeries: Array<{ date: string; close: number; volume: number }>;
  marketSeries: Array<{ date: string; close: number }>;
  vixSeries: Array<{ date: string; close: number }>;
  ratesSeries: Array<{ date: string; close: number }>;
  oilSeries: Array<{ date: string; close: number }>;
  news: Array<{ title: string; publisher: string; link: string }>;
}

export function useClientPrediction() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set up progress callback
  modelWorker.onProgress = (data) => {
    setTrainingProgress(data);
  };

  const predict = useCallback(async (
    symbol: string,
    horizonDays: number
  ): Promise<PredictionResponse | null> => {
    setIsTraining(true);
    setTrainingProgress(null);
    setError(null);

    try {
      // Step 1: Fetch market data from server
      const response = await fetch(
        `/api/market-data?symbol=${encodeURIComponent(symbol)}&horizon=${horizonDays}`
      );
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch market data");
      }

      const data: MarketData = await response.json();

      // Step 2: Engineer features on client
      const { features, targets, validationFeatures, validationTargets, scaler } = 
        engineerFeatures(data);

      // Step 3: Train model in Web Worker
      const trainingResult = await modelWorker.trainModel({
        features,
        targets,
        validationFeatures,
        validationTargets,
        config: {
          epochs: 140,
          batchSize: 24,
          learningRate: 0.003,
        },
      });

      // Step 4: Build model and load weights
      const model = buildModel();
      const weightTensors = trainingResult.weights.map((w, i) => {
        const shape = model.getWeights()[i].shape;
        return tf.tensor(w, shape);
      });
      model.setWeights(weightTensors);
      weightTensors.forEach((t) => t.dispose());

      // Step 5: Make prediction
      const result = runPrediction(model, data, scaler, horizonDays);
      
      // Cleanup
      model.dispose();

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Prediction failed";
      setError(message);
      return null;
    } finally {
      setIsTraining(false);
      setTrainingProgress(null);
    }
  }, []);

  return { predict, isTraining, trainingProgress, error };
}

// Feature engineering (ported from stockPredictor.ts)
function engineerFeatures(data: MarketData) {
  // Implementation would mirror the server-side feature engineering
  // For now, returning placeholder structure
  const features: number[][] = [];
  const targets: number[] = [];
  
  // TODO: Port feature engineering logic from stockPredictor.ts
  
  // Split into train/validation
  const splitIndex = Math.floor(features.length * 0.82);
  const trainFeatures = features.slice(0, splitIndex);
  const trainTargets = targets.slice(0, splitIndex);
  const validationFeatures = features.slice(splitIndex);
  const validationTargets = targets.slice(splitIndex);

  return {
    features: trainFeatures,
    targets: trainTargets,
    validationFeatures,
    validationTargets,
    scaler: { means: [0], stds: [1] }, // Placeholder
  };
}

function buildModel(): tf.LayersModel {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 96,
    inputShape: [22], // 22 features
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
  return model;
}

function runPrediction(
  model: tf.LayersModel,
  data: MarketData,
  scaler: { means: number[]; stds: number[] },
  horizonDays: number
): PredictionResponse {
  // TODO: Implement full prediction logic
  // This is a placeholder that would mirror the server-side logic
  
  const latestClose = data.stockSeries[data.stockSeries.length - 1]?.close ?? 0;
  
  return {
    symbol: data.symbol,
    horizonDays,
    latestClose,
    predictedClose: latestClose * 1.05,
    predictedMovePercent: 5,
    confidenceScore: 75,
    forecastRange: { low: latestClose * 0.95, high: latestClose * 1.1 },
    modelMetrics: { mae: 0, mape: 0, rSquared: 0, trainingSamples: 0, featuresUsed: [] },
    topDrivers: [],
    history: data.stockSeries.map((s) => ({ date: s.date, close: s.close })),
    news: data.news,
    generatedAt: new Date().toISOString(),
  };
}
