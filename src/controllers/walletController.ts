import { Request, Response } from "express";
import { ethers } from "ethers";
import prisma from "../config/db";

export const createWallet = async (_: Request, res: Response) => {
  try {
    const wallet = ethers.Wallet.createRandom();

    const newWallet = await prisma.wallet.create({
      data: {
        address: wallet.address,
        privateKey: wallet.privateKey,
      },
    });

    res.json({ success: true, address: newWallet.address });
  } catch (error) {
    console.error("Create Wallet Error:", error);
    res.status(500).json({ error: "錢包建立失敗" });
  }
};

export const getWallets = async (_: Request, res: Response) => {
  try {
    const wallets = await prisma.wallet.findMany();
    res.json({ wallets: wallets.map(wallet => ({
      address: wallet.address
    })) });
  } catch (error) {
    console.error("Get Wallets Error:", error);
    res.status(500).json({ error: "查詢錢包失敗" });
  }
};