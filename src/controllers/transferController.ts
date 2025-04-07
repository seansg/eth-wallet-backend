import { Request, Response } from "express";
import { ethers } from "ethers";
import prisma from "../config/db";
import provider from "../config/provider";

export const transfer = async (req: Request, res: Response) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;

    if (!fromAddress || !toAddress || !amount) {
      return res.status(400).json({ error: "請提供發送者地址、收款地址和金額" });
    }

    const senderWalletData = await prisma.wallet.findUnique({ where: { address: fromAddress } });

    if (!senderWalletData) {
      return res.status(404).json({ error: "找不到發送者的錢包" });
    }

    const senderWallet = new ethers.Wallet(senderWalletData.privateKey, provider);
    const value = ethers.parseEther(amount.toString());

    const tx = await senderWallet.sendTransaction({ to: toAddress, value });
    await tx.wait();

    await prisma.transaction.create({
      data: {
        fromAddress: senderWallet.address,
        toAddress: toAddress,
        symbol: 'ETH',
        amount: parseFloat(amount),
        priceAtTx: parseFloat(amount),
        txHash: tx.hash,
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Transfer Error:", error);
    res.status(500).json({ error: "交易失敗" });
  }
};
