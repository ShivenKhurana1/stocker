import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  try {
    const result = await yahooFinance.quote(symbol);
    return NextResponse.json({
      symbol,
      price: result.regularMarketPrice || result.postMarketPrice || result.preMarketPrice,
      currency: result.currency,
      name: result.longName || result.shortName,
    });
  } catch (error) {
    console.error(`Market data error for ${symbol}:`, error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
