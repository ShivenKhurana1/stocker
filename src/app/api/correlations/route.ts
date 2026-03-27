import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();
  const peersParam = searchParams.get("peers")?.toUpperCase();

  if (!symbol || !peersParam) {
    return NextResponse.json({ error: "Symbol and peers are required" }, { status: 400 });
  }

  const peers = peersParam.split(",");
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 90);

  try {
    const fetchHistory = async (s: string) => {
      const result = await yahooFinance.chart(s, {
        period1: periodStart,
        period2: periodEnd,
        interval: "1d",
      });
      return {
        symbol: s,
        prices: result.quotes
          .filter(q => q.close !== undefined && q.close !== null)
          .map(q => q.close as number)
      };
    };

    const datasets = await Promise.all([
      fetchHistory(symbol),
      ...peers.map(p => fetchHistory(p))
    ]);

    return NextResponse.json({ datasets });
  } catch (error) {
    console.error("Correlation fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch correlation data" }, { status: 500 });
  }
}
