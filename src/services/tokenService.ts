import axios from "axios";

export const getTokenPrice = async (symbols: string[]) => {
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
