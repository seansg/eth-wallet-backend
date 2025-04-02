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
