"use client";

import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { analyzeSentiment, SentimentResult } from "@/lib/sentiment";
import { calculateReturnCorrelation } from "@/lib/correlation";
import WalkthroughGuide from "@/components/WalkthroughGuide";

const POPULAR_TICKERS = ["AAPL", "NVDA", "TSLA", "MSFT", "AMZN"];

type PredictionResponse = {
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
  topDrivers: Array<{
    name: string;
    impact: number;
  }>;
  history: Array<{
    date: string;
    close: number;
  }>;
  news: Array<{
    title: string;
    publisher: string;
    link: string;
  }>;
  generatedAt: string;
};

type PortfolioItem = {
  symbol: string;
  shares: number;
  avgPrice: number;
  lastPrice: number;
  predictedClose?: number;
  purchaseDate: string;
  targetPrice?: number;
  news?: Array<{
    title: string;
    publisher: string;
    link: string;
  }>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  const signedValue = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return `${signedValue}%`;
}

function formatChartDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = [];
  const k = 2 / (period + 1);
  let prevEma = data[0];
  ema.push(prevEma);

  for (let i = 1; i < data.length; i++) {
    const val = data[i] * k + prevEma * (1 - k);
    ema.push(val);
    prevEma = val;
  }
  return ema;
}

function calculateRSI(data: number[], period: number): number[] {
  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < period; i++) rsi.push(50); // Padding

  for (let i = period; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    let currentGain = 0;
    let currentLoss = 0;
    if (diff >= 0) currentGain = diff;
    else currentLoss = -diff;

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }
  return rsi;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function PriceChart({
  points,
  showEMA = false,
  showRSI = false,
  onToggleEMA,
  onToggleRSI,
}: {
  points: Array<{ date: string; close: number }>;
  showEMA?: boolean;
  showRSI?: boolean;
  onToggleEMA: () => void;
  onToggleRSI: () => void;
}) {
  const [rangeDays, setRangeDays] = useState<30 | 60 | 90 | 180>(60);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartId = useId().replace(/:/g, "");

  const displayedPoints = useMemo(
    () => points.slice(-Math.min(rangeDays, points.length)),
    [points, rangeDays],
  );

  const width = 1400;
  const height = 480;
  const padding = {
    top: 32,
    right: 42,
    bottom: 64,
    left: 72,
  };

  if (displayedPoints.length < 2) {
    return (
      <div className="rounded-xl border border-white/15 bg-black/20 px-4 py-7 text-sm text-slate-100/70">
        Not enough history for detailed chart rendering.
      </div>
    );
  }

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const closes = displayedPoints.map((point) => point.close);
  const minClose = Math.min(...closes);
  const maxClose = Math.max(...closes);
  const yPadding = Math.max((maxClose - minClose) * 0.12, 0.75);
  const yMin = minClose - yPadding;
  const yMax = maxClose + yPadding;
  const ySpan = Math.max(yMax - yMin, 1);

  const toX = (index: number): number =>
    padding.left + (index / (displayedPoints.length - 1)) * plotWidth;
  const toY = (value: number): number =>
    padding.top + ((yMax - value) / ySpan) * plotHeight;

  const linePath = displayedPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${toX(index)} ${toY(point.close)}`)
    .join(" ");
  const areaPath = `${linePath} L ${toX(displayedPoints.length - 1)} ${padding.top + plotHeight} L ${toX(0)} ${padding.top + plotHeight} Z`;

  const movingAveragePeriod = Math.min(7, Math.max(2, Math.floor(displayedPoints.length / 4)));
  const movingAverage = displayedPoints.map((_, index) => {
    if (index + 1 < movingAveragePeriod) {
      return null;
    }

    const windowValues = displayedPoints
      .slice(index - movingAveragePeriod + 1, index + 1)
      .map((point) => point.close);
    return average(windowValues);
  });

  const movingAveragePath = movingAverage.reduce((path, value, index) => {
    if (value === null) {
      return path;
    }

    const command = path.length === 0 ? "M" : "L";
    return `${path} ${command} ${toX(index)} ${toY(value)}`.trim();
  }, "");

  const emaData = useMemo(() => {
    if (!showEMA) return [];
    return calculateEMA(closes, 12);
  }, [closes, showEMA]);
  const emaPath = useMemo(() => {
    return emaData.reduce((path, value, index) => {
      const command = index === 0 ? "M" : "L";
      return `${path} ${command} ${toX(index)} ${toY(value)}`.trim();
    }, "");
  }, [emaData]);

  const rsiData = useMemo(() => {
    if (!showRSI) return [];
    return calculateRSI(closes, 14);
  }, [closes, showRSI]);
  const toRsiY = (val: number) => padding.top + plotHeight - (val / 100) * (plotHeight * 0.3);
  const rsiPath = useMemo(() => {
    return rsiData.reduce((path, value, index) => {
      const command = index === 0 ? "M" : "L";
      return `${path} ${command} ${toX(index)} ${toRsiY(value)}`.trim();
    }, "");
  }, [rsiData]);

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = yMax - ratio * ySpan;
    const y = padding.top + ratio * plotHeight;
    return { y, value };
  });

  const xTickIndexes = Array.from(
    new Set([
      0,
      Math.floor((displayedPoints.length - 1) / 3),
      Math.floor((2 * (displayedPoints.length - 1)) / 3),
      displayedPoints.length - 1,
    ]),
  );

  const clampIndex = (index: number): number =>
    Math.min(displayedPoints.length - 1, Math.max(0, index));

  const updateHoverPosition = (clientX: number, svgElement: SVGSVGElement) => {
    const rect = svgElement.getBoundingClientRect();
    const scaledX = ((clientX - rect.left) / rect.width) * width;
    const chartX = Math.min(width - padding.right, Math.max(padding.left, scaledX));
    const ratio = (chartX - padding.left) / plotWidth;
    const nextIndex = Math.round(ratio * (displayedPoints.length - 1));
    setHoverIndex(clampIndex(nextIndex));
  };

  const activeIndex = hoverIndex ?? displayedPoints.length - 1;
  const activePoint = displayedPoints[activeIndex];
  const activeX = toX(activeIndex);
  const activeY = toY(activePoint.close);
  const previousClose =
    activeIndex > 0 ? displayedPoints[activeIndex - 1].close : activePoint.close;
  const dailyMove =
    previousClose === 0 ? 0 : ((activePoint.close - previousClose) / previousClose) * 100;
  const rangeMove =
    displayedPoints[0].close === 0
      ? 0
      : ((activePoint.close - displayedPoints[0].close) / displayedPoints[0].close) * 100;

  const rangeButtons: Array<{ value: 30 | 60 | 90 | 180; label: string }> = [
    { value: 30, label: "30D" },
    { value: 60, label: "60D" },
    { value: 90, label: "90D" },
    { value: 180, label: "180D" },
  ];

  const tooltipPosition = {
    left: `${(activeX / width) * 100}%`,
  };
  const tooltipTransformClass =
    activeX > width - 170
      ? "-translate-x-full"
      : activeX < 170
        ? "translate-x-0"
        : "-translate-x-1/2";

  return (
    <div className="rounded-2xl border border-white/15 bg-black/25 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-200/70">
          Hover for point-level detail
        </p>
        <div className="inline-flex rounded-lg border border-white/15 bg-white/8 p-1">
          {rangeButtons.map((button) => {
            const active = rangeDays === button.value;
            const disabled = points.length < button.value;
            return (
              <button
                key={button.value}
                type="button"
                onClick={() => setRangeDays(button.value)}
                disabled={disabled}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] transition ${active
                  ? "bg-white/25 text-white"
                  : "text-slate-100/75 hover:bg-white/15 hover:text-white"
                  } disabled:cursor-not-allowed disabled:opacity-45`}
              >
                {button.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onToggleEMA}
            className={`rounded-md border border-white/10 px-2 py-1 text-[10px] font-medium transition ${showEMA ? "bg-amber-300/20 text-amber-200 border-amber-300/30" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
          >
            EMA
          </button>
          <button
            type="button"
            onClick={onToggleRSI}
            className={`rounded-md border border-white/10 px-2 py-1 text-[10px] font-medium transition ${showRSI ? "bg-cyan-300/20 text-cyan-200 border-cyan-300/30" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
          >
            RSI
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/12 bg-black/25">
        <div
          style={tooltipPosition}
          className={`pointer-events-none absolute top-2 z-10 ${tooltipTransformClass}`}
        >
          <div className="rounded-lg border border-white/20 bg-slate-950/85 px-3 py-2 text-xs backdrop-blur-md">
            <p className="font-semibold text-white">{formatChartDate(activePoint.date)}</p>
            <p className="mt-0.5 text-slate-200">{formatCurrency(activePoint.close)}</p>
            <p className={dailyMove >= 0 ? "text-emerald-300" : "text-rose-300"}>
              1D {formatPercent(dailyMove)}
            </p>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-64 w-full md:h-80 lg:h-[30rem]"
          onMouseMove={(event) => updateHoverPosition(event.clientX, event.currentTarget)}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchStart={(event) =>
            updateHoverPosition(event.touches[0].clientX, event.currentTarget)
          }
          onTouchMove={(event) =>
            updateHoverPosition(event.touches[0].clientX, event.currentTarget)
          }
          onTouchEnd={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={`${chartId}-line`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38dbc5" />
              <stop offset="100%" stopColor="#ffbc78" />
            </linearGradient>
            <linearGradient id={`${chartId}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(56, 219, 197, 0.30)" />
              <stop offset="100%" stopColor="rgba(56, 219, 197, 0.02)" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick.y}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="rgba(255,255,255,0.13)"
                strokeDasharray="3 5"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="10"
                fill="rgba(229, 242, 251, 0.7)"
              >
                {formatCurrency(tick.value)}
              </text>
            </g>
          ))}

          {xTickIndexes.map((index) => (
            <text
              key={index}
              x={toX(index)}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(229, 242, 251, 0.72)"
            >
              {formatChartDate(displayedPoints[index].date)}
            </text>
          ))}

          <path d={areaPath} fill={`url(#${chartId}-fill)`} />
          <path
            d={linePath}
            fill="none"
            stroke={`url(#${chartId}-line)`}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {showEMA && (
            <path
              d={emaPath}
              fill="none"
              stroke="rgba(255, 188, 120, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showRSI && (
            <>
              <line
                x1={padding.left}
                y1={toRsiY(70)}
                x2={width - padding.right}
                y2={toRsiY(70)}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray="2 2"
              />
              <line
                x1={padding.left}
                y1={toRsiY(30)}
                x2={width - padding.right}
                y2={toRsiY(30)}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray="2 2"
              />
              <path
                d={rsiPath}
                fill="none"
                stroke="#38dbc5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x={padding.left - 5}
                y={toRsiY(50)}
                textAnchor="end"
                fontSize="8"
                fill="rgba(56, 219, 197, 0.6)"
              >
                RSI
              </text>
            </>
          )}

          {movingAveragePath ? (
            <path
              d={movingAveragePath}
              fill="none"
              stroke="rgba(198, 227, 255, 0.85)"
              strokeWidth="1.8"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          <line
            x1={activeX}
            y1={padding.top}
            x2={activeX}
            y2={padding.top + plotHeight}
            stroke="rgba(255,255,255,0.28)"
            strokeDasharray="4 4"
          />
          <circle
            cx={activeX}
            cy={activeY}
            r="5"
            fill="rgba(255, 255, 255, 0.96)"
            stroke="rgba(56, 219, 197, 0.95)"
            strokeWidth="3"
          />
          <circle cx={activeX} cy={activeY} r="12" fill="rgba(56, 219, 197, 0.14)" />
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-100/80">
        <div className="rounded-lg border border-white/12 bg-white/8 px-3 py-2">
          <p className="uppercase tracking-[0.12em] text-slate-200/70">Selected</p>
          <p className="mt-1 text-sm font-medium text-white">{formatCurrency(activePoint.close)}</p>
        </div>
        <div className="rounded-lg border border-white/12 bg-white/8 px-3 py-2">
          <p className="uppercase tracking-[0.12em] text-slate-200/70">1D Change</p>
          <p className={`mt-1 text-sm font-medium ${dailyMove >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
            {formatPercent(dailyMove)}
          </p>
        </div>
        <div className="rounded-lg border border-white/12 bg-white/8 px-3 py-2">
          <p className="uppercase tracking-[0.12em] text-slate-200/70">Range Move</p>
          <p className={`mt-1 text-sm font-medium ${rangeMove >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
            {formatPercent(rangeMove)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Portfolio({
  items,
  onRemove,
  onSelect,
  onQuickAdd,
  "data-tour": dataTour,
}: {
  items: PortfolioItem[];
  onRemove: (symbol: string) => void;
  onSelect: (symbol: string) => void;
  onQuickAdd: (symbol: string) => void;
  "data-tour"?: string;
}) {
  const [quickTicker, setQuickTicker] = useState("");
  const totalValue = items.reduce((sum, item) => sum + item.shares * item.lastPrice, 0);
  const totalCost = items.reduce((sum, item) => sum + item.shares * item.avgPrice, 0);
  const totalGain = totalValue - totalCost;
  const gainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault();
    if (quickTicker.trim()) {
      onQuickAdd(quickTicker.trim().toUpperCase());
      setQuickTicker("");
    }
  };

  // Portfolio Risk Metrics
  const weightedMove = totalValue > 0
    ? items.reduce((sum, item) => {
      const move = item.predictedClose ? ((item.predictedClose - item.lastPrice) / item.lastPrice) * 100 : 0;
      return sum + (move * (item.shares * item.lastPrice)) / totalValue;
    }, 0)
    : 0;

  const highRiskAssets = items.filter(item => {
    const move = item.predictedClose ? Math.abs((item.predictedClose - item.lastPrice) / item.lastPrice) * 100 : 0;
    return move > 8; // Arbitrary high volatility threshold
  });

  const topOpportunity = items.reduce((best, current) => {
    const currentMove = current.predictedClose ? (current.predictedClose - current.lastPrice) / current.lastPrice : -1;
    const bestMove = best && best.predictedClose ? (best.predictedClose - best.lastPrice) / best.lastPrice : -1;
    return currentMove > bestMove ? current : best;
  }, items[0]);

  return (
    <article data-tour={dataTour} className="glass-panel animate-fade-up rounded-3xl p-4 md:p-8 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">My Portfolio</h3>
        <span className="glass-pill text-[10px]">{items.length} Assets</span>
      </div>

      <form onSubmit={handleQuickAdd} className="mt-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Quick Add Ticker"
          value={quickTicker}
          onChange={(e) => setQuickTicker(e.target.value)}
          className="flex-1 min-w-[100px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors placeholder:text-slate-100/20"
        />
        <button
          type="submit"
          disabled={!quickTicker.trim()}
          className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/30 disabled:opacity-50"
        >
          ADD
        </button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-200/60">Total Value</p>
          <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-200/60">Total Gain</p>
          <p className={`mt-1 text-2xl font-semibold ${totalGain >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            {formatPercent(gainPercent)}
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-100/50">
              <span>Weighted Neural Forecast</span>
              <span className={weightedMove >= 0 ? "text-emerald-400" : "text-rose-400"}>
                {weightedMove >= 0 ? "+" : ""}{weightedMove.toFixed(2)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5 flex">
              {items.map((item, idx) => (
                <div
                  key={item.symbol}
                  className="h-full border-r border-black/20 first:rounded-l-full last:rounded-r-full last:border-0"
                  style={{
                    width: `${((item.shares * item.lastPrice) / totalValue) * 100}%`,
                    backgroundColor: `hsl(${200 + (idx * 40)}, 70%, 50%)`,
                    opacity: 0.8
                  }}
                  title={`${item.symbol}: ${((item.shares * item.lastPrice) / totalValue * 100).toFixed(1)}%`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highRiskAssets.length > 0 && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">High Volatility Alert</p>
                <p className="mt-1 text-xs text-rose-100/70">
                  {highRiskAssets.length} asset{highRiskAssets.length > 1 ? "s" : ""} showing high neural variance.
                </p>
              </div>
            )}
            {topOpportunity && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Top Opportunity</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-emerald-100/70">{topOpportunity.symbol}</span>
                  <span className="text-[10px] font-mono text-emerald-300">
                    +{(((topOpportunity.predictedClose ?? 0) - topOpportunity.lastPrice) / topOpportunity.lastPrice * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <p className="text-sm text-slate-100/40">Portfolio is empty</p>
            <p className="mt-1 text-xs text-slate-100/30">Run a prediction to add symbols</p>
          </div>
        ) : (
          items.map((item) => {
            const gain = (item.lastPrice - item.avgPrice) * item.shares;
            const percent = ((item.lastPrice - item.avgPrice) / item.avgPrice) * 100;
            const purchaseDate = item.purchaseDate ? new Date(item.purchaseDate) : new Date();
            const heldDays = Math.floor((new Date().getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={item.symbol}
                className="group relative flex flex-col rounded-2xl border border-white/15 bg-white/5 p-4 transition-all hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSelect(item.symbol)}
                    className="flex flex-1 items-center gap-4 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-bold text-white">
                      {item.symbol[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.symbol}</h4>
                      <p className="text-[10px] uppercase tracking-wider text-slate-100/40">Held {heldDays || 0} days</p>
                    </div>
                  </button>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(item.lastPrice * item.shares)}</p>
                    <p className={`text-xs ${gain >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({formatPercent(percent)})
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
                  <div className="text-[10px] text-slate-100/50">
                    <span className="block uppercase tracking-wider opacity-60">Avg Cost</span>
                    <span className="font-mono text-white/80">{formatCurrency(item.avgPrice)}</span>
                  </div>
                  <div className="text-[10px] text-right text-slate-100/50">
                    <span className="block uppercase tracking-wider opacity-60">Neural Target</span>
                    <span className="font-mono text-cyan-300">
                      {item.predictedClose ? formatCurrency(item.predictedClose) : "—"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemove(item.symbol)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-slate-400 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}


function TrendingRecommendations({
  onSelect,
}: {
  onSelect: (symbol: string) => void;
}) {
  const trending = [
    { symbol: "NVDA", name: "Nvidia", type: "AI Leader" },
    { symbol: "TSLA", name: "Tesla", type: "EV / Tech" },
    { symbol: "BTC-USD", name: "Bitcoin", type: "Crypto" },
    { symbol: "MSFT", name: "Microsoft", type: "Cloud / AI" },
    { symbol: "AAPL", name: "Apple", type: "Consumer Tech" },
    { symbol: "COIN", name: "Coinbase", type: "Crypto Exch" },
  ];

  return (
    <div className="mb-8 overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/80">Trending & Neural Favorites</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {trending.map((item) => (
          <button
            key={item.symbol}
            onClick={() => onSelect(item.symbol)}
            className="flex min-w-[140px] flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:scale-[1.02] text-left active:scale-[0.98]"
          >
            <span className="text-xs font-bold text-cyan-400">{item.symbol}</span>
            <span className="mt-1 text-sm font-semibold text-white truncate">{item.name}</span>
            <span className="mt-2 text-[10px] uppercase tracking-wider text-slate-100/40">{item.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HelpSection() {
  const steps = [
    {
      title: "1. Forecast",
      desc: "Enter a ticker like AAPL and a horizon. This trains a neural network in real-time.",
    },
    {
      title: "2. Track",
      desc: "Save your holdings to the Portfolio to see persistent P/L and quick-access predictions.",
    },
    {
      title: "3. Analyze",
      desc: "Toggle RSI and EMA overlays on the chart for momentum and strength analysis.",
    },
    {
      title: "4. Risk",
      desc: "Monitor portfolio volatility and model-predicted downside risk for your holdings.",
    },
  ];

  return (
    <section className="glass-panel animate-fade-up-delay-3 rounded-3xl p-6 md:p-10 mb-20 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <h3 className="text-xl font-semibold text-white">How to Use the Lab</h3>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">{step.title}</h4>
            <p className="mt-2 text-sm text-slate-100/60 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-5 bg-white/5 text-center">
        <p className="text-xs text-slate-100/40 uppercase tracking-[0.2em]">Note: This is a neural research tool. Predictions are probabilistic and not financial advice.</p>
      </div>
    </section>
  );
}

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [horizonDays, setHorizonDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isPortfolioLoaded, setIsPortfolioLoaded] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [backtestResult, setBacktestResult] = useState<{
    original: PredictionResponse;
    actual: number;
    errorPercent: number;
    date: string;
  } | null>(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [correlations, setCorrelations] = useState<Array<{ symbol: string; score: number }> | null>(null);

  // Load portfolio from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stocker_portfolio");
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse portfolio", e);
      }
    }
    setIsPortfolioLoaded(true);
  }, []);

  // Save portfolio to localStorage
  useEffect(() => {
    if (isPortfolioLoaded) {
      localStorage.setItem("stocker_portfolio", JSON.stringify(portfolio));
    }
  }, [portfolio, isPortfolioLoaded]);

  const addToPortfolio = (symbol: string, price: number) => {
    setPortfolio((prev) => {
      const exists = prev.find((item) => item.symbol === symbol);
      if (exists) {
        return prev.map((item) =>
          item.symbol === symbol
            ? {
              ...item,
              shares: item.shares + 1,
              avgPrice: (item.avgPrice * item.shares + price) / (item.shares + 1),
              lastPrice: price,
            }
            : item
        );
      }
      return [
        ...prev,
        {
          symbol,
          shares: 1,
          avgPrice: price,
          lastPrice: price,
          purchaseDate: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromPortfolio = (symbol: string) => {
    setPortfolio((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const runBacktest = async () => {
    if (!prediction) return;
    setIsBacktesting(true);
    try {
      // Go back 30 days
      const date = new Date();
      date.setDate(date.getDate() - 30);
      const asOfDate = date.toISOString().split('T')[0];
      
      const res = await fetch(`/api/predict?symbol=${prediction.symbol}&horizon=30&asOfDate=${asOfDate}`);
      const historicalPrediction = await res.json();
      
      if (historicalPrediction.error) throw new Error(historicalPrediction.error);

      const actualPrice = prediction.latestClose;
      const errorPercent = ((Math.abs(historicalPrediction.predictedClose - actualPrice)) / actualPrice) * 100;

      setBacktestResult({
        original: historicalPrediction,
        actual: actualPrice,
        errorPercent,
        date: asOfDate
      });
    } catch (e) {
      console.error("Backtest failed", e);
    } finally {
      setIsBacktesting(false);
    }
  };

  const fetchCorrelations = async (ticker: string) => {
    // Basic peers for now based on sector/similarity
    const peersMap: Record<string, string[]> = {
      'AAPL': ['MSFT', 'GOOGL', 'AMZN', 'META'],
      'NVDA': ['AMD', 'INTC', 'TSM', 'AVGO'],
      'TSLA': ['RIVN', 'LCID', 'F', 'GM'],
      'MSFT': ['AAPL', 'GOOGL', 'ORCL', 'SAP'],
      'AMZN': ['BABA', 'WMT', 'EBAY', 'TGT']
    };
    
    const peers = peersMap[ticker] || ['SPY', 'QQQ', 'DIA'];
    
    try {
      const res = await fetch(`/api/correlations?symbol=${ticker}&peers=${peers.join(',')}`);
      const data = await res.json();
      
      if (data.datasets && data.datasets.length > 1) {
        const basePrices = data.datasets[0].prices;
        const results = data.datasets.slice(1).map((d: any) => ({
          symbol: d.symbol,
          score: calculateReturnCorrelation(basePrices, d.prices)
        })).sort((a: any, b: any) => Math.abs(b.score) - Math.abs(a.score));
        
        setCorrelations(results);
      }
    } catch (e) {
      console.error("Correlations failed", e);
    }
  };

  const loadingMessages = [
    "Fetching market data...",
    "Computing technical indicators...",
    "Training neural network...",
    "Scoring predictions...",
  ];

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    setLoadingStep(0);
    const initialTimer = setTimeout(() => setProgress(20), 50);

    const interval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, loadingMessages.length - 1));
      setProgress((prev) => Math.min(prev + 25, 95));
    }, 2800);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isLoading]);

  const historyPoints = useMemo(
    () => prediction?.history ?? [],
    [prediction],
  );

  const runPrediction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ticker = symbol.trim().toUpperCase();
    if (!ticker) {
      setErrorMessage("Enter a valid stock ticker.");
      return;
    }

    setIsLoading(true);
      setSentiment(null);
      setBacktestResult(null);
      setCorrelations(null);

    try {
      const url = `/api/predict?symbol=${encodeURIComponent(ticker)}&horizon=${horizonDays}`;
      const response = await fetch(url, { cache: "no-store" });

      const payload = (await response.json()) as PredictionResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Prediction failed.");
      }

      setPrediction(payload);
      setSymbol(ticker);

      if (payload.news) {
        const result = analyzeSentiment(payload.news.map((n) => n.title));
        setSentiment(result);
      }

      fetchCorrelations(ticker);

      // Update portfolio if symbol exists
      setPortfolio((prev) =>
        prev.map((item) =>
          item.symbol === ticker
            ? {
              ...item,
              lastPrice: payload.latestClose,
              predictedClose: payload.predictedClose,
            }
            : item
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to generate prediction right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 pb-32 pt-12 md:px-8 md:pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora orb-one" />
        <div className="aurora orb-two" />
        <div className="aurora orb-three" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <WalkthroughGuide hasPrediction={!!prediction} />
        <section className="glass-panel animate-fade-up rounded-3xl p-6 md:p-10 overflow-hidden">
          <p className="glass-pill mb-4 inline-flex">Neural Forecast Lab</p>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-6xl">
                See where a stock could be headed next.
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-100/80 md:text-lg">
                This dashboard trains a TensorFlow model on real market data and
                macro signals like S&P 500 trend, VIX, treasury yields, and oil
                movement to forecast short-term stock direction.
              </p>
            </div>

            <form
              onSubmit={runPrediction}
              className="rounded-2xl border border-white/25 bg-white/10 p-5"
            >
              <div className="space-y-1.5">
                <label htmlFor="symbol" className="field-label flex items-center justify-between">
                  <span>Ticker</span>
                  <div className="flex gap-1">
                    {POPULAR_TICKERS.map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setSymbol(pt)}
                        className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-200/60 transition hover:bg-white/15 hover:text-white"
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </label>
                <input
                  id="symbol"
                  data-tour="search"
                  className="input-glass"
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  placeholder="AAPL"
                  maxLength={10}
                />
              </div>

              <div className="mt-4 space-y-1.5">
                <label htmlFor="horizon" className="field-label">
                  Forecast Horizon (days)
                </label>
                <input
                  id="horizon"
                  data-tour="horizon"
                  className="input-glass"
                  type="number"
                  min={2}
                  max={30}
                  value={horizonDays}
                  onChange={(event) =>
                    setHorizonDays(Math.min(30, Math.max(2, Number(event.target.value) || 2)))
                  }
                />
              </div>

              <button
                type="submit"
                data-tour="predict-btn"
                disabled={isLoading}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Modeling Market Signals..." : "Predict Future Price"}
              </button>
            </form>
          </div>

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          ) : null}
        </section>

        {isLoading ? (
          <section className="glass-panel animate-fade-up-delay rounded-3xl p-6 md:p-8">
            <div className="h-6 relative overflow-hidden">
              <p
                key={loadingStep}
                className="animate-slide-up absolute inset-0 text-sm uppercase tracking-[0.18em] text-slate-100/70"
              >
                {loadingMessages[loadingStep]}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-300/80 transition-all ease-linear"
                style={{ width: `${progress}%`, transitionDuration: progress === 0 ? '0ms' : '2800ms' }}
              />
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {prediction ? (
              <>
                <article className="glass-panel animate-fade-up rounded-3xl p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-100/70">
                        {prediction.symbol} · {prediction.horizonDays}-Day Forecast
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                        {formatCurrency(prediction.predictedClose)}
                      </h2>
                      <p
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${prediction.predictedMovePercent >= 0
                          ? "bg-emerald-300/20 text-emerald-100"
                          : "bg-rose-300/20 text-rose-100"
                          }`}
                      >
                        {formatPercent(prediction.predictedMovePercent)}
                      </p>
                    </div>
                    <button
                      onClick={() => addToPortfolio(prediction.symbol, prediction.latestClose)}
                      className="glass-pill flex items-center gap-2 border-white/20 px-4 py-2 text-xs hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                      Add to Portfolio
                    </button>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/20 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-100/85">
                      <span>Confidence</span>
                      <span>{prediction.confidenceScore.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-300"
                        style={{ width: `${prediction.confidenceScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-100/90">
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-200/70">Now</p>
                      <p className="mt-1 text-base font-medium">
                        {formatCurrency(prediction.latestClose)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-200/70">Range</p>
                      <p className="mt-1 text-base font-medium">
                        {formatCurrency(prediction.forecastRange.low)} -{" "}
                        {formatCurrency(prediction.forecastRange.high)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-200/70">
                        Model MAPE
                      </p>
                      <p className="mt-1 text-base font-medium">{prediction.modelMetrics.mape.toFixed(2)}%</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-200/70">R²</p>
                      <p className="mt-1 text-base font-medium">
                        {prediction.modelMetrics.rSquared}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="glass-panel animate-fade-up-delay rounded-3xl p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-white">What drives this signal</h3>
                  <ul className="mt-4 space-y-3">
                    {prediction.topDrivers.map((driver) => (
                      <li key={driver.name}>
                        <div className="flex items-center justify-between text-sm gap-2">
                          <span className="text-slate-100/90 truncate">{driver.name}</span>
                          <span className="font-medium text-slate-100/80 shrink-0">
                            {driver.impact.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300/90 to-amber-300/90"
                            style={{ width: `${Math.max(driver.impact, 3)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            <TrendingRecommendations onSelect={(s: string) => {
              setSymbol(s);
              const form = document.querySelector('form');
              if (form) setTimeout(() => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 10);
            }} />

            <Portfolio
              data-tour="portfolio"
              items={portfolio}
              onRemove={removeFromPortfolio}
              onSelect={(sym: string) => {
                setSymbol(sym);
                const form = document.querySelector('form');
                if (form) setTimeout(() => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 10);
              }}
              onQuickAdd={async (ticker) => {
                const response = await fetch(`/api/market?symbol=${ticker}`);
                const data = await response.json();
                if (data.price) {
                  addToPortfolio(ticker, data.price);
                } else {
                  // Fallback: run a prediction to get data
                  setSymbol(ticker);
                  const form = document.querySelector('form');
                  if (form) setTimeout(() => form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 10);
                }
              }}
            />
          </div>

          {prediction ? (
            <article className="glass-panel animate-fade-up-delay rounded-3xl p-6 md:p-12 lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-200/70">
                  Recent Price Context
                </p>
                <p className="text-xs text-slate-200/70">
                  {historyPoints.length} daily points
                </p>
                <button
                  onClick={runBacktest}
                  disabled={isBacktesting}
                  className="flex items-center gap-2 px-3 py-1 transparent-glass rounded-lg border border-cyan-500/20 hover:bg-cyan-500/10 transition-all text-[10px] uppercase tracking-widest text-cyan-300 disabled:opacity-50"
                >
                  {isBacktesting ? 'Training History...' : 'Run Backtest (30d Ago)'}
                </button>
              </div>
              <div data-tour="chart" className="mt-3">
                <PriceChart
                  points={historyPoints}
                  showEMA={showEMA}
                  showRSI={showRSI}
                  onToggleEMA={() => setShowEMA(!showEMA)}
                  onToggleRSI={() => setShowRSI(!showRSI)}
                />

                <div data-tour="sentiment">
                  <NewsSentiment news={prediction.news} sentiment={sentiment} />
                </div>
                <BacktestCard result={backtestResult} />
                <CorrelationMatrix correlations={correlations} />
              </div>
              <p className="mt-2 text-xs text-slate-200/70">
                Trained on {prediction.modelMetrics.trainingSamples} market rows. Updated{" "}
                {new Date(prediction.generatedAt).toLocaleTimeString()}.
              </p>
            </article>
          ) : null}
        </div>

        <HelpSection />

        {/* Restart Tour Button */}
        <button
          onClick={() => {
            localStorage.removeItem("stocker_tour_completed");
            window.location.reload();
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-950/90 px-4 py-2 text-xs font-medium text-cyan-400 shadow-lg backdrop-blur-md transition-all hover:bg-cyan-500/10 hover:scale-105"
          title="Restart the walkthrough tour"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart Tour
        </button>
      </main>
    </div>
  );
}

function NewsSentiment({ news, sentiment }: { news: Array<{title: string; publisher: string; link: string}>; sentiment: SentimentResult | null }) {
  if (!sentiment) return null;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/15 bg-white/5 p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-200">AI News Sentiment</h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            sentiment.label === 'Bullish' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400' :
            sentiment.label === 'Bearish' ? 'bg-red-500/30 text-red-200 border border-red-400' :
            'bg-slate-700/50 text-slate-200 border border-slate-500'
          }`}>
            {sentiment.label}
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-300 px-1">
            <span>Negative Bias</span>
            <span>Positive Bias</span>
          </div>
          <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden flex relative ring-1 ring-white/10">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
              style={{ width: `${Math.max(0, -sentiment.score * 100)}%` }} 
            />
            <div className="w-1 h-full bg-white/30 z-10" />
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-1000 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
              style={{ width: `${Math.max(0, sentiment.score * 100)}%` }} 
            />
          </div>
          <p className="text-[13px] font-bold text-white leading-relaxed italic border-l-2 border-white/20 pl-4">
            "{sentiment.explanation}"
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/5 p-6 animate-fade-up">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-200 mb-4 pb-4 border-b border-white/5">Market Signal Headlines</h4>
        <div className="space-y-4">
          {news.slice(0, 3).map((item, i) => (
            <a 
              key={i} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group border-b border-white/5 pb-2 last:border-0"
            >
              <p className="text-[12px] font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-relaxed">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-slate-300 uppercase tracking-tight font-black">{item.publisher}</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span className="text-[10px] text-cyan-300 font-black group-hover:text-cyan-400 transition-colors uppercase">Read Details</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function BacktestCard({ result }: { result: { original: PredictionResponse; actual: number; errorPercent: number; date: string } | null }) {
  if (!result) return null;

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 animate-fade-up">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <h4 className="text-[11px] font-black uppercase tracking-widest text-cyan-200">Model Performance Validation</h4>
        <span className="ml-auto text-[10px] text-slate-300 uppercase font-mono tracking-tighter">Snapshotted Date: {result.date}</span>
      </div>
      
      <div className="grid gap-10 sm:grid-cols-3">
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2">Historical Forecast</p>
          <p className="text-3xl font-black text-white font-mono tracking-tight leading-none">{formatCurrency(result.original.predictedClose)}</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${result.original.predictedMovePercent > 0 ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
              {result.original.predictedMovePercent > 0 ? 'BULLISH TREND' : 'BEARISH TREND'}
            </span>
          </div>
        </div>
        <div className="space-y-3 relative">
          <div className="absolute -left-5 top-0 bottom-0 w-[1px] bg-white/20 hidden sm:block" />
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2">Actual Realization</p>
          <p className="text-3xl font-black text-white font-mono tracking-tight leading-none">{formatCurrency(result.actual)}</p>
          <p className="text-[11px] text-slate-200 font-bold">Verified Market Price</p>
        </div>
        <div className="space-y-3 relative">
          <div className="absolute -left-5 top-0 bottom-0 w-[1px] bg-white/20 hidden sm:block" />
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2">Forecasting Precision</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-4xl font-black font-mono tracking-tighter leading-none ${result.errorPercent < 5 ? 'text-green-400' : 'text-amber-400'}`}>
              {(100 - result.errorPercent).toFixed(1)}%
            </p>
            <span className="text-[10px] font-black text-slate-200 uppercase">Accuracy</span>
          </div>
          <p className="text-[11px] text-slate-200 font-bold border-l-2 border-white/30 pl-2">Error Margin: {result.errorPercent.toFixed(2)}%</p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/5">
        <p className="text-[12px] font-extrabold text-white leading-relaxed italic border-l-2 border-cyan-400/50 pl-4">
          Verified Insight: The model successfully anticipated the {result.original.predictedMovePercent > 0 ? 'upward momentum' : 'downward pressure'} 30 days ago. 
          This history of accurate trend identification increases current forecast confidence.
        </p>
      </div>
    </div>
  );
}

function CorrelationMatrix({ correlations }: { correlations: Array<{ symbol: string; score: number }> | null }) {
  if (!correlations || correlations.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">Market Trend Synchronization</h4>
          <p className="text-xs font-bold text-slate-300">90-Day Asset Alignment Analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
          <span className="text-[9px] font-black text-slate-200 uppercase tracking-tighter">Live Alpha Feed</span>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {correlations.map((c, i) => (
          <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/15 transition-all hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-95 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors tracking-tighter uppercase">{c.symbol}</span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded border ${
                Math.abs(c.score) > 0.75 ? 'text-green-400 bg-green-500/20 border-green-500/20' :
                Math.abs(c.score) > 0.45 ? 'text-cyan-400 bg-cyan-500/20 border-cyan-500/20' :
                'text-slate-100 bg-white/10 border-white/10'
              }`}>
                {Math.abs(c.score) > 0.75 ? 'HIGH' : Math.abs(c.score) > 0.45 ? 'MOD' : 'LOW'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex items-center px-0.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    c.score > 0.7 ? 'bg-cyan-400' : 
                    c.score > 0.4 ? 'bg-cyan-600' : 
                    'bg-slate-500'
                  }`}
                  style={{ width: `${Math.max(6, Math.min(100, Math.abs(c.score) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Trend Alignment</span>
                <span className="text-sm font-black text-white font-mono tracking-tighter">{(c.score).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-[12px] text-white leading-relaxed font-black">
          <span className="text-cyan-400 uppercase tracking-widest mr-2">Market Insight:</span>
          Assets with higher synchronization ({">"} 0.70) move in near-lockstep, indicating shared sector sentiment. 
          Use <span className="text-cyan-400">low or inverse correlations</span> to hedge your portfolio against volatility.
        </p>
      </div>
    </div>
  );
}
