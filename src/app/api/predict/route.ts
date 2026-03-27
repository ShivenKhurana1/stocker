import { NextRequest, NextResponse } from "next/server";

import { predictStockFuture } from "@/lib/stockPredictor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseTicker(rawValue: string | null): string {
  const ticker = (rawValue ?? "AAPL").trim().toUpperCase();
  if (!ticker) {
    throw new Error("Ticker is required.");
  }

  return ticker;
}

function parseHorizon(rawValue: string | null): number {
  const fallback = 7;
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed)) {
    throw new Error("Horizon must be a whole number of days.");
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = parseTicker(searchParams.get("symbol"));
    const horizonDays = parseHorizon(searchParams.get("horizon"));
    const asOfDate = searchParams.get("asOfDate") || undefined;
    const prediction = await predictStockFuture({ symbol, horizonDays, asOfDate });

    return NextResponse.json(prediction, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to build prediction. Try a different symbol.";

    const lower = message.toLowerCase();
    const status =
      lower.includes("invalid") ||
        lower.includes("horizon") ||
        lower.includes("ticker")
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}