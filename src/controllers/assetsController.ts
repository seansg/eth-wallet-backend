import { Request, Response } from "express";
import prisma from "../config/db";
import { getCurrentTokenPrice } from "../services/tokenPriceService";
import getTransactionHashes from "../services/getTransactionHashesService";

export const getAssets = async (req: Request, res: Response) => {
  const { address } = req.params;

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address },
    });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    await getTransactionHashes('sepolia', address)

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAddress: { equals: address, mode: "insensitive" } },
          { toAddress: { equals: address, mode: "insensitive" } }
        ]
      },
      orderBy: { createdAt: "desc" },
    });

    const symbolSet = new Set([
      ...transactions.map((tx) => tx.symbol),
    ]);

    const prices = await getCurrentTokenPrice([...symbolSet]);

    const assets = [...symbolSet].map((symbol) => {
      const currentPrice = prices[symbol] || 0;

      let holdingAmount = 0;
      let totalCost = 0;

      transactions.forEach(tx => {
        totalCost += tx.amount * tx.priceAtTx;
        holdingAmount += tx.amount;
      });

      const averageCost = totalCost / holdingAmount;
      const currentValue = holdingAmount * currentPrice;
      const pnl = (currentValue - totalCost) / totalCost * 100;

      return {
        symbol,
        holdingAmount,
        averageCost,
        currentPrice,
        pnl,
      };
    });

    res.json({ wallet: wallet.address, assets });
  } catch (error) {
    console.error("Get Wallet Assets Error:", error);
    res.status(500).json({ error: "查詢持有資產失敗" });
  }
};
