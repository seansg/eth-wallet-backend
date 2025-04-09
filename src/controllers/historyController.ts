import { Request, Response } from "express";
import prisma from "../config/db";
import getTransactionHashes from "../services/getTransactionHashesService";

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

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

    res.json({ address, transactions });
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ error: "查詢交易紀錄失敗" });
  }
};
