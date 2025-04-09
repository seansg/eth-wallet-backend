import axios from "axios";

export const getCurrentTokenPrice = async (symbols: string[]) => {
  const prices: { [symbol: string]: number } = {};

  await Promise.all(symbols.map(async (symbol: string) => {
    prices[symbol] = 0;
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
      prices[symbol] = parseFloat(response.data.price);
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw new Error("無法取得 Token 價格");
    }
  }));

  return prices;
};

export const getPriceAtTime = async (symbol: string, targetTime: number) => {
  const baseURL = "https://api.binance.com/api/v3/klines";
  const interval = "1m";

  const params = {
    symbol,
    interval,
    startTime: targetTime * 1000,
    limit: 1,
  };

  try {
    const response = await axios.get(baseURL, { params });
    const klines = response.data;

    const closest = klines.reduce((prev: number[], curr: number[]) => {
      const prevDiff = Math.abs(prev[0] - targetTime);
      const currDiff = Math.abs(curr[0] - targetTime);
      return currDiff < prevDiff ? curr : prev;
    });

    return {
      openTime: closest[0],
      openPrice: closest[1],
      highPrice: closest[2],
      lowPrice: closest[3],
      closePrice: closest[4],
    };
  } catch (error) {
    console.error("Error fetching price:", (error as Error).message);
    return null;
  }
};