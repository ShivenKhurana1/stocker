"use client";

export type TrainingProgress = {
  epoch: number;
  totalEpochs: number;
  valLoss: number;
  bestEpoch: number;
};

export type TrainingResult = {
  weights: number[][];
  bestEpoch: number;
  finalValLoss: number;
};

type WorkerMessage =
  | { type: "TRAIN_MODEL"; data: TrainingData; id: string }
  | { type: "PROGRESS"; data: TrainingProgress }
  | { type: "COMPLETE"; data: TrainingResult; id: string }
  | { type: "ERROR"; data: { message: string }; id: string };

interface TrainingData {
  features: number[][];
  targets: number[];
  validationFeatures: number[][];
  validationTargets: number[];
  config: {
    epochs: number;
    batchSize: number;
    learningRate: number;
  };
}

class ModelWorkerClient {
  private worker: Worker | null = null;
  private pendingResolvers: Map<
    string,
    { resolve: (value: TrainingResult) => void; reject: (error: Error) => void }
  > = new Map();

  onProgress?: (data: TrainingProgress) => void;

  constructor() {
    // Lazy initialization - worker created on first use
  }

  private initWorker(): Worker {
    if (this.worker) return this.worker;

    // Create worker with module type for TypeScript/ESM support
    this.worker = new Worker(
      new URL("./modelWorker.ts", import.meta.url),
      { type: "module" }
    );

    this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, data, id } = event.data;

      if (type === "PROGRESS") {
        this.onProgress?.(data);
      } else if (type === "COMPLETE") {
        const resolver = this.pendingResolvers.get(id);
        if (resolver) {
          resolver.resolve(data);
          this.pendingResolvers.delete(id);
        }
      } else if (type === "ERROR") {
        const resolver = this.pendingResolvers.get(id);
        if (resolver) {
          resolver.reject(new Error(data.message));
          this.pendingResolvers.delete(id);
        }
      }
    };

    this.worker.onerror = (error) => {
      console.error("Model worker error:", error);
      // Reject all pending promises
      this.pendingResolvers.forEach(({ reject }) => {
        reject(new Error("Worker crashed"));
      });
      this.pendingResolvers.clear();
    };

    return this.worker;
  }

  async trainModel(data: TrainingData): Promise<TrainingResult> {
    const worker = this.initWorker();
    const id = Math.random().toString(36).slice(2);

    return new Promise((resolve, reject) => {
      this.pendingResolvers.set(id, { resolve, reject });
      worker.postMessage({ type: "TRAIN_MODEL", data, id });
    });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.pendingResolvers.forEach(({ reject }) => {
      reject(new Error("Worker terminated"));
    });
    this.pendingResolvers.clear();
  }
}

// Singleton instance
export const modelWorker = new ModelWorkerClient();
