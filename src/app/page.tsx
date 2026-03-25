"use client";

import { FormEvent, useEffect, useId, useMemo, useState } from "react";

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

  const emaData = calculateEMA(closes, 12);
  const emaPath = emaData.reduce((path, value, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${toX(index)} ${toY(value)}`.trim();
  }, "");

  const rsiData = calculateRSI(closes, 14);
  const toRsiY = (val: number) => padding.top + plotHeight - (val / 100) * (plotHeight * 0.3); // Scale RSI to bottom 30%
  const rsiPath = rsiData.reduce((path, value, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${toX(index)} ${toRsiY(value)}`.trim();
  }, "");

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
}: {
  items: PortfolioItem[];
  onRemove: (symbol: string) => void;
  onSelect: (symbol: string) => void;
  onQuickAdd: (symbol: string) => void;
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
    <article className="glass-panel animate-fade-up rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">My Portfolio</h3>
        <span className="glass-pill text-[10px]">{items.length} Assets</span>
      </div>

      <form onSubmit={handleQuickAdd} className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Quick Add Ticker (e.g. NVDA)"
          value={quickTicker}
          onChange={(e) => setQuickTicker(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors placeholder:text-slate-100/20"
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
    <div className="mb-8">
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
    <section className="glass-panel animate-fade-up-delay-3 rounded-3xl p-6 md:p-10 mb-20">
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
    setErrorMessage("");

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
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora orb-one" />
        <div className="aurora orb-two" />
        <div className="aurora orb-three" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="glass-panel animate-fade-up rounded-3xl p-6 md:p-10">
          <p className="glass-pill mb-4 inline-flex">Neural Forecast Lab</p>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                See where a stock could be headed next.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-100/80 md:text-lg">
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
                      <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
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

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-100/90">
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
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-100/90">{driver.name}</span>
                          <span className="font-medium text-slate-100/80">
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
            <article className="glass-panel animate-fade-up-delay rounded-3xl p-8 md:p-12 lg:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-200/70">
                  Recent Price Context
                </p>
                <p className="text-xs text-slate-200/70">
                  {historyPoints.length} daily points
                </p>
              </div>
              <div className="mt-3">
                <PriceChart
                  points={historyPoints}
                  showEMA={showEMA}
                  showRSI={showRSI}
                  onToggleEMA={() => setShowEMA(!showEMA)}
                  onToggleRSI={() => setShowRSI(!showRSI)}
                />
              </div>
              <p className="mt-2 text-xs text-slate-200/70">
                Trained on {prediction.modelMetrics.trainingSamples} market rows. Updated{" "}
                {new Date(prediction.generatedAt).toLocaleTimeString()}.
              </p>
            </article>
          ) : null}
        </div>

        <HelpSection />
      </main>
    </div>
  );
}
