(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/sentiment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeSentiment",
    ()=>analyzeSentiment
]);
const BULLISH_WORDS = [
    "upgraded",
    "surpasses",
    "growth",
    "buy",
    "outperform",
    "bullish",
    "profit",
    "beats",
    "innovation",
    "strong",
    "expansion",
    "positive",
    "momentum",
    "partnership",
    "breakthrough",
    "acquisition",
    "dividend",
    "yield",
    "soars",
    "jumps"
];
const BEARISH_WORDS = [
    "downgraded",
    "misses",
    "losses",
    "sell",
    "underperform",
    "bearish",
    "debt",
    "decline",
    "negative",
    "litigation",
    "lawsuit",
    "slumps",
    "plunges",
    "warning",
    "inflation",
    "risk",
    "recession",
    "uncertainty",
    "layoffs",
    "shuts"
];
function analyzeSentiment(headlines) {
    if (headlines.length === 0) {
        return {
            score: 0,
            label: "Neutral",
            explanation: "No recent news available for analysis."
        };
    }
    let bullishCount = 0;
    let bearishCount = 0;
    const combinedText = headlines.join(" ").toLowerCase();
    BULLISH_WORDS.forEach((word)=>{
        const regex = new RegExp(`\\b${word}\\b`, "g");
        const matches = combinedText.match(regex);
        if (matches) bullishCount += matches.length;
    });
    BEARISH_WORDS.forEach((word)=>{
        const regex = new RegExp(`\\b${word}\\b`, "g");
        const matches = combinedText.match(regex);
        if (matches) bearishCount += matches.length;
    });
    const total = bullishCount + bearishCount;
    if (total === 0) {
        return {
            score: 0,
            label: "Neutral",
            explanation: "Headlines are neutral or lack clear sentiment drivers."
        };
    }
    const score = (bullishCount - bearishCount) / total;
    let label = "Neutral";
    if (score > 0.2) label = "Bullish";
    if (score < -0.2) label = "Bearish";
    const explanation = `Found ${bullishCount} bullish and ${bearishCount} bearish signals in recent headlines.`;
    return {
        score,
        label,
        explanation
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/correlation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Calculates the Pearson correlation coefficient between two numeric series.
 * Returns a value between -1 and 1.
 */ __turbopack_context__.s([
    "calculateCorrelation",
    ()=>calculateCorrelation,
    "calculateReturnCorrelation",
    ()=>calculateReturnCorrelation
]);
function calculateCorrelation(seriesA, seriesB) {
    if (seriesA.length !== seriesB.length || seriesA.length < 2) {
        return 0;
    }
    const n = seriesA.length;
    let sumA = 0;
    let sumB = 0;
    let sumA2 = 0;
    let sumB2 = 0;
    let sumAB = 0;
    for(let i = 0; i < n; i++){
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
function calculateReturnCorrelation(pricesA, pricesB) {
    const returnsA = pricesA.slice(1).map((p, i)=>(p - pricesA[i]) / pricesA[i]);
    const returnsB = pricesB.slice(1).map((p, i)=>(p - pricesB[i]) / pricesB[i]);
    return calculateCorrelation(returnsA, returnsB);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sentiment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sentiment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$correlation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/correlation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const POPULAR_TICKERS = [
    "AAPL",
    "NVDA",
    "TSLA",
    "MSFT",
    "AMZN"
];
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
    }).format(value);
}
function formatPercent(value) {
    const signedValue = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
    return `${signedValue}%`;
}
function formatChartDate(value) {
    const date = new Date(`${value}T00:00:00Z`);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric"
    }).format(date);
}
function calculateEMA(data, period) {
    const ema = [];
    const k = 2 / (period + 1);
    let prevEma = data[0];
    ema.push(prevEma);
    for(let i = 1; i < data.length; i++){
        const val = data[i] * k + prevEma * (1 - k);
        ema.push(val);
        prevEma = val;
    }
    return ema;
}
function calculateRSI(data, period) {
    const rsi = [];
    let gains = 0;
    let losses = 0;
    for(let i = 1; i <= period; i++){
        const diff = data[i] - data[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    for(let i = 0; i < period; i++)rsi.push(50); // Padding
    for(let i = period; i < data.length; i++){
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
function average(values) {
    if (values.length === 0) {
        return 0;
    }
    return values.reduce((sum, value)=>sum + value, 0) / values.length;
}
function PriceChart(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(214);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 214; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    const { points, showEMA: t1, showRSI: t2, onToggleEMA, onToggleRSI } = t0;
    const showEMA = t1 === undefined ? false : t1;
    const showRSI = t2 === undefined ? false : t2;
    const [rangeDays, setRangeDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(60);
    const [hoverIndex, setHoverIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    let t4;
    if ($[1] !== t3) {
        let t5;
        if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = /:/g;
            $[3] = t5;
        } else {
            t5 = $[3];
        }
        t4 = t3.replace(t5, "");
        $[1] = t3;
        $[2] = t4;
    } else {
        t4 = $[2];
    }
    const chartId = t4;
    let t5;
    if ($[4] !== points || $[5] !== rangeDays) {
        t5 = points.slice(-Math.min(rangeDays, points.length));
        $[4] = points;
        $[5] = rangeDays;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    const displayedPoints = t5;
    let t6;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = {
            top: 32,
            right: 42,
            bottom: 64,
            left: 72
        };
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    const padding = t6;
    if (displayedPoints.length < 2) {
        let t7;
        if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-white/15 bg-black/20 px-4 py-7 text-sm text-slate-100/70",
                children: "Not enough history for detailed chart rendering."
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 178,
                columnNumber: 12
            }, this);
            $[8] = t7;
        } else {
            t7 = $[8];
        }
        return t7;
    }
    const plotWidth = 1400 - padding.left - padding.right;
    const plotHeight = 480 - padding.top - padding.bottom;
    let areaPath;
    let emaPath;
    let linePath;
    let movingAveragePath;
    let t7;
    let toRsiY;
    let toX;
    let toY;
    let yMax;
    let ySpan;
    if ($[9] !== displayedPoints) {
        const closes = displayedPoints.map(_PriceChartDisplayedPointsMap);
        const minClose = Math.min(...closes);
        const maxClose = Math.max(...closes);
        const yPadding = Math.max((maxClose - minClose) * 0.12, 0.75);
        const yMin = minClose - yPadding;
        yMax = maxClose + yPadding;
        ySpan = Math.max(yMax - yMin, 1);
        let t8;
        if ($[20] !== displayedPoints.length) {
            t8 = ({
                "PriceChart[toX]": (index)=>padding.left + index / (displayedPoints.length - 1) * plotWidth
            })["PriceChart[toX]"];
            $[20] = displayedPoints.length;
            $[21] = t8;
        } else {
            t8 = $[21];
        }
        toX = t8;
        let t9;
        if ($[22] !== yMax || $[23] !== ySpan) {
            t9 = ({
                "PriceChart[toY]": (value)=>padding.top + (yMax - value) / ySpan * plotHeight
            })["PriceChart[toY]"];
            $[22] = yMax;
            $[23] = ySpan;
            $[24] = t9;
        } else {
            t9 = $[24];
        }
        toY = t9;
        let t10;
        if ($[25] !== displayedPoints || $[26] !== toX || $[27] !== toY) {
            let t11;
            if ($[29] !== toX || $[30] !== toY) {
                t11 = ({
                    "PriceChart[displayedPoints.map()]": (point_0, index_0)=>`${index_0 === 0 ? "M" : "L"} ${toX(index_0)} ${toY(point_0.close)}`
                })["PriceChart[displayedPoints.map()]"];
                $[29] = toX;
                $[30] = toY;
                $[31] = t11;
            } else {
                t11 = $[31];
            }
            t10 = displayedPoints.map(t11).join(" ");
            $[25] = displayedPoints;
            $[26] = toX;
            $[27] = toY;
            $[28] = t10;
        } else {
            t10 = $[28];
        }
        linePath = t10;
        areaPath = `${linePath} L ${toX(displayedPoints.length - 1)} ${padding.top + plotHeight} L ${toX(0)} ${padding.top + plotHeight} Z`;
        const movingAveragePeriod = Math.min(7, Math.max(2, Math.floor(displayedPoints.length / 4)));
        let t11;
        if ($[32] !== displayedPoints || $[33] !== movingAveragePeriod || $[34] !== toX || $[35] !== toY) {
            let t12;
            if ($[37] !== displayedPoints || $[38] !== movingAveragePeriod) {
                t12 = ({
                    "PriceChart[displayedPoints.map()]": (_, index_1)=>{
                        if (index_1 + 1 < movingAveragePeriod) {
                            return null;
                        }
                        const windowValues = displayedPoints.slice(index_1 - movingAveragePeriod + 1, index_1 + 1).map(_PriceChartDisplayedPointsMapAnonymous);
                        return average(windowValues);
                    }
                })["PriceChart[displayedPoints.map()]"];
                $[37] = displayedPoints;
                $[38] = movingAveragePeriod;
                $[39] = t12;
            } else {
                t12 = $[39];
            }
            const movingAverage = displayedPoints.map(t12);
            let t13;
            if ($[40] !== toX || $[41] !== toY) {
                t13 = ({
                    "PriceChart[movingAverage.reduce()]": (path, value_0, index_2)=>{
                        if (value_0 === null) {
                            return path;
                        }
                        const command = path.length === 0 ? "M" : "L";
                        return `${path} ${command} ${toX(index_2)} ${toY(value_0)}`.trim();
                    }
                })["PriceChart[movingAverage.reduce()]"];
                $[40] = toX;
                $[41] = toY;
                $[42] = t13;
            } else {
                t13 = $[42];
            }
            t11 = movingAverage.reduce(t13, "");
            $[32] = displayedPoints;
            $[33] = movingAveragePeriod;
            $[34] = toX;
            $[35] = toY;
            $[36] = t11;
        } else {
            t11 = $[36];
        }
        movingAveragePath = t11;
        const emaData = calculateEMA(closes, 12);
        let t12;
        if ($[43] !== toX || $[44] !== toY) {
            t12 = ({
                "PriceChart[emaData.reduce()]": (path_0, value_1, index_3)=>{
                    const command_0 = index_3 === 0 ? "M" : "L";
                    return `${path_0} ${command_0} ${toX(index_3)} ${toY(value_1)}`.trim();
                }
            })["PriceChart[emaData.reduce()]"];
            $[43] = toX;
            $[44] = toY;
            $[45] = t12;
        } else {
            t12 = $[45];
        }
        emaPath = emaData.reduce(t12, "");
        const rsiData = calculateRSI(closes, 14);
        let t13;
        if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
            t13 = ({
                "PriceChart[toRsiY]": (val)=>padding.top + plotHeight - val / 100 * (plotHeight * 0.3)
            })["PriceChart[toRsiY]"];
            $[46] = t13;
        } else {
            t13 = $[46];
        }
        toRsiY = t13;
        let t14;
        if ($[47] !== toX) {
            t14 = ({
                "PriceChart[rsiData.reduce()]": (path_1, value_2, index_4)=>{
                    const command_1 = index_4 === 0 ? "M" : "L";
                    return `${path_1} ${command_1} ${toX(index_4)} ${toRsiY(value_2)}`.trim();
                }
            })["PriceChart[rsiData.reduce()]"];
            $[47] = toX;
            $[48] = t14;
        } else {
            t14 = $[48];
        }
        t7 = rsiData.reduce(t14, "");
        $[9] = displayedPoints;
        $[10] = areaPath;
        $[11] = emaPath;
        $[12] = linePath;
        $[13] = movingAveragePath;
        $[14] = t7;
        $[15] = toRsiY;
        $[16] = toX;
        $[17] = toY;
        $[18] = yMax;
        $[19] = ySpan;
    } else {
        areaPath = $[10];
        emaPath = $[11];
        linePath = $[12];
        movingAveragePath = $[13];
        t7 = $[14];
        toRsiY = $[15];
        toX = $[16];
        toY = $[17];
        yMax = $[18];
        ySpan = $[19];
    }
    const rsiPath = t7;
    let activePoint;
    let activeX;
    let activeY;
    let dailyMove;
    let rangeMove;
    let t10;
    let t11;
    let t12;
    let t13;
    let t14;
    let t15;
    let t16;
    let t17;
    let t18;
    let t19;
    let t20;
    let t21;
    let t8;
    let t9;
    if ($[49] !== chartId || $[50] !== displayedPoints || $[51] !== hoverIndex || $[52] !== onToggleEMA || $[53] !== onToggleRSI || $[54] !== points.length || $[55] !== rangeDays || $[56] !== showEMA || $[57] !== showRSI || $[58] !== toX || $[59] !== toY || $[60] !== yMax || $[61] !== ySpan) {
        const yTicks = Array.from({
            length: 5
        }, {
            "PriceChart[Array.from()]": (__0, index_5)=>{
                const ratio = index_5 / 4;
                const value_3 = yMax - ratio * ySpan;
                const y = padding.top + ratio * plotHeight;
                return {
                    y,
                    value: value_3
                };
            }
        }["PriceChart[Array.from()]"]);
        const xTickIndexes = Array.from(new Set([
            0,
            Math.floor((displayedPoints.length - 1) / 3),
            Math.floor(2 * (displayedPoints.length - 1) / 3),
            displayedPoints.length - 1
        ]));
        let t22;
        if ($[81] !== displayedPoints.length) {
            t22 = ({
                "PriceChart[clampIndex]": (index_6)=>Math.min(displayedPoints.length - 1, Math.max(0, index_6))
            })["PriceChart[clampIndex]"];
            $[81] = displayedPoints.length;
            $[82] = t22;
        } else {
            t22 = $[82];
        }
        const clampIndex = t22;
        let t23;
        if ($[83] !== clampIndex || $[84] !== displayedPoints.length) {
            t23 = ({
                "PriceChart[updateHoverPosition]": (clientX, svgElement)=>{
                    const rect = svgElement.getBoundingClientRect();
                    const scaledX = (clientX - rect.left) / rect.width * 1400;
                    const chartX = Math.min(1400 - padding.right, Math.max(padding.left, scaledX));
                    const ratio_0 = (chartX - padding.left) / plotWidth;
                    const nextIndex = Math.round(ratio_0 * (displayedPoints.length - 1));
                    setHoverIndex(clampIndex(nextIndex));
                }
            })["PriceChart[updateHoverPosition]"];
            $[83] = clampIndex;
            $[84] = displayedPoints.length;
            $[85] = t23;
        } else {
            t23 = $[85];
        }
        const updateHoverPosition = t23;
        const activeIndex = hoverIndex ?? displayedPoints.length - 1;
        activePoint = displayedPoints[activeIndex];
        activeX = toX(activeIndex);
        activeY = toY(activePoint.close);
        const previousClose = activeIndex > 0 ? displayedPoints[activeIndex - 1].close : activePoint.close;
        dailyMove = previousClose === 0 ? 0 : (activePoint.close - previousClose) / previousClose * 100;
        rangeMove = displayedPoints[0].close === 0 ? 0 : (activePoint.close - displayedPoints[0].close) / displayedPoints[0].close * 100;
        let t24;
        if ($[86] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = [
                {
                    value: 30,
                    label: "30D"
                },
                {
                    value: 60,
                    label: "60D"
                },
                {
                    value: 90,
                    label: "90D"
                },
                {
                    value: 180,
                    label: "180D"
                }
            ];
            $[86] = t24;
        } else {
            t24 = $[86];
        }
        const rangeButtons = t24;
        const t25 = `${activeX / 1400 * 100}%`;
        let t26;
        if ($[87] !== t25) {
            t26 = {
                left: t25
            };
            $[87] = t25;
            $[88] = t26;
        } else {
            t26 = $[88];
        }
        const tooltipPosition = t26;
        const tooltipTransformClass = activeX > 1230 ? "-translate-x-full" : activeX < 170 ? "translate-x-0" : "-translate-x-1/2";
        t20 = "rounded-2xl border border-white/15 bg-black/25 p-3";
        let t27;
        if ($[89] === Symbol.for("react.memo_cache_sentinel")) {
            t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-[0.14em] text-slate-200/70",
                children: "Hover for point-level detail"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 471,
                columnNumber: 13
            }, this);
            $[89] = t27;
        } else {
            t27 = $[89];
        }
        let t28;
        if ($[90] !== points.length || $[91] !== rangeDays) {
            t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline-flex rounded-lg border border-white/15 bg-white/8 p-1",
                children: rangeButtons.map({
                    "PriceChart[rangeButtons.map()]": (button)=>{
                        const active = rangeDays === button.value;
                        const disabled = points.length < button.value;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: {
                                "PriceChart[rangeButtons.map() > <button>.onClick]": ()=>setRangeDays(button.value)
                            }["PriceChart[rangeButtons.map() > <button>.onClick]"],
                            disabled: disabled,
                            className: `rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] transition ${active ? "bg-white/25 text-white" : "text-slate-100/75 hover:bg-white/15 hover:text-white"} disabled:cursor-not-allowed disabled:opacity-45`,
                            children: button.label
                        }, button.value, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 482,
                            columnNumber: 20
                        }, this);
                    }
                }["PriceChart[rangeButtons.map()]"])
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 478,
                columnNumber: 13
            }, this);
            $[90] = points.length;
            $[91] = rangeDays;
            $[92] = t28;
        } else {
            t28 = $[92];
        }
        const t29 = `rounded-md border border-white/10 px-2 py-1 text-[10px] font-medium transition ${showEMA ? "bg-amber-300/20 text-amber-200 border-amber-300/30" : "bg-white/5 text-slate-400 hover:text-white"}`;
        let t30;
        if ($[93] !== onToggleEMA || $[94] !== t29) {
            t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onToggleEMA,
                className: t29,
                children: "EMA"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 496,
                columnNumber: 13
            }, this);
            $[93] = onToggleEMA;
            $[94] = t29;
            $[95] = t30;
        } else {
            t30 = $[95];
        }
        const t31 = `rounded-md border border-white/10 px-2 py-1 text-[10px] font-medium transition ${showRSI ? "bg-cyan-300/20 text-cyan-200 border-cyan-300/30" : "bg-white/5 text-slate-400 hover:text-white"}`;
        let t32;
        if ($[96] !== onToggleRSI || $[97] !== t31) {
            t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onToggleRSI,
                className: t31,
                children: "RSI"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 506,
                columnNumber: 13
            }, this);
            $[96] = onToggleRSI;
            $[97] = t31;
            $[98] = t32;
        } else {
            t32 = $[98];
        }
        let t33;
        if ($[99] !== t30 || $[100] !== t32) {
            t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1.5",
                children: [
                    t30,
                    t32
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 515,
                columnNumber: 13
            }, this);
            $[99] = t30;
            $[100] = t32;
            $[101] = t33;
        } else {
            t33 = $[101];
        }
        if ($[102] !== t28 || $[103] !== t33) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-center justify-between gap-2",
                children: [
                    t27,
                    t28,
                    t33
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 523,
                columnNumber: 13
            }, this);
            $[102] = t28;
            $[103] = t33;
            $[104] = t21;
        } else {
            t21 = $[104];
        }
        t18 = "relative overflow-hidden rounded-xl border border-white/12 bg-black/25";
        const t34 = `pointer-events-none absolute top-2 z-10 ${tooltipTransformClass}`;
        let t35;
        if ($[105] !== activePoint.date) {
            t35 = formatChartDate(activePoint.date);
            $[105] = activePoint.date;
            $[106] = t35;
        } else {
            t35 = $[106];
        }
        let t36;
        if ($[107] !== t35) {
            t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold text-white",
                children: t35
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 542,
                columnNumber: 13
            }, this);
            $[107] = t35;
            $[108] = t36;
        } else {
            t36 = $[108];
        }
        let t37;
        if ($[109] !== activePoint.close) {
            t37 = formatCurrency(activePoint.close);
            $[109] = activePoint.close;
            $[110] = t37;
        } else {
            t37 = $[110];
        }
        let t38;
        if ($[111] !== t37) {
            t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 text-slate-200",
                children: t37
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 558,
                columnNumber: 13
            }, this);
            $[111] = t37;
            $[112] = t38;
        } else {
            t38 = $[112];
        }
        const t39 = dailyMove >= 0 ? "text-emerald-300" : "text-rose-300";
        let t40;
        if ($[113] !== dailyMove) {
            t40 = formatPercent(dailyMove);
            $[113] = dailyMove;
            $[114] = t40;
        } else {
            t40 = $[114];
        }
        let t41;
        if ($[115] !== t39 || $[116] !== t40) {
            t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: t39,
                children: [
                    "1D ",
                    t40
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 575,
                columnNumber: 13
            }, this);
            $[115] = t39;
            $[116] = t40;
            $[117] = t41;
        } else {
            t41 = $[117];
        }
        let t42;
        if ($[118] !== t36 || $[119] !== t38 || $[120] !== t41) {
            t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-white/20 bg-slate-950/85 px-3 py-2 text-xs backdrop-blur-md",
                children: [
                    t36,
                    t38,
                    t41
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 584,
                columnNumber: 13
            }, this);
            $[118] = t36;
            $[119] = t38;
            $[120] = t41;
            $[121] = t42;
        } else {
            t42 = $[121];
        }
        if ($[122] !== t34 || $[123] !== t42 || $[124] !== tooltipPosition) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: tooltipPosition,
                className: t34,
                children: t42
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 593,
                columnNumber: 13
            }, this);
            $[122] = t34;
            $[123] = t42;
            $[124] = tooltipPosition;
            $[125] = t19;
        } else {
            t19 = $[125];
        }
        t8 = "0 0 1400 480";
        t9 = "h-64 w-full md:h-80 lg:h-[30rem]";
        if ($[126] !== updateHoverPosition) {
            t10 = ({
                "PriceChart[<svg>.onMouseMove]": (event)=>updateHoverPosition(event.clientX, event.currentTarget)
            })["PriceChart[<svg>.onMouseMove]"];
            $[126] = updateHoverPosition;
            $[127] = t10;
        } else {
            t10 = $[127];
        }
        if ($[128] === Symbol.for("react.memo_cache_sentinel")) {
            t11 = ({
                "PriceChart[<svg>.onMouseLeave]": ()=>setHoverIndex(null)
            })["PriceChart[<svg>.onMouseLeave]"];
            $[128] = t11;
        } else {
            t11 = $[128];
        }
        if ($[129] !== updateHoverPosition) {
            t12 = ({
                "PriceChart[<svg>.onTouchStart]": (event_0)=>updateHoverPosition(event_0.touches[0].clientX, event_0.currentTarget)
            })["PriceChart[<svg>.onTouchStart]"];
            t13 = ({
                "PriceChart[<svg>.onTouchMove]": (event_1)=>updateHoverPosition(event_1.touches[0].clientX, event_1.currentTarget)
            })["PriceChart[<svg>.onTouchMove]"];
            $[129] = updateHoverPosition;
            $[130] = t12;
            $[131] = t13;
        } else {
            t12 = $[130];
            t13 = $[131];
        }
        if ($[132] === Symbol.for("react.memo_cache_sentinel")) {
            t14 = ({
                "PriceChart[<svg>.onTouchEnd]": ()=>setHoverIndex(null)
            })["PriceChart[<svg>.onTouchEnd]"];
            $[132] = t14;
        } else {
            t14 = $[132];
        }
        const t43 = `${chartId}-line`;
        let t44;
        let t45;
        if ($[133] === Symbol.for("react.memo_cache_sentinel")) {
            t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                offset: "0%",
                stopColor: "#38dbc5"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 646,
                columnNumber: 13
            }, this);
            t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                offset: "100%",
                stopColor: "#ffbc78"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 647,
                columnNumber: 13
            }, this);
            $[133] = t44;
            $[134] = t45;
        } else {
            t44 = $[133];
            t45 = $[134];
        }
        let t46;
        if ($[135] !== t43) {
            t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                id: t43,
                x1: "0",
                y1: "0",
                x2: "1",
                y2: "0",
                children: [
                    t44,
                    t45
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 656,
                columnNumber: 13
            }, this);
            $[135] = t43;
            $[136] = t46;
        } else {
            t46 = $[136];
        }
        const t47 = `${chartId}-fill`;
        let t48;
        let t49;
        if ($[137] === Symbol.for("react.memo_cache_sentinel")) {
            t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                offset: "0%",
                stopColor: "rgba(56, 219, 197, 0.30)"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 666,
                columnNumber: 13
            }, this);
            t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                offset: "100%",
                stopColor: "rgba(56, 219, 197, 0.02)"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 667,
                columnNumber: 13
            }, this);
            $[137] = t48;
            $[138] = t49;
        } else {
            t48 = $[137];
            t49 = $[138];
        }
        let t50;
        if ($[139] !== t47) {
            t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                id: t47,
                x1: "0",
                y1: "0",
                x2: "0",
                y2: "1",
                children: [
                    t48,
                    t49
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 676,
                columnNumber: 13
            }, this);
            $[139] = t47;
            $[140] = t50;
        } else {
            t50 = $[140];
        }
        if ($[141] !== t46 || $[142] !== t50) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    t46,
                    t50
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 683,
                columnNumber: 13
            }, this);
            $[141] = t46;
            $[142] = t50;
            $[143] = t15;
        } else {
            t15 = $[143];
        }
        t16 = yTicks.map({
            "PriceChart[yTicks.map()]": (tick)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: padding.left,
                            y1: tick.y,
                            x2: 1400 - padding.right,
                            y2: tick.y,
                            stroke: "rgba(255,255,255,0.13)",
                            strokeDasharray: "3 5"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 691,
                            columnNumber: 59
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: padding.left - 10,
                            y: tick.y + 4,
                            textAnchor: "end",
                            fontSize: "10",
                            fill: "rgba(229, 242, 251, 0.7)",
                            children: formatCurrency(tick.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 691,
                            columnNumber: 189
                        }, this)
                    ]
                }, tick.y, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 691,
                    columnNumber: 43
                }, this)
        }["PriceChart[yTicks.map()]"]);
        t17 = xTickIndexes.map({
            "PriceChart[xTickIndexes.map()]": (index_7)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: toX(index_7),
                    y: 470,
                    textAnchor: "middle",
                    fontSize: "10",
                    fill: "rgba(229, 242, 251, 0.72)",
                    children: formatChartDate(displayedPoints[index_7].date)
                }, index_7, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 694,
                    columnNumber: 52
                }, this)
        }["PriceChart[xTickIndexes.map()]"]);
        $[49] = chartId;
        $[50] = displayedPoints;
        $[51] = hoverIndex;
        $[52] = onToggleEMA;
        $[53] = onToggleRSI;
        $[54] = points.length;
        $[55] = rangeDays;
        $[56] = showEMA;
        $[57] = showRSI;
        $[58] = toX;
        $[59] = toY;
        $[60] = yMax;
        $[61] = ySpan;
        $[62] = activePoint;
        $[63] = activeX;
        $[64] = activeY;
        $[65] = dailyMove;
        $[66] = rangeMove;
        $[67] = t10;
        $[68] = t11;
        $[69] = t12;
        $[70] = t13;
        $[71] = t14;
        $[72] = t15;
        $[73] = t16;
        $[74] = t17;
        $[75] = t18;
        $[76] = t19;
        $[77] = t20;
        $[78] = t21;
        $[79] = t8;
        $[80] = t9;
    } else {
        activePoint = $[62];
        activeX = $[63];
        activeY = $[64];
        dailyMove = $[65];
        rangeMove = $[66];
        t10 = $[67];
        t11 = $[68];
        t12 = $[69];
        t13 = $[70];
        t14 = $[71];
        t15 = $[72];
        t16 = $[73];
        t17 = $[74];
        t18 = $[75];
        t19 = $[76];
        t20 = $[77];
        t21 = $[78];
        t8 = $[79];
        t9 = $[80];
    }
    const t22 = `url(#${chartId}-fill)`;
    let t23;
    if ($[144] !== areaPath || $[145] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: areaPath,
            fill: t22
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 752,
            columnNumber: 11
        }, this);
        $[144] = areaPath;
        $[145] = t22;
        $[146] = t23;
    } else {
        t23 = $[146];
    }
    const t24 = `url(#${chartId}-line)`;
    let t25;
    if ($[147] !== linePath || $[148] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: linePath,
            fill: "none",
            stroke: t24,
            strokeWidth: "3.4",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 762,
            columnNumber: 11
        }, this);
        $[147] = linePath;
        $[148] = t24;
        $[149] = t25;
    } else {
        t25 = $[149];
    }
    let t26;
    if ($[150] !== emaPath || $[151] !== showEMA) {
        t26 = showEMA && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: emaPath,
            fill: "none",
            stroke: "rgba(255, 188, 120, 0.8)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 771,
            columnNumber: 22
        }, this);
        $[150] = emaPath;
        $[151] = showEMA;
        $[152] = t26;
    } else {
        t26 = $[152];
    }
    let t27;
    if ($[153] !== rsiPath || $[154] !== showRSI || $[155] !== toRsiY) {
        t27 = showRSI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: padding.left,
                    y1: toRsiY(70),
                    x2: 1400 - padding.right,
                    y2: toRsiY(70),
                    stroke: "rgba(255, 255, 255, 0.1)",
                    strokeDasharray: "2 2"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 780,
                    columnNumber: 24
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: padding.left,
                    y1: toRsiY(30),
                    x2: 1400 - padding.right,
                    y2: toRsiY(30),
                    stroke: "rgba(255, 255, 255, 0.1)",
                    strokeDasharray: "2 2"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 780,
                    columnNumber: 164
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: rsiPath,
                    fill: "none",
                    stroke: "#38dbc5",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 780,
                    columnNumber: 304
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: padding.left - 5,
                    y: toRsiY(50),
                    textAnchor: "end",
                    fontSize: "8",
                    fill: "rgba(56, 219, 197, 0.6)",
                    children: "RSI"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 780,
                    columnNumber: 416
                }, this)
            ]
        }, void 0, true);
        $[153] = rsiPath;
        $[154] = showRSI;
        $[155] = toRsiY;
        $[156] = t27;
    } else {
        t27 = $[156];
    }
    let t28;
    if ($[157] !== movingAveragePath) {
        t28 = movingAveragePath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: movingAveragePath,
            fill: "none",
            stroke: "rgba(198, 227, 255, 0.85)",
            strokeWidth: "1.8",
            strokeDasharray: "6 4",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 790,
            columnNumber: 31
        }, this) : null;
        $[157] = movingAveragePath;
        $[158] = t28;
    } else {
        t28 = $[158];
    }
    let t29;
    if ($[159] !== activeX) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
            x1: activeX,
            y1: padding.top,
            x2: activeX,
            y2: padding.top + plotHeight,
            stroke: "rgba(255,255,255,0.28)",
            strokeDasharray: "4 4"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 798,
            columnNumber: 11
        }, this);
        $[159] = activeX;
        $[160] = t29;
    } else {
        t29 = $[160];
    }
    let t30;
    let t31;
    if ($[161] !== activeX || $[162] !== activeY) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: activeX,
            cy: activeY,
            r: "5",
            fill: "rgba(255, 255, 255, 0.96)",
            stroke: "rgba(56, 219, 197, 0.95)",
            strokeWidth: "3"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 807,
            columnNumber: 11
        }, this);
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: activeX,
            cy: activeY,
            r: "12",
            fill: "rgba(56, 219, 197, 0.14)"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 808,
            columnNumber: 11
        }, this);
        $[161] = activeX;
        $[162] = activeY;
        $[163] = t30;
        $[164] = t31;
    } else {
        t30 = $[163];
        t31 = $[164];
    }
    let t32;
    if ($[165] !== t10 || $[166] !== t11 || $[167] !== t12 || $[168] !== t13 || $[169] !== t14 || $[170] !== t15 || $[171] !== t16 || $[172] !== t17 || $[173] !== t23 || $[174] !== t25 || $[175] !== t26 || $[176] !== t27 || $[177] !== t28 || $[178] !== t29 || $[179] !== t30 || $[180] !== t31 || $[181] !== t8 || $[182] !== t9) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: t8,
            className: t9,
            onMouseMove: t10,
            onMouseLeave: t11,
            onTouchStart: t12,
            onTouchMove: t13,
            onTouchEnd: t14,
            children: [
                t15,
                t16,
                t17,
                t23,
                t25,
                t26,
                t27,
                t28,
                t29,
                t30,
                t31
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 819,
            columnNumber: 11
        }, this);
        $[165] = t10;
        $[166] = t11;
        $[167] = t12;
        $[168] = t13;
        $[169] = t14;
        $[170] = t15;
        $[171] = t16;
        $[172] = t17;
        $[173] = t23;
        $[174] = t25;
        $[175] = t26;
        $[176] = t27;
        $[177] = t28;
        $[178] = t29;
        $[179] = t30;
        $[180] = t31;
        $[181] = t8;
        $[182] = t9;
        $[183] = t32;
    } else {
        t32 = $[183];
    }
    let t33;
    if ($[184] !== t18 || $[185] !== t19 || $[186] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t18,
            children: [
                t19,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 844,
            columnNumber: 11
        }, this);
        $[184] = t18;
        $[185] = t19;
        $[186] = t32;
        $[187] = t33;
    } else {
        t33 = $[187];
    }
    let t34;
    if ($[188] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "uppercase tracking-[0.12em] text-slate-200/70",
            children: "Selected"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 854,
            columnNumber: 11
        }, this);
        $[188] = t34;
    } else {
        t34 = $[188];
    }
    let t35;
    if ($[189] !== activePoint.close) {
        t35 = formatCurrency(activePoint.close);
        $[189] = activePoint.close;
        $[190] = t35;
    } else {
        t35 = $[190];
    }
    let t36;
    if ($[191] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-white/12 bg-white/8 px-3 py-2",
            children: [
                t34,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-sm font-medium text-white",
                    children: t35
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 869,
                    columnNumber: 88
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 869,
            columnNumber: 11
        }, this);
        $[191] = t35;
        $[192] = t36;
    } else {
        t36 = $[192];
    }
    let t37;
    if ($[193] === Symbol.for("react.memo_cache_sentinel")) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "uppercase tracking-[0.12em] text-slate-200/70",
            children: "1D Change"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 877,
            columnNumber: 11
        }, this);
        $[193] = t37;
    } else {
        t37 = $[193];
    }
    const t38 = `mt-1 text-sm font-medium ${dailyMove >= 0 ? "text-emerald-200" : "text-rose-200"}`;
    let t39;
    if ($[194] !== dailyMove) {
        t39 = formatPercent(dailyMove);
        $[194] = dailyMove;
        $[195] = t39;
    } else {
        t39 = $[195];
    }
    let t40;
    if ($[196] !== t38 || $[197] !== t39) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-white/12 bg-white/8 px-3 py-2",
            children: [
                t37,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: t38,
                    children: t39
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 893,
                    columnNumber: 88
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 893,
            columnNumber: 11
        }, this);
        $[196] = t38;
        $[197] = t39;
        $[198] = t40;
    } else {
        t40 = $[198];
    }
    let t41;
    if ($[199] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "uppercase tracking-[0.12em] text-slate-200/70",
            children: "Range Move"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 902,
            columnNumber: 11
        }, this);
        $[199] = t41;
    } else {
        t41 = $[199];
    }
    const t42 = `mt-1 text-sm font-medium ${rangeMove >= 0 ? "text-emerald-200" : "text-rose-200"}`;
    let t43;
    if ($[200] !== rangeMove) {
        t43 = formatPercent(rangeMove);
        $[200] = rangeMove;
        $[201] = t43;
    } else {
        t43 = $[201];
    }
    let t44;
    if ($[202] !== t42 || $[203] !== t43) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-white/12 bg-white/8 px-3 py-2",
            children: [
                t41,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: t42,
                    children: t43
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 918,
                    columnNumber: 88
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 918,
            columnNumber: 11
        }, this);
        $[202] = t42;
        $[203] = t43;
        $[204] = t44;
    } else {
        t44 = $[204];
    }
    let t45;
    if ($[205] !== t36 || $[206] !== t40 || $[207] !== t44) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-3 grid grid-cols-3 gap-2 text-xs text-slate-100/80",
            children: [
                t36,
                t40,
                t44
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 927,
            columnNumber: 11
        }, this);
        $[205] = t36;
        $[206] = t40;
        $[207] = t44;
        $[208] = t45;
    } else {
        t45 = $[208];
    }
    let t46;
    if ($[209] !== t20 || $[210] !== t21 || $[211] !== t33 || $[212] !== t45) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t20,
            children: [
                t21,
                t33,
                t45
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 937,
            columnNumber: 11
        }, this);
        $[209] = t20;
        $[210] = t21;
        $[211] = t33;
        $[212] = t45;
        $[213] = t46;
    } else {
        t46 = $[213];
    }
    return t46;
}
_s(PriceChart, "cQW+hRg1Y8MrzEGWrCN3ATwBupk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = PriceChart;
function _PriceChartDisplayedPointsMapAnonymous(point_1) {
    return point_1.close;
}
function _PriceChartDisplayedPointsMap(point) {
    return point.close;
}
function Portfolio(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(55);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 55; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    const { items, onRemove, onSelect, onQuickAdd } = t0;
    const [quickTicker, setQuickTicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    if ($[1] !== items || $[2] !== onQuickAdd || $[3] !== quickTicker) {
        const totalValue = items.reduce(_PortfolioItemsReduce, 0);
        const totalCost = items.reduce(_PortfolioItemsReduce2, 0);
        const totalGain = totalValue - totalCost;
        const gainPercent = totalCost > 0 ? totalGain / totalCost * 100 : 0;
        let t6;
        if ($[9] !== onQuickAdd || $[10] !== quickTicker) {
            t6 = ({
                "Portfolio[handleQuickAdd]": (e)=>{
                    e.preventDefault();
                    if (quickTicker.trim()) {
                        onQuickAdd(quickTicker.trim().toUpperCase());
                        setQuickTicker("");
                    }
                }
            })["Portfolio[handleQuickAdd]"];
            $[9] = onQuickAdd;
            $[10] = quickTicker;
            $[11] = t6;
        } else {
            t6 = $[11];
        }
        const handleQuickAdd = t6;
        const weightedMove = totalValue > 0 ? items.reduce({
            "Portfolio[items.reduce()]": (sum_1, item_1)=>{
                const move = item_1.predictedClose ? (item_1.predictedClose - item_1.lastPrice) / item_1.lastPrice * 100 : 0;
                return sum_1 + move * (item_1.shares * item_1.lastPrice) / totalValue;
            }
        }["Portfolio[items.reduce()]"], 0) : 0;
        let t7;
        if ($[12] !== items) {
            t7 = items.filter(_PortfolioItemsFilter);
            $[12] = items;
            $[13] = t7;
        } else {
            t7 = $[13];
        }
        const highRiskAssets = t7;
        let t8;
        if ($[14] !== items) {
            t8 = items.reduce(_PortfolioItemsReduce3, items[0]);
            $[14] = items;
            $[15] = t8;
        } else {
            t8 = $[15];
        }
        const topOpportunity = t8;
        t1 = "glass-panel animate-fade-up rounded-3xl p-4 md:p-8 overflow-hidden";
        let t9;
        if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-semibold text-white",
                children: "My Portfolio"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1024,
                columnNumber: 12
            }, this);
            $[16] = t9;
        } else {
            t9 = $[16];
        }
        if ($[17] !== items.length) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    t9,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "glass-pill text-[10px]",
                        children: [
                            items.length,
                            " Assets"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1030,
                        columnNumber: 67
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1030,
                columnNumber: 12
            }, this);
            $[17] = items.length;
            $[18] = t2;
        } else {
            t2 = $[18];
        }
        let t10;
        if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
            t10 = ({
                "Portfolio[<input>.onChange]": (e_0)=>setQuickTicker(e_0.target.value)
            })["Portfolio[<input>.onChange]"];
            $[19] = t10;
        } else {
            t10 = $[19];
        }
        let t11;
        if ($[20] !== quickTicker) {
            t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                placeholder: "Quick Add Ticker",
                value: quickTicker,
                onChange: t10,
                className: "flex-1 min-w-[100px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors placeholder:text-slate-100/20"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1047,
                columnNumber: 13
            }, this);
            $[20] = quickTicker;
            $[21] = t11;
        } else {
            t11 = $[21];
        }
        let t12;
        if ($[22] !== quickTicker) {
            t12 = quickTicker.trim();
            $[22] = quickTicker;
            $[23] = t12;
        } else {
            t12 = $[23];
        }
        const t13 = !t12;
        let t14;
        if ($[24] !== t13) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: t13,
                className: "rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/30 disabled:opacity-50",
                children: "ADD"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1064,
                columnNumber: 13
            }, this);
            $[24] = t13;
            $[25] = t14;
        } else {
            t14 = $[25];
        }
        if ($[26] !== handleQuickAdd || $[27] !== t11 || $[28] !== t14) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleQuickAdd,
                className: "mt-6 flex flex-wrap gap-2",
                children: [
                    t11,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1071,
                columnNumber: 12
            }, this);
            $[26] = handleQuickAdd;
            $[27] = t11;
            $[28] = t14;
            $[29] = t3;
        } else {
            t3 = $[29];
        }
        let t15;
        if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-[0.12em] text-slate-200/60",
                children: "Total Value"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1081,
                columnNumber: 13
            }, this);
            $[30] = t15;
        } else {
            t15 = $[30];
        }
        const t16 = formatCurrency(totalValue);
        let t17;
        if ($[31] !== t16) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                children: [
                    t15,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-2xl font-semibold text-white",
                        children: t16
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1089,
                        columnNumber: 85
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1089,
                columnNumber: 13
            }, this);
            $[31] = t16;
            $[32] = t17;
        } else {
            t17 = $[32];
        }
        let t18;
        if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-[0.12em] text-slate-200/60",
                children: "Total Gain"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1097,
                columnNumber: 13
            }, this);
            $[33] = t18;
        } else {
            t18 = $[33];
        }
        const t19 = `mt-1 text-2xl font-semibold ${totalGain >= 0 ? "text-emerald-300" : "text-rose-300"}`;
        let t20;
        if ($[34] !== gainPercent) {
            t20 = formatPercent(gainPercent);
            $[34] = gainPercent;
            $[35] = t20;
        } else {
            t20 = $[35];
        }
        let t21;
        if ($[36] !== t19 || $[37] !== t20) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                children: [
                    t18,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: t19,
                        children: t20
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1113,
                        columnNumber: 85
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1113,
                columnNumber: 13
            }, this);
            $[36] = t19;
            $[37] = t20;
            $[38] = t21;
        } else {
            t21 = $[38];
        }
        if ($[39] !== t17 || $[40] !== t21) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 grid grid-cols-2 gap-4",
                children: [
                    t17,
                    t21
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1121,
                columnNumber: 12
            }, this);
            $[39] = t17;
            $[40] = t21;
            $[41] = t4;
        } else {
            t4 = $[41];
        }
        t5 = items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-5 space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-white/10 bg-black/20 p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-xs uppercase tracking-wider text-slate-100/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Weighted Neural Forecast"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1128,
                                    columnNumber: 232
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: weightedMove >= 0 ? "text-emerald-400" : "text-rose-400",
                                    children: [
                                        weightedMove >= 0 ? "+" : "",
                                        weightedMove.toFixed(2),
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1128,
                                    columnNumber: 269
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1128,
                            columnNumber: 130
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 h-1.5 overflow-hidden rounded-full bg-white/5 flex",
                            children: items.map({
                                "Portfolio[items.map()]": (item_3, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full border-r border-black/20 first:rounded-l-full last:rounded-r-full last:border-0",
                                        style: {
                                            width: `${item_3.shares * item_3.lastPrice / totalValue * 100}%`,
                                            backgroundColor: `hsl(${200 + idx * 40}, 70%, 50%)`,
                                            opacity: 0.8
                                        },
                                        title: `${item_3.symbol}: ${(item_3.shares * item_3.lastPrice / totalValue * 100).toFixed(1)}%`
                                    }, item_3.symbol, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1129,
                                        columnNumber: 56
                                    }, this)
                            }["Portfolio[items.map()]"])
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1128,
                            columnNumber: 413
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1128,
                    columnNumber: 62
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                    children: [
                        highRiskAssets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl bg-rose-500/10 border border-rose-500/20 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] font-bold uppercase tracking-widest text-rose-400",
                                    children: "High Volatility Alert"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1134,
                                    columnNumber: 210
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-xs text-rose-100/70",
                                    children: [
                                        highRiskAssets.length,
                                        " asset",
                                        highRiskAssets.length > 1 ? "s" : "",
                                        " showing high neural variance."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1134,
                                    columnNumber: 312
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1134,
                            columnNumber: 137
                        }, this),
                        topOpportunity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] font-bold uppercase tracking-widest text-emerald-400",
                                    children: "Top Opportunity"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1134,
                                    columnNumber: 563
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-emerald-100/70",
                                            children: topOpportunity.symbol
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1134,
                                            columnNumber: 718
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-mono text-emerald-300",
                                            children: [
                                                "+",
                                                (((topOpportunity.predictedClose ?? 0) - topOpportunity.lastPrice) / topOpportunity.lastPrice * 100).toFixed(1),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1134,
                                            columnNumber: 794
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1134,
                                    columnNumber: 662
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1134,
                            columnNumber: 484
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1134,
                    columnNumber: 52
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1128,
            columnNumber: 30
        }, this);
        $[1] = items;
        $[2] = onQuickAdd;
        $[3] = quickTicker;
        $[4] = t1;
        $[5] = t2;
        $[6] = t3;
        $[7] = t4;
        $[8] = t5;
    } else {
        t1 = $[4];
        t2 = $[5];
        t3 = $[6];
        t4 = $[7];
        t5 = $[8];
    }
    let t6;
    if ($[42] !== items || $[43] !== onRemove || $[44] !== onSelect) {
        t6 = items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-dashed border-white/10 py-10 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-slate-100/40",
                    children: "Portfolio is empty"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1152,
                    columnNumber: 115
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs text-slate-100/30",
                    children: "Run a prediction to add symbols"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1152,
                    columnNumber: 178
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1152,
            columnNumber: 31
        }, this) : items.map({
            "Portfolio[items.map()]": (item_4)=>{
                const gain = (item_4.lastPrice - item_4.avgPrice) * item_4.shares;
                const percent = (item_4.lastPrice - item_4.avgPrice) / item_4.avgPrice * 100;
                const purchaseDate = item_4.purchaseDate ? new Date(item_4.purchaseDate) : new Date();
                const heldDays = Math.floor((new Date().getTime() - purchaseDate.getTime()) / 86400000);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "group relative flex flex-col rounded-2xl border border-white/15 bg-white/5 p-4 transition-all hover:bg-white/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Portfolio[items.map() > <button>.onClick]": ()=>onSelect(item_4.symbol)
                                    }["Portfolio[items.map() > <button>.onClick]"],
                                    className: "flex flex-1 items-center gap-4 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-bold text-white",
                                            children: item_4.symbol[0]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 114
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-white",
                                                    children: item_4.symbol
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1160,
                                                    columnNumber: 247
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] uppercase tracking-wider text-slate-100/40",
                                                    children: [
                                                        "Held ",
                                                        heldDays || 0,
                                                        " days"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1160,
                                                    columnNumber: 308
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 242
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1158,
                                    columnNumber: 216
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-white",
                                            children: formatCurrency(item_4.lastPrice * item_4.shares)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 450
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-xs ${gain >= 0 ? "text-emerald-400" : "text-rose-400"}`,
                                            children: [
                                                gain >= 0 ? "+" : "",
                                                formatCurrency(gain),
                                                " (",
                                                formatPercent(percent),
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 542
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1160,
                                    columnNumber: 422
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1158,
                            columnNumber: 165
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-slate-100/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block uppercase tracking-wider opacity-60",
                                            children: "Avg Cost"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 827
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-white/80",
                                            children: formatCurrency(item_4.avgPrice)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 902
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1160,
                                    columnNumber: 780
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-right text-slate-100/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block uppercase tracking-wider opacity-60",
                                            children: "Neural Target"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 1048
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-cyan-300",
                                            children: item_4.predictedClose ? formatCurrency(item_4.predictedClose) : "\u2014"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 1128
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1160,
                                    columnNumber: 990
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1160,
                            columnNumber: 706
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Portfolio[items.map() > <button>.onClick]": ()=>onRemove(item_4.symbol)
                            }["Portfolio[items.map() > <button>.onClick]"],
                            className: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-slate-400 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: "12",
                                height: "12",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M18 6 6 18"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1162,
                                        columnNumber: 452
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "m6 6 12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1162,
                                        columnNumber: 475
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1162,
                                columnNumber: 274
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1160,
                            columnNumber: 1263
                        }, this)
                    ]
                }, item_4.symbol, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1158,
                    columnNumber: 16
                }, this);
            }
        }["Portfolio[items.map()]"]);
        $[42] = items;
        $[43] = onRemove;
        $[44] = onSelect;
        $[45] = t6;
    } else {
        t6 = $[45];
    }
    let t7;
    if ($[46] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-6 space-y-3",
            children: t6
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1174,
            columnNumber: 10
        }, this);
        $[46] = t6;
        $[47] = t7;
    } else {
        t7 = $[47];
    }
    let t8;
    if ($[48] !== t1 || $[49] !== t2 || $[50] !== t3 || $[51] !== t4 || $[52] !== t5 || $[53] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
            className: t1,
            children: [
                t2,
                t3,
                t4,
                t5,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1182,
            columnNumber: 10
        }, this);
        $[48] = t1;
        $[49] = t2;
        $[50] = t3;
        $[51] = t4;
        $[52] = t5;
        $[53] = t7;
        $[54] = t8;
    } else {
        t8 = $[54];
    }
    return t8;
}
_s1(Portfolio, "nMcI5JfdwFDAR60Aj+0H0hI8XFQ=");
_c1 = Portfolio;
function _PortfolioItemsReduce3(best, current) {
    const currentMove = current.predictedClose ? (current.predictedClose - current.lastPrice) / current.lastPrice : -1;
    const bestMove = best && best.predictedClose ? (best.predictedClose - best.lastPrice) / best.lastPrice : -1;
    return currentMove > bestMove ? current : best;
}
function _PortfolioItemsFilter(item_2) {
    const move_0 = item_2.predictedClose ? Math.abs((item_2.predictedClose - item_2.lastPrice) / item_2.lastPrice) * 100 : 0;
    return move_0 > 8;
}
function _PortfolioItemsReduce2(sum_0, item_0) {
    return sum_0 + item_0.shares * item_0.avgPrice;
}
function _PortfolioItemsReduce(sum, item) {
    return sum + item.shares * item.lastPrice;
}
function TrendingRecommendations(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    const { onSelect } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [
            {
                symbol: "NVDA",
                name: "Nvidia",
                type: "AI Leader"
            },
            {
                symbol: "TSLA",
                name: "Tesla",
                type: "EV / Tech"
            },
            {
                symbol: "BTC-USD",
                name: "Bitcoin",
                type: "Crypto"
            },
            {
                symbol: "MSFT",
                name: "Microsoft",
                type: "Cloud / AI"
            },
            {
                symbol: "AAPL",
                name: "Apple",
                type: "Consumer Tech"
            },
            {
                symbol: "COIN",
                name: "Coinbase",
                type: "Crypto Exch"
            }
        ];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const trending = t1;
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4 flex items-center gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1255,
                    columnNumber: 56
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-sm font-semibold uppercase tracking-widest text-white/80",
                    children: "Trending & Neural Favorites"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1255,
                    columnNumber: 127
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1255,
            columnNumber: 10
        }, this);
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== onSelect) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-8 overflow-hidden",
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 overflow-x-auto pb-4 no-scrollbar",
                    children: trending.map({
                        "TrendingRecommendations[trending.map()]": (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "TrendingRecommendations[trending.map() > <button>.onClick]": ()=>onSelect(item.symbol)
                                }["TrendingRecommendations[trending.map() > <button>.onClick]"],
                                className: "flex min-w-[140px] flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:scale-[1.02] text-left active:scale-[0.98]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-cyan-400",
                                        children: item.symbol
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1265,
                                        columnNumber: 248
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-1 text-sm font-semibold text-white truncate",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1265,
                                        columnNumber: 318
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-2 text-[10px] uppercase tracking-wider text-slate-100/40",
                                        children: item.type
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1265,
                                        columnNumber: 401
                                    }, this)
                                ]
                            }, item.symbol, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1263,
                                columnNumber: 62
                            }, this)
                    }["TrendingRecommendations[trending.map()]"])
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1262,
                    columnNumber: 52
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1262,
            columnNumber: 10
        }, this);
        $[3] = onSelect;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    return t3;
}
_c2 = TrendingRecommendations;
function HelpSection() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [
            {
                title: "1. Forecast",
                desc: "Enter a ticker like AAPL and a horizon. This trains a neural network in real-time."
            },
            {
                title: "2. Track",
                desc: "Save your holdings to the Portfolio to see persistent P/L and quick-access predictions."
            },
            {
                title: "3. Analyze",
                desc: "Toggle RSI and EMA overlays on the chart for momentum and strength analysis."
            },
            {
                title: "4. Risk",
                desc: "Monitor portfolio volatility and model-predicted downside risk for your holdings."
            }
        ];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const steps = t0;
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-2 w-2 rounded-full bg-cyan-400 animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1304,
                    columnNumber: 51
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-semibold text-white",
                    children: "How to Use the Lab"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1304,
                    columnNumber: 117
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1304,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
            children: steps.map(_HelpSectionStepsMap)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1311,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "glass-panel animate-fade-up-delay-3 rounded-3xl p-6 md:p-10 mb-20 overflow-hidden",
            children: [
                t1,
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 rounded-2xl border border-dashed border-white/20 p-5 bg-white/5 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-100/40 uppercase tracking-[0.2em]",
                        children: "Note: This is a neural research tool. Predictions are probabilistic and not financial advice."
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1318,
                        columnNumber: 220
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1318,
                    columnNumber: 121
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1318,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    return t3;
}
_c3 = HelpSection;
function _HelpSectionStepsMap(step, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative rounded-2xl border border-white/10 bg-white/5 p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-sm font-bold text-cyan-300 uppercase tracking-wider",
                children: step.title
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1326,
                columnNumber: 94
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-sm text-slate-100/60 leading-relaxed",
                children: step.desc
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1326,
                columnNumber: 184
            }, this)
        ]
    }, i, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 1326,
        columnNumber: 10
    }, this);
}
function Home() {
    _s2();
    const [symbol, setSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("AAPL");
    const [horizonDays, setHorizonDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(7);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [prediction, setPrediction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingStep, setLoadingStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [portfolio, setPortfolio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isPortfolioLoaded, setIsPortfolioLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEMA, setShowEMA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRSI, setShowRSI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sentiment, setSentiment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [backtestResult, setBacktestResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isBacktesting, setIsBacktesting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [correlations, setCorrelations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load portfolio from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const saved = localStorage.getItem("stocker_portfolio");
            if (saved) {
                try {
                    setPortfolio(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse portfolio", e);
                }
            }
            setIsPortfolioLoaded(true);
        }
    }["Home.useEffect"], []);
    // Save portfolio to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (isPortfolioLoaded) {
                localStorage.setItem("stocker_portfolio", JSON.stringify(portfolio));
            }
        }
    }["Home.useEffect"], [
        portfolio,
        isPortfolioLoaded
    ]);
    const addToPortfolio = (symbol_0, price)=>{
        setPortfolio((prev)=>{
            const exists = prev.find((item)=>item.symbol === symbol_0);
            if (exists) {
                return prev.map((item_0)=>item_0.symbol === symbol_0 ? {
                        ...item_0,
                        shares: item_0.shares + 1,
                        avgPrice: (item_0.avgPrice * item_0.shares + price) / (item_0.shares + 1),
                        lastPrice: price
                    } : item_0);
            }
            return [
                ...prev,
                {
                    symbol: symbol_0,
                    shares: 1,
                    avgPrice: price,
                    lastPrice: price,
                    purchaseDate: new Date().toISOString()
                }
            ];
        });
    };
    const removeFromPortfolio = (symbol_1)=>{
        setPortfolio((prev_0)=>prev_0.filter((item_1)=>item_1.symbol !== symbol_1));
    };
    const runBacktest = async ()=>{
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
            const errorPercent = Math.abs(historicalPrediction.predictedClose - actualPrice) / actualPrice * 100;
            setBacktestResult({
                original: historicalPrediction,
                actual: actualPrice,
                errorPercent,
                date: asOfDate
            });
        } catch (e_0) {
            console.error("Backtest failed", e_0);
        } finally{
            setIsBacktesting(false);
        }
    };
    const fetchCorrelations = async (ticker)=>{
        // Basic peers for now based on sector/similarity
        const peersMap = {
            'AAPL': [
                'MSFT',
                'GOOGL',
                'AMZN',
                'META'
            ],
            'NVDA': [
                'AMD',
                'INTC',
                'TSM',
                'AVGO'
            ],
            'TSLA': [
                'RIVN',
                'LCID',
                'F',
                'GM'
            ],
            'MSFT': [
                'AAPL',
                'GOOGL',
                'ORCL',
                'SAP'
            ],
            'AMZN': [
                'BABA',
                'WMT',
                'EBAY',
                'TGT'
            ]
        };
        const peers = peersMap[ticker] || [
            'SPY',
            'QQQ',
            'DIA'
        ];
        try {
            const res_0 = await fetch(`/api/correlations?symbol=${ticker}&peers=${peers.join(',')}`);
            const data = await res_0.json();
            if (data.datasets && data.datasets.length > 1) {
                const basePrices = data.datasets[0].prices;
                const results = data.datasets.slice(1).map((d)=>({
                        symbol: d.symbol,
                        score: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$correlation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateReturnCorrelation"])(basePrices, d.prices)
                    })).sort((a, b)=>Math.abs(b.score) - Math.abs(a.score));
                setCorrelations(results);
            }
        } catch (e_1) {
            console.error("Correlations failed", e_1);
        }
    };
    const loadingMessages = [
        "Fetching market data...",
        "Computing technical indicators...",
        "Training neural network...",
        "Scoring predictions..."
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!isLoading) {
                setProgress(0);
                return;
            }
            setLoadingStep(0);
            const initialTimer = setTimeout({
                "Home.useEffect.initialTimer": ()=>setProgress(20)
            }["Home.useEffect.initialTimer"], 50);
            const interval = setInterval({
                "Home.useEffect.interval": ()=>{
                    setLoadingStep({
                        "Home.useEffect.interval": (prev_1)=>Math.min(prev_1 + 1, loadingMessages.length - 1)
                    }["Home.useEffect.interval"]);
                    setProgress({
                        "Home.useEffect.interval": (prev_2)=>Math.min(prev_2 + 25, 95)
                    }["Home.useEffect.interval"]);
                }
            }["Home.useEffect.interval"], 2800);
            return ({
                "Home.useEffect": ()=>{
                    clearTimeout(initialTimer);
                    clearInterval(interval);
                }
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        isLoading
    ]);
    const historyPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[historyPoints]": ()=>prediction?.history ?? []
    }["Home.useMemo[historyPoints]"], [
        prediction
    ]);
    const runPrediction = async (event)=>{
        event.preventDefault();
        const ticker_0 = symbol.trim().toUpperCase();
        if (!ticker_0) {
            setErrorMessage("Enter a valid stock ticker.");
            return;
        }
        setIsLoading(true);
        setSentiment(null);
        setBacktestResult(null);
        setCorrelations(null);
        try {
            const url = `/api/predict?symbol=${encodeURIComponent(ticker_0)}&horizon=${horizonDays}`;
            const response = await fetch(url, {
                cache: "no-store"
            });
            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.error ?? "Prediction failed.");
            }
            setPrediction(payload);
            setSymbol(ticker_0);
            if (payload.news) {
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sentiment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeSentiment"])(payload.news.map((n)=>n.title));
                setSentiment(result);
            }
            fetchCorrelations(ticker_0);
            // Update portfolio if symbol exists
            setPortfolio((prev_3)=>prev_3.map((item_2)=>item_2.symbol === ticker_0 ? {
                        ...item_2,
                        lastPrice: payload.latestClose,
                        predictedClose: payload.predictedClose
                    } : item_2));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to generate prediction right now.");
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen px-4 pb-32 pt-12 md:px-8 md:pt-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aurora orb-one"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1507,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aurora orb-two"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1508,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aurora orb-three"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1509,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1506,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "relative mx-auto flex w-full max-w-6xl flex-col gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "glass-panel animate-fade-up rounded-3xl p-6 md:p-10 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "glass-pill mb-4 inline-flex",
                                children: "Neural Forecast Lab"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1514,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-3xl font-semibold tracking-tight text-white md:text-6xl",
                                                children: "See where a stock could be headed next."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1517,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-4 max-w-2xl text-sm text-slate-100/80 md:text-lg",
                                                children: "This dashboard trains a TensorFlow model on real market data and macro signals like S&P 500 trend, VIX, treasury yields, and oil movement to forecast short-term stock direction."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1520,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1516,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: runPrediction,
                                        className: "rounded-2xl border border-white/25 bg-white/10 p-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "symbol",
                                                        className: "field-label flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Ticker"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1530,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-1",
                                                                children: POPULAR_TICKERS.map((pt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setSymbol(pt),
                                                                        className: "rounded bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-200/60 transition hover:bg-white/15 hover:text-white",
                                                                        children: pt
                                                                    }, pt, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1532,
                                                                        columnNumber: 48
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1531,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1529,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        id: "symbol",
                                                        className: "input-glass",
                                                        value: symbol,
                                                        onChange: (event_0)=>setSymbol(event_0.target.value),
                                                        placeholder: "AAPL",
                                                        maxLength: 10
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1537,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1528,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 space-y-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "horizon",
                                                        className: "field-label",
                                                        children: "Forecast Horizon (days)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1541,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        id: "horizon",
                                                        className: "input-glass",
                                                        type: "number",
                                                        min: 2,
                                                        max: 30,
                                                        value: horizonDays,
                                                        onChange: (event_1)=>setHorizonDays(Math.min(30, Math.max(2, Number(event_1.target.value) || 2)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1544,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1540,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: isLoading,
                                                className: "mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60",
                                                children: isLoading ? "Modeling Market Signals..." : "Predict Future Price"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1547,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1527,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1515,
                                columnNumber: 11
                            }, this),
                            errorMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100",
                                children: errorMessage
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1553,
                                columnNumber: 27
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1513,
                        columnNumber: 9
                    }, this),
                    isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "glass-panel animate-fade-up-delay rounded-3xl p-6 md:p-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 relative overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "animate-slide-up absolute inset-0 text-sm uppercase tracking-[0.18em] text-slate-100/70",
                                    children: loadingMessages[loadingStep]
                                }, loadingStep, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1560,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1559,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 h-2 overflow-hidden rounded-full bg-white/10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full bg-cyan-300/80 transition-all ease-linear",
                                    style: {
                                        width: `${progress}%`,
                                        transitionDuration: progress === 0 ? '0ms' : '2800ms'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1565,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1564,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1558,
                        columnNumber: 22
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: prediction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "glass-panel animate-fade-up rounded-3xl p-6 md:p-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm uppercase tracking-[0.2em] text-slate-100/70",
                                                                    children: [
                                                                        prediction.symbol,
                                                                        " · ",
                                                                        prediction.horizonDays,
                                                                        "-Day Forecast"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1578,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                    className: "mt-3 text-3xl font-semibold text-white md:text-5xl",
                                                                    children: formatCurrency(prediction.predictedClose)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1581,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${prediction.predictedMovePercent >= 0 ? "bg-emerald-300/20 text-emerald-100" : "bg-rose-300/20 text-rose-100"}`,
                                                                    children: formatPercent(prediction.predictedMovePercent)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1584,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1577,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>addToPortfolio(prediction.symbol, prediction.latestClose),
                                                            className: "glass-pill flex items-center gap-2 border-white/20 px-4 py-2 text-xs hover:bg-white/10 active:scale-95 transition-all",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                    width: "14",
                                                                    height: "14",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2.5",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M5 12h14"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1589,
                                                                            columnNumber: 203
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M12 5v14"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1589,
                                                                            columnNumber: 224
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1589,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Add to Portfolio"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1588,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1576,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-6 rounded-2xl border border-white/20 bg-black/20 p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between text-sm text-slate-100/85",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Confidence"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1596,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        prediction.confidenceScore.toFixed(1),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1597,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1595,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 h-2 overflow-hidden rounded-full bg-white/10",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-300",
                                                                style: {
                                                                    width: `${prediction.confidenceScore}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1600,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1599,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1594,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-100/90",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-white/15 bg-white/10 p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs uppercase tracking-[0.12em] text-slate-200/70",
                                                                    children: "Now"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1608,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-base font-medium",
                                                                    children: formatCurrency(prediction.latestClose)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1609,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1607,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-white/15 bg-white/10 p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs uppercase tracking-[0.12em] text-slate-200/70",
                                                                    children: "Range"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1614,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-base font-medium",
                                                                    children: [
                                                                        formatCurrency(prediction.forecastRange.low),
                                                                        " -",
                                                                        " ",
                                                                        formatCurrency(prediction.forecastRange.high)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1615,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1613,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-white/15 bg-white/10 p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs uppercase tracking-[0.12em] text-slate-200/70",
                                                                    children: "Model MAPE"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1621,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-base font-medium",
                                                                    children: [
                                                                        prediction.modelMetrics.mape.toFixed(2),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1624,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1620,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-white/15 bg-white/10 p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs uppercase tracking-[0.12em] text-slate-200/70",
                                                                    children: "R²"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1627,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-base font-medium",
                                                                    children: prediction.modelMetrics.rSquared
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1628,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1626,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1606,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1575,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "glass-panel animate-fade-up-delay rounded-3xl p-6 md:p-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-semibold text-white",
                                                    children: "What drives this signal"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1636,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "mt-4 space-y-3",
                                                    children: prediction.topDrivers.map((driver)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between text-sm gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-slate-100/90 truncate",
                                                                            children: driver.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1640,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium text-slate-100/80 shrink-0",
                                                                            children: [
                                                                                driver.impact.toFixed(1),
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1641,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1639,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-1 h-1.5 overflow-hidden rounded-full bg-white/10",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-full rounded-full bg-gradient-to-r from-cyan-300/90 to-amber-300/90",
                                                                        style: {
                                                                            width: `${Math.max(driver.impact, 3)}%`
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1646,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1645,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, driver.name, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1638,
                                                            columnNumber: 58
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1637,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1635,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : null
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1573,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrendingRecommendations, {
                                        onSelect: (s)=>{
                                            setSymbol(s);
                                            const form = document.querySelector('form');
                                            if (form) setTimeout(()=>form.dispatchEvent(new Event('submit', {
                                                    cancelable: true,
                                                    bubbles: true
                                                })), 10);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1657,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Portfolio, {
                                        items: portfolio,
                                        onRemove: removeFromPortfolio,
                                        onSelect: (sym)=>{
                                            setSymbol(sym);
                                            const form_0 = document.querySelector('form');
                                            if (form_0) setTimeout(()=>form_0.dispatchEvent(new Event('submit', {
                                                    cancelable: true,
                                                    bubbles: true
                                                })), 10);
                                        },
                                        onQuickAdd: async (ticker_1)=>{
                                            const response_0 = await fetch(`/api/market?symbol=${ticker_1}`);
                                            const data_0 = await response_0.json();
                                            if (data_0.price) {
                                                addToPortfolio(ticker_1, data_0.price);
                                            } else {
                                                // Fallback: run a prediction to get data
                                                setSymbol(ticker_1);
                                                const form_1 = document.querySelector('form');
                                                if (form_1) setTimeout(()=>form_1.dispatchEvent(new Event('submit', {
                                                        cancelable: true,
                                                        bubbles: true
                                                    })), 10);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1666,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1656,
                                columnNumber: 11
                            }, this),
                            prediction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "glass-panel animate-fade-up-delay rounded-3xl p-6 md:p-12 lg:col-span-2 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs uppercase tracking-[0.15em] text-slate-200/70",
                                                children: "Recent Price Context"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1692,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-200/70",
                                                children: [
                                                    historyPoints.length,
                                                    " daily points"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1695,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: runBacktest,
                                                disabled: isBacktesting,
                                                className: "flex items-center gap-2 px-3 py-1 transparent-glass rounded-lg border border-cyan-500/20 hover:bg-cyan-500/10 transition-all text-[10px] uppercase tracking-widest text-cyan-300 disabled:opacity-50",
                                                children: isBacktesting ? 'Training History...' : 'Run Backtest (30d Ago)'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1698,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1691,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PriceChart, {
                                                points: historyPoints,
                                                showEMA: showEMA,
                                                showRSI: showRSI,
                                                onToggleEMA: ()=>setShowEMA(!showEMA),
                                                onToggleRSI: ()=>setShowRSI(!showRSI)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1703,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NewsSentiment, {
                                                news: prediction.news,
                                                sentiment: sentiment
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1705,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BacktestCard, {
                                                result: backtestResult
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1706,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CorrelationMatrix, {
                                                correlations: correlations
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1707,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1702,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-xs text-slate-200/70",
                                        children: [
                                            "Trained on ",
                                            prediction.modelMetrics.trainingSamples,
                                            " market rows. Updated",
                                            " ",
                                            new Date(prediction.generatedAt).toLocaleTimeString(),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1709,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1690,
                                columnNumber: 25
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1572,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpSection, {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1716,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1512,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 1505,
        columnNumber: 10
    }, this);
}
_s2(Home, "cuOYJ7pl3aOJPduKMcM3onVLLr4=");
_c4 = Home;
function NewsSentiment(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(30);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 30; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    const { news, sentiment } = t0;
    if (!sentiment) {
        return null;
    }
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
            className: "text-[11px] font-black uppercase tracking-widest text-slate-200",
            children: "AI News Sentiment"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1737,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const t2 = `px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sentiment.label === "Bullish" ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400" : sentiment.label === "Bearish" ? "bg-red-500/30 text-red-200 border border-red-400" : "bg-slate-700/50 text-slate-200 border border-slate-500"}`;
    let t3;
    if ($[2] !== sentiment.label || $[3] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-4 pb-4 border-b border-white/5",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: t2,
                    children: sentiment.label
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1745,
                    columnNumber: 99
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1745,
            columnNumber: 10
        }, this);
        $[2] = sentiment.label;
        $[3] = t2;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-300 px-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Negative Bias"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1754,
                    columnNumber: 118
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Positive Bias"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1754,
                    columnNumber: 144
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1754,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const t5 = `${Math.max(0, -sentiment.score * 100)}%`;
    let t6;
    if ($[6] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
            style: {
                width: t5
            }
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1762,
            columnNumber: 10
        }, this);
        $[6] = t5;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-1 h-full bg-white/30 z-10"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1772,
            columnNumber: 10
        }, this);
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    const t8 = `${Math.max(0, sentiment.score * 100)}%`;
    let t9;
    if ($[9] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-1000 shadow-[0_0_8px_rgba(34,211,238,0.5)]",
            style: {
                width: t8
            }
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1780,
            columnNumber: 10
        }, this);
        $[9] = t8;
        $[10] = t9;
    } else {
        t9 = $[10];
    }
    let t10;
    if ($[11] !== t6 || $[12] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-2.5 w-full bg-black/40 rounded-full overflow-hidden flex relative ring-1 ring-white/10",
            children: [
                t6,
                t7,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1790,
            columnNumber: 11
        }, this);
        $[11] = t6;
        $[12] = t9;
        $[13] = t10;
    } else {
        t10 = $[13];
    }
    let t11;
    if ($[14] !== sentiment.explanation) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[13px] font-bold text-white leading-relaxed italic border-l-2 border-white/20 pl-4",
            children: [
                '"',
                sentiment.explanation,
                '"'
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1799,
            columnNumber: 11
        }, this);
        $[14] = sentiment.explanation;
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    let t12;
    if ($[16] !== t10 || $[17] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t4,
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1807,
            columnNumber: 11
        }, this);
        $[16] = t10;
        $[17] = t11;
        $[18] = t12;
    } else {
        t12 = $[18];
    }
    let t13;
    if ($[19] !== t12 || $[20] !== t3) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-white/15 bg-white/5 p-6 animate-fade-up",
            children: [
                t3,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1816,
            columnNumber: 11
        }, this);
        $[19] = t12;
        $[20] = t3;
        $[21] = t13;
    } else {
        t13 = $[21];
    }
    let t14;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
            className: "text-[11px] font-bold uppercase tracking-widest text-slate-200 mb-4 pb-4 border-b border-white/5",
            children: "Market Signal Headlines"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1825,
            columnNumber: 11
        }, this);
        $[22] = t14;
    } else {
        t14 = $[22];
    }
    let t15;
    if ($[23] !== news) {
        t15 = news.slice(0, 3).map(_NewsSentimentAnonymous);
        $[23] = news;
        $[24] = t15;
    } else {
        t15 = $[24];
    }
    let t16;
    if ($[25] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-white/15 bg-white/5 p-6 animate-fade-up",
            children: [
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: t15
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1840,
                    columnNumber: 99
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1840,
            columnNumber: 11
        }, this);
        $[25] = t15;
        $[26] = t16;
    } else {
        t16 = $[26];
    }
    let t17;
    if ($[27] !== t13 || $[28] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 grid gap-6 lg:grid-cols-2",
            children: [
                t13,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1848,
            columnNumber: 11
        }, this);
        $[27] = t13;
        $[28] = t16;
        $[29] = t17;
    } else {
        t17 = $[29];
    }
    return t17;
}
_c5 = NewsSentiment;
function _NewsSentimentAnonymous(item, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: item.link,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "block group border-b border-white/5 pb-2 last:border-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-relaxed",
                children: item.title
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1858,
                columnNumber: 147
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mt-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-slate-300 uppercase tracking-tight font-black",
                        children: item.publisher
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1858,
                        columnNumber: 332
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "h-1 w-1 rounded-full bg-slate-400"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1858,
                        columnNumber: 436
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-cyan-300 font-black group-hover:text-cyan-400 transition-colors uppercase",
                        children: "Read Details"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1858,
                        columnNumber: 490
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1858,
                columnNumber: 284
            }, this)
        ]
    }, i, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 1858,
        columnNumber: 10
    }, this);
}
function BacktestCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(52);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 52; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    const { result } = t0;
    if (!result) {
        return null;
    }
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-2 w-2 rounded-full bg-cyan-400 animate-pulse"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1877,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
            className: "text-[11px] font-black uppercase tracking-widest text-cyan-200",
            children: "Model Performance Validation"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1878,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    let t3;
    if ($[3] !== result.date) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 mb-4 pb-4 border-b border-white/5",
            children: [
                t1,
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-auto text-[10px] text-slate-300 uppercase font-mono tracking-tighter",
                    children: [
                        "Snapshotted Date: ",
                        result.date
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1887,
                    columnNumber: 93
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1887,
            columnNumber: 10
        }, this);
        $[3] = result.date;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2",
            children: "Historical Forecast"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1895,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== result.original.predictedClose) {
        t5 = formatCurrency(result.original.predictedClose);
        $[6] = result.original.predictedClose;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    let t6;
    if ($[8] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-3xl font-black text-white font-mono tracking-tight leading-none",
            children: t5
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1910,
            columnNumber: 10
        }, this);
        $[8] = t5;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    const t7 = `text-[11px] font-black px-2 py-0.5 rounded-md ${result.original.predictedMovePercent > 0 ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"}`;
    const t8 = result.original.predictedMovePercent > 0 ? "BULLISH TREND" : "BEARISH TREND";
    let t9;
    if ($[10] !== t7 || $[11] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1.5 pt-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: t7,
                children: t8
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1920,
                columnNumber: 58
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1920,
            columnNumber: 10
        }, this);
        $[10] = t7;
        $[11] = t8;
        $[12] = t9;
    } else {
        t9 = $[12];
    }
    let t10;
    if ($[13] !== t6 || $[14] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                t4,
                t6,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1929,
            columnNumber: 11
        }, this);
        $[13] = t6;
        $[14] = t9;
        $[15] = t10;
    } else {
        t10 = $[15];
    }
    let t11;
    let t12;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute -left-5 top-0 bottom-0 w-[1px] bg-white/20 hidden sm:block"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1939,
            columnNumber: 11
        }, this);
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2",
            children: "Actual Realization"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1940,
            columnNumber: 11
        }, this);
        $[16] = t11;
        $[17] = t12;
    } else {
        t11 = $[16];
        t12 = $[17];
    }
    let t13;
    if ($[18] !== result.actual) {
        t13 = formatCurrency(result.actual);
        $[18] = result.actual;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-3xl font-black text-white font-mono tracking-tight leading-none",
            children: t13
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1957,
            columnNumber: 11
        }, this);
        $[20] = t13;
        $[21] = t14;
    } else {
        t14 = $[21];
    }
    let t15;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] text-slate-200 font-bold",
            children: "Verified Market Price"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1965,
            columnNumber: 11
        }, this);
        $[22] = t15;
    } else {
        t15 = $[22];
    }
    let t16;
    if ($[23] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3 relative",
            children: [
                t11,
                t12,
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1972,
            columnNumber: 11
        }, this);
        $[23] = t14;
        $[24] = t16;
    } else {
        t16 = $[24];
    }
    let t17;
    let t18;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute -left-5 top-0 bottom-0 w-[1px] bg-white/20 hidden sm:block"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1981,
            columnNumber: 11
        }, this);
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2",
            children: "Forecasting Precision"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 1982,
            columnNumber: 11
        }, this);
        $[25] = t17;
        $[26] = t18;
    } else {
        t17 = $[25];
        t18 = $[26];
    }
    const t19 = `text-4xl font-black font-mono tracking-tighter leading-none ${result.errorPercent < 5 ? "text-green-400" : "text-amber-400"}`;
    const t20 = 100 - result.errorPercent;
    let t21;
    if ($[27] !== t20) {
        t21 = t20.toFixed(1);
        $[27] = t20;
        $[28] = t21;
    } else {
        t21 = $[28];
    }
    let t22;
    if ($[29] !== t19 || $[30] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: t19,
            children: [
                t21,
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2001,
            columnNumber: 11
        }, this);
        $[29] = t19;
        $[30] = t21;
        $[31] = t22;
    } else {
        t22 = $[31];
    }
    let t23;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-[10px] font-black text-slate-200 uppercase",
            children: "Accuracy"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2010,
            columnNumber: 11
        }, this);
        $[32] = t23;
    } else {
        t23 = $[32];
    }
    let t24;
    if ($[33] !== t22) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-baseline gap-2",
            children: [
                t22,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2017,
            columnNumber: 11
        }, this);
        $[33] = t22;
        $[34] = t24;
    } else {
        t24 = $[34];
    }
    let t25;
    if ($[35] !== result.errorPercent) {
        t25 = result.errorPercent.toFixed(2);
        $[35] = result.errorPercent;
        $[36] = t25;
    } else {
        t25 = $[36];
    }
    let t26;
    if ($[37] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] text-slate-200 font-bold border-l-2 border-white/30 pl-2",
            children: [
                "Error Margin: ",
                t25,
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2033,
            columnNumber: 11
        }, this);
        $[37] = t25;
        $[38] = t26;
    } else {
        t26 = $[38];
    }
    let t27;
    if ($[39] !== t24 || $[40] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3 relative",
            children: [
                t17,
                t18,
                t24,
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2041,
            columnNumber: 11
        }, this);
        $[39] = t24;
        $[40] = t26;
        $[41] = t27;
    } else {
        t27 = $[41];
    }
    let t28;
    if ($[42] !== t10 || $[43] !== t16 || $[44] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-10 sm:grid-cols-3",
            children: [
                t10,
                t16,
                t27
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2050,
            columnNumber: 11
        }, this);
        $[42] = t10;
        $[43] = t16;
        $[44] = t27;
        $[45] = t28;
    } else {
        t28 = $[45];
    }
    const t29 = result.original.predictedMovePercent > 0 ? "upward momentum" : "downward pressure";
    let t30;
    if ($[46] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-6 pt-5 border-t border-white/5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-extrabold text-white leading-relaxed italic border-l-2 border-cyan-400/50 pl-4",
                children: [
                    "Verified Insight: The model successfully anticipated the ",
                    t29,
                    " 30 days ago. This history of accurate trend identification increases current forecast confidence."
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 2061,
                columnNumber: 62
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2061,
            columnNumber: 11
        }, this);
        $[46] = t29;
        $[47] = t30;
    } else {
        t30 = $[47];
    }
    let t31;
    if ($[48] !== t28 || $[49] !== t3 || $[50] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 animate-fade-up",
            children: [
                t3,
                t28,
                t30
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2069,
            columnNumber: 11
        }, this);
        $[48] = t28;
        $[49] = t3;
        $[50] = t30;
        $[51] = t31;
    } else {
        t31 = $[51];
    }
    return t31;
}
_c6 = BacktestCard;
function CorrelationMatrix(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2b712b338d65fe35612d7dce84d5edf8244a5a1aa2fd88e94beb39ff1726eb1b";
    }
    const { correlations } = t0;
    if (!correlations || correlations.length === 0) {
        return null;
    }
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: "text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200",
                    children: "Market Trend Synchronization"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 2095,
                    columnNumber: 37
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-bold text-slate-300",
                    children: "90-Day Asset Alignment Analysis"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 2095,
                    columnNumber: 150
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2095,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-6 pb-4 border-b border-white/5",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 2102,
                            columnNumber: 197
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[9px] font-black text-slate-200 uppercase tracking-tighter",
                            children: "Live Alpha Feed"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 2102,
                            columnNumber: 293
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 2102,
                    columnNumber: 99
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2102,
            columnNumber: 10
        }, this);
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== correlations) {
        t3 = correlations.map(_CorrelationMatrixCorrelationsMap);
        $[3] = correlations;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-4 grid-cols-2 lg:grid-cols-4",
            children: t3
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2117,
            columnNumber: 10
        }, this);
        $[5] = t3;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-cyan-400 uppercase tracking-widest mr-2",
            children: "Market Insight:"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2125,
            columnNumber: 10
        }, this);
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 p-5 rounded-2xl bg-white/5 border border-white/10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] text-white leading-relaxed font-black",
                children: [
                    t5,
                    "Assets with higher synchronization (",
                    ">",
                    " 0.70) move in near-lockstep, indicating shared sector sentiment. Use ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-cyan-400",
                        children: "low or inverse correlations"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 2132,
                        columnNumber: 262
                    }, this),
                    " to hedge your portfolio against volatility."
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 2132,
                columnNumber: 82
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2132,
            columnNumber: 10
        }, this);
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] !== t4) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 animate-fade-up",
            children: [
                t2,
                t4,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 2139,
            columnNumber: 10
        }, this);
        $[9] = t4;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    return t7;
}
_c7 = CorrelationMatrix;
function _CorrelationMatrixCorrelationsMap(c, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group p-6 rounded-2xl bg-white/5 border border-white/15 transition-all hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-95 ring-1 ring-white/5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg font-black text-white group-hover:text-cyan-300 transition-colors tracking-tighter uppercase",
                        children: c.symbol
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 2148,
                        columnNumber: 283
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-[11px] font-black px-2 py-0.5 rounded border ${Math.abs(c.score) > 0.75 ? "text-green-400 bg-green-500/20 border-green-500/20" : Math.abs(c.score) > 0.45 ? "text-cyan-400 bg-cyan-500/20 border-cyan-500/20" : "text-slate-100 bg-white/10 border-white/10"}`,
                        children: Math.abs(c.score) > 0.75 ? "HIGH" : Math.abs(c.score) > 0.45 ? "MOD" : "LOW"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 2148,
                        columnNumber: 419
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 2148,
                columnNumber: 227
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 w-full bg-white/10 rounded-full overflow-hidden flex items-center px-0.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(34,211,238,0.4)] ${c.score > 0.7 ? "bg-cyan-400" : c.score > 0.4 ? "bg-cyan-600" : "bg-slate-500"}`,
                            style: {
                                width: `${Math.max(6, Math.min(100, Math.abs(c.score) * 100))}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 2148,
                            columnNumber: 910
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 2148,
                        columnNumber: 816
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] uppercase font-black tracking-widest text-slate-400",
                                children: "Trend Alignment"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 2150,
                                columnNumber: 71
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-black text-white font-mono tracking-tighter",
                                children: c.score.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 2150,
                                columnNumber: 175
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 2150,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 2148,
                columnNumber: 789
            }, this)
        ]
    }, i, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 2148,
        columnNumber: 10
    }, this);
}
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "PriceChart");
__turbopack_context__.k.register(_c1, "Portfolio");
__turbopack_context__.k.register(_c2, "TrendingRecommendations");
__turbopack_context__.k.register(_c3, "HelpSection");
__turbopack_context__.k.register(_c4, "Home");
__turbopack_context__.k.register(_c5, "NewsSentiment");
__turbopack_context__.k.register(_c6, "BacktestCard");
__turbopack_context__.k.register(_c7, "CorrelationMatrix");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a06c1503._.js.map