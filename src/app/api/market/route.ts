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
    const [quote, searchResult] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.search(symbol, { newsCount: 5 })
    ]);

    return NextResponse.json({
      symbol,
      price: quote.regularMarketPrice || quote.postMarketPrice || quote.preMarketPrice,
      currency: quote.currency,
      name: quote.longName || quote.shortName,
      news: searchResult.news?.map(item => ({
        title: item.title,
        publisher: item.publisher,
        link: item.link
      })) || []
    });
  } catch (error) {
    console.error(`Market data error for ${symbol}:`, error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
